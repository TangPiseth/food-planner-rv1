const express = require('express');
const router = express.Router();

const Review = require('./models/Review');
const ReviewReport = require('./models/ReviewReport');
const User = require('./models/User');
const { verifyToken } = require('./middleware/auth');

const normalizeReview = (reviewDoc) => {
  if (!reviewDoc) {
    return null;
  }

  const review = reviewDoc.toObject ? reviewDoc.toObject() : reviewDoc;
  const id = review._id?.toString?.() || review.id;
  const userId = review.userId?.toString?.() || review.userId || null;

  return {
    id,
    _id: id,
    userId,
    username: review.username || review.name || 'User',
    name: review.name || review.username || 'User',
    email: review.email || '',
    recipeId: review.recipeId,
    recipeTitle: review.recipeTitle || '',
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt
  };
};

// Public: get average rating for a recipe.
router.get('/rating/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;

    const result = await Review.aggregate([
      { $match: { recipeId, status: 'approved' } },
      {
        $group: {
          _id: '$recipeId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        success: true,
        recipeId,
        averageRating: 0,
        totalReviews: 0
      });
    }

    return res.json({
      success: true,
      recipeId,
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews
    });
  } catch (error) {
    console.error('Get rating error:', error);
    return res.status(500).json({ error: 'Server error while fetching rating' });
  }
});

// Public: get ratings for multiple recipes.
router.post('/ratings/batch', async (req, res) => {
  try {
    const { recipeIds } = req.body;

    if (!Array.isArray(recipeIds)) {
      return res.status(400).json({ error: 'recipeIds array is required' });
    }

    const results = await Review.aggregate([
      { $match: { recipeId: { $in: recipeIds }, status: 'approved' } },
      {
        $group: {
          _id: '$recipeId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const ratingsMap = {};

    results.forEach((item) => {
      ratingsMap[item._id] = {
        averageRating: Math.round(item.averageRating * 10) / 10,
        totalReviews: item.totalReviews
      };
    });

    recipeIds.forEach((recipeId) => {
      if (!ratingsMap[recipeId]) {
        ratingsMap[recipeId] = { averageRating: 0, totalReviews: 0 };
      }
    });

    return res.json({ success: true, ratings: ratingsMap });
  } catch (error) {
    console.error('Get batch ratings error:', error);
    return res.status(500).json({ error: 'Server error while fetching ratings' });
  }
});

// Public: get approved reviews for a recipe.
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipeId, status: 'approved' }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      reviews: reviews.map((review) => normalizeReview(review))
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ error: 'Server error while fetching reviews' });
  }
});

// Auth: create a review (logged-in users only).
router.post('/', verifyToken, async (req, res) => {
  try {
    const { recipeId, recipeTitle = '', rating, comment } = req.body;

    if (!recipeId || !rating || !comment) {
      return res.status(400).json({ error: 'recipeId, rating, and comment are required' });
    }

    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const existingReview = await Review.findOne({ userId: req.user.id, recipeId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this recipe. Please edit your existing review.' });
    }

    const user = await User.findById(req.user.id).select('username email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const review = new Review({
      recipeId,
      recipeTitle,
      userId: req.user.id,
      username: user.username,
      name: user.username,
      email: user.email || '',
      rating: parsedRating,
      comment: comment.trim(),
      status: 'approved'
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: normalizeReview(review)
    });
  } catch (error) {
    console.error('Create review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this recipe' });
    }
    return res.status(500).json({ error: 'Server error while creating review' });
  }
});

// Auth: get all reviews by current user.
router.get('/user', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      reviews: reviews.map((review) => normalizeReview(review))
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    return res.status(500).json({ error: 'Server error while fetching user reviews' });
  }
});

// Auth: check if current user already reviewed this recipe.
router.get('/check/:recipeId', verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.params;

    const review = await Review.findOne({ userId: req.user.id, recipeId });

    return res.json({
      success: true,
      hasReviewed: !!review,
      review: review ? normalizeReview(review) : null
    });
  } catch (error) {
    console.error('Check review error:', error);
    return res.status(500).json({ error: 'Server error while checking review status' });
  }
});

// Auth: update own review.
router.put('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    review.rating = parsedRating;
    review.comment = comment.trim();
    review.status = 'approved';
    await review.save();

    return res.json({
      success: true,
      message: 'Review updated successfully',
      review: normalizeReview(review)
    });
  } catch (error) {
    console.error('Update review error:', error);
    return res.status(500).json({ error: 'Server error while updating review' });
  }
});

// Auth: delete own review.
router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return res.status(500).json({ error: 'Server error while deleting review' });
  }
});

// Auth: report a review.
router.post('/:reviewId/report', verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Report reason is required' });
    }

    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId?.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot report your own review' });
    }

    const existingPendingReport = await ReviewReport.findOne({
      reviewId: review._id,
      reporterId: req.user.id,
      status: 'pending'
    });

    if (existingPendingReport) {
      return res.status(400).json({ error: 'You have already reported this review' });
    }

    const report = new ReviewReport({
      reviewId: review._id,
      reporterId: req.user.id,
      reason: reason.trim(),
      status: 'pending'
    });

    await report.save();

    return res.status(201).json({
      success: true,
      message: 'Report submitted. Admin will review it shortly.',
      report
    });
  } catch (error) {
    console.error('Report review error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
