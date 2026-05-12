const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { verifyToken, requireRole } = require('./middleware/auth');
const User = require('./models/User');
const Review = require('./models/Review');
const Recipe = require('./models/Recipe');
const ModerationLog = require('./models/ModerationLog');
const ReviewReport = require('./models/ReviewReport');

const ROLES = ['user', 'admin'];

const createModerationLog = async ({ adminId, action, targetType, targetId, reason = '', details = {} }) => {
  await ModerationLog.create({
    adminId,
    action,
    targetType,
    targetId,
    reason,
    details
  });
};

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  isBanned: user.isBanned,
  bannedAt: user.bannedAt,
  bannedReason: user.bannedReason,
  createdAt: user.createdAt
});

const serializeRecipe = (recipe) => ({
  id: recipe._id,
  title: recipe.title,
  description: recipe.description,
  image: recipe.image,
  category: recipe.category,
  cuisine: recipe.cuisine,
  ingredients: recipe.ingredients,
  instructions: recipe.instructions,
  prepTime: recipe.prepTime,
  cookingTime: recipe.cookingTime,
  servings: recipe.servings,
  calories: recipe.calories,
  tags: recipe.tags,
  isApproved: recipe.isApproved,
  isActive: recipe.isActive,
  createdAt: recipe.createdAt,
  updatedAt: recipe.updatedAt,
  createdBy: recipe.createdBy
    ? {
        id: recipe.createdBy._id || recipe.createdBy,
        username: recipe.createdBy.username
      }
    : null
});

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
};

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

router.use(verifyToken, requireRole('admin'));

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find()
      .select('username email role isBanned bannedAt bannedReason createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role = 'user', reason = '' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role
    });

    await newUser.save();

    await createModerationLog({
      adminId: req.user.id,
      action: 'USER_CREATE',
      targetType: 'user',
      targetId: newUser._id,
      reason,
      details: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

    res.status(201).json({ success: true, user: serializeUser(newUser) });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const { username, email, password, reason = '' } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const before = {
      username: user.username,
      email: user.email
    };

    if (username !== undefined) {
      if (username.trim().length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
      }
      user.username = username.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();
      const existingEmail = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (existingEmail) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      user.email = normalizedEmail;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const after = { username: user.username, email: user.email };
    await createModerationLog({
      adminId: req.user.id,
      action: 'USER_UPDATE',
      targetType: 'user',
      targetId: user._id,
      reason,
      details: {
        before,
        after
      }
    });

    res.json({ success: true, user: serializeUser(user) });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isBanned: false });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last active admin' });
      }
    }

    await User.findByIdAndDelete(user._id);

    await createModerationLog({
      adminId: req.user.id,
      action: 'USER_DELETE',
      targetType: 'user',
      targetId: user._id,
      reason,
      details: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role, reason = '' } = req.body;
    if (!ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser._id.toString() === req.user.id && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own admin role' });
    }

    if (targetUser.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isBanned: false });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot demote the last active admin' });
      }
    }

    const previousRole = targetUser.role;
    targetUser.role = role;
    await targetUser.save();

    if (previousRole !== role) {
      await createModerationLog({
        adminId: req.user.id,
        action: role === 'admin' ? 'USER_PROMOTE' : 'USER_DEMOTE',
        targetType: 'user',
        targetId: targetUser._id,
        reason,
        details: {
          username: targetUser.username,
          email: targetUser.email,
          before: { role: previousRole },
          after: { role }
        }
      });
    }

    res.json({
      success: true,
      message: 'User role updated',
      user: {
        id: targetUser._id,
        username: targetUser.username,
        email: targetUser.email,
        role: targetUser.role,
        isBanned: targetUser.isBanned,
        bannedAt: targetUser.bannedAt,
        bannedReason: targetUser.bannedReason,
        createdAt: targetUser.createdAt
      }
    });
  } catch (error) {
    console.error('Admin update user role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/users/:id/ban', async (req, res) => {
  try {
    const { isBanned, reason = '' } = req.body;

    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({ error: 'isBanned must be boolean' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser._id.toString() === req.user.id && isBanned) {
      return res.status(400).json({ error: 'You cannot ban your own account' });
    }

    if (targetUser.role === 'admin' && isBanned) {
      const adminCount = await User.countDocuments({ role: 'admin', isBanned: false });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot ban the last active admin' });
      }
    }

    const previousStatus = targetUser.isBanned;
    targetUser.isBanned = isBanned;
    targetUser.bannedAt = isBanned ? new Date() : null;
    targetUser.bannedReason = isBanned ? reason : '';
    await targetUser.save();

    if (previousStatus !== isBanned) {
      await createModerationLog({
        adminId: req.user.id,
        action: isBanned ? 'USER_BAN' : 'USER_UNBAN',
        targetType: 'user',
        targetId: targetUser._id,
        reason,
        details: {
          username: targetUser.username,
          email: targetUser.email,
          before: { isBanned: previousStatus },
          after: { isBanned }
        }
      });
    }

    res.json({
      success: true,
      message: isBanned ? 'User banned' : 'User unbanned',
      user: {
        id: targetUser._id,
        username: targetUser.username,
        email: targetUser.email,
        role: targetUser.role,
        isBanned: targetUser.isBanned,
        bannedAt: targetUser.bannedAt,
        bannedReason: targetUser.bannedReason,
        createdAt: targetUser.createdAt
      }
    });
  } catch (error) {
    console.error('Admin ban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/reviews', async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const query = status === 'all' ? {} : { status };

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('moderatedBy', 'username email');

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Admin get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const query = status === 'all' ? {} : { status };

    const reports = await ReviewReport.find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('reporterId', 'username email')
      .populate('decidedBy', 'username email')
      .populate('reviewId');

    res.json({ success: true, reports });
  } catch (error) {
    console.error('Admin get reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/reports/:id', async (req, res) => {
  try {
    const { status, decisionNote = '' } = req.body;

    if (!['resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Status must be resolved or dismissed' });
    }

    const report = await ReviewReport.findById(req.params.id).populate('reviewId');
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const previousStatus = report.status;
    const targetReviewId = report.reviewId?._id || report.reviewId;

    report.status = status;
    report.decisionNote = decisionNote;
    report.decidedBy = req.user.id;
    report.decidedAt = new Date();
    await report.save();

    const bulkUpdateResult = await ReviewReport.updateMany(
      {
        _id: { $ne: report._id },
        reviewId: targetReviewId,
        status: 'pending'
      },
      {
        $set: {
          status,
          decisionNote,
          decidedBy: req.user.id,
          decidedAt: new Date()
        }
      }
    );

    await createModerationLog({
      adminId: req.user.id,
      action: status === 'resolved' ? 'REPORT_RESOLVED' : 'REPORT_DISMISSED',
      targetType: 'review',
      targetId: targetReviewId,
      reason: decisionNote,
      details: {
        reportId: report._id,
        before: { status: previousStatus },
        after: { status },
        additionalReportsUpdated: bulkUpdateResult.modifiedCount || 0
      }
    });

    res.json({ success: true, message: 'Report decision saved', report });
  } catch (error) {
    console.error('Admin decide report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/recipes', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const recipes = await Recipe.find(query)
      .sort({ updatedAt: -1 })
      .limit(200)
      .populate('createdBy', 'username');

    res.json({ success: true, recipes: recipes.map(serializeRecipe) });
  } catch (error) {
    console.error('Admin get recipes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/recipes', async (req, res) => {
  try {
    const {
      title,
      description = '',
      image = '',
      category = '',
      cuisine = '',
      ingredients = [],
      instructions = '',
      prepTime,
      cookingTime,
      servings,
      calories,
      tags = [],
      reason = ''
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Recipe title is required' });
    }

    const recipe = new Recipe({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      category: category.trim(),
      cuisine: cuisine.trim(),
      ingredients: normalizeStringArray(ingredients),
      instructions: instructions.trim(),
      tags: normalizeStringArray(tags),
      createdBy: req.user.id,
      isApproved: true
    });

    const parsedPrepTime = parseOptionalNumber(prepTime);
    const parsedCookingTime = parseOptionalNumber(cookingTime);
    const parsedServings = parseOptionalNumber(servings);
    const parsedCalories = parseOptionalNumber(calories);

    if (parsedPrepTime !== undefined) {
      recipe.prepTime = parsedPrepTime;
    }
    if (parsedCookingTime !== undefined) {
      recipe.cookingTime = parsedCookingTime;
    }
    if (parsedServings !== undefined) {
      recipe.servings = parsedServings;
    }
    if (parsedCalories !== undefined) {
      recipe.calories = parsedCalories;
    }

    await recipe.save();

    await createModerationLog({
      adminId: req.user.id,
      action: 'RECIPE_CREATE',
      targetType: 'recipe',
      targetId: recipe._id,
      reason,
      details: {
        title: recipe.title,
        category: recipe.category
      }
    });

    res.status(201).json({ success: true, recipe: serializeRecipe(recipe) });
  } catch (error) {
    console.error('Admin create recipe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/recipes/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      cuisine,
      ingredients,
      instructions,
      prepTime,
      cookingTime,
      servings,
      calories,
      tags,
      isApproved,
      isActive,
      reason = ''
    } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const before = {
      title: recipe.title,
      category: recipe.category,
      cuisine: recipe.cuisine,
      isApproved: recipe.isApproved
    };

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ error: 'Recipe title cannot be empty' });
      }
      recipe.title = title.trim();
    }

    if (description !== undefined) {
      recipe.description = description.trim();
    }

    if (image !== undefined) {
      recipe.image = image.trim();
    }

    if (category !== undefined) {
      recipe.category = category.trim();
    }

    if (cuisine !== undefined) {
      recipe.cuisine = cuisine.trim();
    }

    if (ingredients !== undefined) {
      recipe.ingredients = normalizeStringArray(ingredients);
    }

    if (instructions !== undefined) {
      recipe.instructions = instructions.trim();
    }

    const parsedPrepTime = parseOptionalNumber(prepTime);
    const parsedCookingTime = parseOptionalNumber(cookingTime);
    const parsedServings = parseOptionalNumber(servings);
    const parsedCalories = parseOptionalNumber(calories);

    if (parsedPrepTime !== undefined) {
      recipe.prepTime = parsedPrepTime;
    }
    if (parsedCookingTime !== undefined) {
      recipe.cookingTime = parsedCookingTime;
    }
    if (parsedServings !== undefined) {
      recipe.servings = parsedServings;
    }
    if (parsedCalories !== undefined) {
      recipe.calories = parsedCalories;
    }

    if (tags !== undefined) {
      recipe.tags = normalizeStringArray(tags);
    }

    if (typeof isApproved === 'boolean') {
      recipe.isApproved = isApproved;
    }

    if (typeof isActive === 'boolean') {
      recipe.isActive = isActive;
    }

    await recipe.save();

    const approvalChanged = before.isApproved !== recipe.isApproved;

    await createModerationLog({
      adminId: req.user.id,
      action: approvalChanged
        ? recipe.isApproved
          ? 'RECIPE_APPROVE'
          : 'RECIPE_REJECT'
        : 'RECIPE_UPDATE',
      targetType: 'recipe',
      targetId: recipe._id,
      reason,
      details: {
        before,
        after: {
          title: recipe.title,
          category: recipe.category,
          cuisine: recipe.cuisine,
          isApproved: recipe.isApproved
        }
      }
    });

    res.json({ success: true, recipe: serializeRecipe(recipe) });
  } catch (error) {
    console.error('Admin update recipe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/recipes/:id', async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await Recipe.findByIdAndDelete(recipe._id);

    await createModerationLog({
      adminId: req.user.id,
      action: 'RECIPE_DELETE',
      targetType: 'recipe',
      targetId: recipe._id,
      reason,
      details: {
        title: recipe.title,
        category: recipe.category
      }
    });

    res.json({ success: true, message: 'Recipe deleted' });
  } catch (error) {
    console.error('Admin delete recipe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const { comment, rating, status, reason = '' } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const before = {
      comment: review.comment,
      rating: review.rating,
      status: review.status
    };

    if (typeof comment === 'string' && comment.trim()) {
      review.comment = comment.trim();
    }

    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      review.rating = parsedRating;
    }

    if (status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      review.status = status;
    }

    review.moderatedBy = req.user.id;
    review.moderationNote = reason;
    await review.save();

    const statusChanged = before.status !== review.status;

    await createModerationLog({
      adminId: req.user.id,
      action: statusChanged ? 'REVIEW_STATUS_CHANGE' : 'REVIEW_EDIT',
      targetType: 'review',
      targetId: review._id,
      reason,
      details: {
        before,
        after: {
          comment: review.comment,
          rating: review.rating,
          status: review.status
        }
      }
    });

    res.json({ success: true, message: 'Review updated', review });
  } catch (error) {
    console.error('Admin update review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const { reason = '' } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);

    await createModerationLog({
      adminId: req.user.id,
      action: 'REVIEW_DELETE',
      targetType: 'review',
      targetId: review._id,
      reason,
      details: {
        deletedReview: {
          recipeId: review.recipeId,
          name: review.name,
          email: review.email,
          rating: review.rating,
          comment: review.comment,
          status: review.status
        }
      }
    });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const { action, limit = 100 } = req.query;
    const parsedLimit = Math.min(Number(limit) || 100, 300);
    const query = action ? { action } : {};

    const logs = await ModerationLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .populate('adminId', 'username email');

    const logObjects = logs.map((log) => log.toObject());
    const userTargetIds = logObjects
      .filter((log) => log.targetType === 'user')
      .map((log) => log.targetId);
    const reviewTargetIds = logObjects
      .filter((log) => log.targetType === 'review')
      .map((log) => log.targetId);
    const recipeTargetIds = logObjects
      .filter((log) => log.targetType === 'recipe')
      .map((log) => log.targetId);

    const [targetUsers, targetReviews, targetRecipes] = await Promise.all([
      userTargetIds.length > 0
        ? User.find({ _id: { $in: userTargetIds } }).select('username email')
        : Promise.resolve([]),
      reviewTargetIds.length > 0
        ? Review.find({ _id: { $in: reviewTargetIds } }).select('username name email')
        : Promise.resolve([]),
      recipeTargetIds.length > 0
        ? Recipe.find({ _id: { $in: recipeTargetIds } }).select('title')
        : Promise.resolve([])
    ]);

    const userMap = new Map(targetUsers.map((user) => [user._id.toString(), user]));
    const reviewMap = new Map(targetReviews.map((review) => [review._id.toString(), review]));
    const recipeMap = new Map(targetRecipes.map((recipe) => [recipe._id.toString(), recipe]));

    const hydratedLogs = logObjects.map((log) => {
      let targetUsername = '';
      if (log.targetType === 'user') {
        targetUsername = userMap.get(log.targetId?.toString())?.username || log.details?.username || '';
      } else if (log.targetType === 'review') {
        const review = reviewMap.get(log.targetId?.toString());
        targetUsername = review?.username || review?.name || log.details?.username || log.details?.deletedReview?.name || '';
      } else if (log.targetType === 'recipe') {
        targetUsername = recipeMap.get(log.targetId?.toString())?.title || log.details?.title || '';
      }
      return { ...log, targetUsername };
    });

    res.json({ success: true, logs: hydratedLogs });
  } catch (error) {
    console.error('Admin get logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/logs/:id/reason', async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const log = await ModerationLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: 'Moderation log not found' });
    }

    const previousReason = log.reason || '';
    log.reason = reason;
    await log.save();

    await createModerationLog({
      adminId: req.user.id,
      action: 'LOG_REASON_UPDATE',
      targetType: log.targetType,
      targetId: log.targetId,
      reason,
      details: {
        logId: log._id,
        before: { reason: previousReason },
        after: { reason }
      }
    });

    res.json({ success: true, log });
  } catch (error) {
    console.error('Admin update log reason error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logs/:id/reverse', async (req, res) => {
  try {
    const { reason = '' } = req.body;
    const log = await ModerationLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: 'Moderation log not found' });
    }

    if (log.targetType !== 'user') {
      return res.status(400).json({ error: 'Only user actions can be reversed right now' });
    }

    const user = await User.findById(log.targetId);
    if (!user) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    let action = '';
    let updates = {};

    if (log.action === 'USER_BAN') {
      updates = { isBanned: false, bannedAt: null, bannedReason: '' };
      action = 'USER_UNBAN';
    } else if (log.action === 'USER_UNBAN') {
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({ error: 'You cannot ban your own account' });
      }
      if (user.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin', isBanned: false });
        if (adminCount <= 1) {
          return res.status(400).json({ error: 'Cannot ban the last active admin' });
        }
      }
      updates = { isBanned: true, bannedAt: new Date(), bannedReason: reason };
      action = 'USER_BAN';
    } else if (log.action === 'USER_PROMOTE') {
      const adminCount = await User.countDocuments({ role: 'admin', isBanned: false });
      if (adminCount <= 1 && user.role === 'admin') {
        return res.status(400).json({ error: 'Cannot demote the last active admin' });
      }
      updates = { role: 'user' };
      action = 'USER_DEMOTE';
    } else if (log.action === 'USER_DEMOTE') {
      updates = { role: 'admin' };
      action = 'USER_PROMOTE';
    } else {
      return res.status(400).json({ error: 'This action cannot be reversed' });
    }

    Object.assign(user, updates);
    await user.save();

    await createModerationLog({
      adminId: req.user.id,
      action,
      targetType: 'user',
      targetId: user._id,
      reason,
      details: {
        reversedFrom: log._id,
        updates
      }
    });

    res.json({ success: true, message: 'Action reversed', user: serializeUser(user) });
  } catch (error) {
    console.error('Admin reverse action error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
