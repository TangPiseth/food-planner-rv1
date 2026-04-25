const express = require('express');
const router = express.Router();

const { verifyToken, requireRole } = require('./middleware/auth');
const User = require('./models/User');
const Review = require('./models/Review');
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

    res.json({ success: true, logs });
  } catch (error) {
    console.error('Admin get logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
