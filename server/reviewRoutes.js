const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Review = require('./models/Review');
const ReviewReport = require('./models/ReviewReport');
const { verifyToken } = require('./middleware/auth');

const parseUserFromToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  try {
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.id || null;
  } catch (_error) {
    return null;
  }
};

router.get('/:recipeId', async (req, res) => {
  try {
    const reviews = await Review.find({
      recipeId: req.params.recipeId,
      status: 'approved'
    }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { recipeId, name, email, rating, comment } = req.body;

    if (!recipeId || !name || !email || !rating || !comment) {
      return res.status(400).json({ error: 'All review fields are required' });
    }

    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const userId = parseUserFromToken(req.headers.authorization);

    const review = new Review({
      recipeId,
      userId,
      name,
      email,
      rating: parsedRating,
      comment,
      status: 'approved'
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

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

    if (review.userId && review.userId.toString() === req.user.id) {
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

    res.status(201).json({
      success: true,
      message: 'Report submitted. Admin will review it shortly.',
      report
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
