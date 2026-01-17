const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Review = require('./models/Review');
const User = require('./models/User');

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get average rating for a recipe
router.get('/rating/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const result = await Review.aggregate([
      { $match: { recipeId: recipeId } },
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

    res.json({
      success: true,
      recipeId,
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews
    });
  } catch (error) {
    console.error('Get rating error:', error);
    res.status(500).json({ error: 'Server error while fetching rating' });
  }
});

// Get ratings for multiple recipes at once (for recipe list pages)
router.post('/ratings/batch', async (req, res) => {
  try {
    const { recipeIds } = req.body;
    
    if (!recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({ error: 'recipeIds array is required' });
    }

    const results = await Review.aggregate([
      { $match: { recipeId: { $in: recipeIds } } },
      { 
        $group: {
          _id: '$recipeId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const ratingsMap = {};
    results.forEach(r => {
      ratingsMap[r._id] = {
        averageRating: Math.round(r.averageRating * 10) / 10,
        totalReviews: r.totalReviews
      };
    });

    recipeIds.forEach(id => {
      if (!ratingsMap[id]) {
        ratingsMap[id] = { averageRating: 0, totalReviews: 0 };
      }
    });

    res.json({
      success: true,
      ratings: ratingsMap
    });
  } catch (error) {
    console.error('Get batch ratings error:', error);
    res.status(500).json({ error: 'Server error while fetching ratings' });
  }
});

// Create a new review (requires authentication)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { recipeId, recipeTitle, rating, comment } = req.body;

    // Validate input
    if (!recipeId || !recipeTitle || !rating || !comment) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user already reviewed this recipe
    const existingReview = await Review.findOne({ 
      userId: req.user.id, 
      recipeId 
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this recipe. Please edit your existing review.' });
    }

    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new review
    const review = new Review({
      userId: req.user.id,
      username: user.username,
      recipeId,
      recipeTitle,
      rating: parseInt(rating),
      comment
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: {
        id: review._id,
        userId: review.userId,
        username: review.username,
        recipeId: review.recipeId,
        recipeTitle: review.recipeTitle,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this recipe' });
    }
    res.status(500).json({ error: 'Server error while creating review' });
  }
});

// Get all reviews for a specific recipe (public)
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipeId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        userId: review.userId,
        username: review.username,
        recipeId: review.recipeId,
        recipeTitle: review.recipeTitle,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error while fetching reviews' });
  }
});

// Get all reviews by current user (requires authentication)
router.get('/user', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review._id,
        userId: review.userId,
        username: review.username,
        recipeId: review.recipeId,
        recipeTitle: review.recipeTitle,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ error: 'Server error while fetching user reviews' });
  }
});

// Update a review (requires authentication and ownership)
router.put('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check ownership
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    // Update the review
    review.rating = parseInt(rating);
    review.comment = comment;
    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: {
        id: review._id,
        userId: review.userId,
        username: review.username,
        recipeId: review.recipeId,
        recipeTitle: review.recipeTitle,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Server error while updating review' });
  }
});

// Delete a review (requires authentication and ownership)
router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check ownership
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Server error while deleting review' });
  }
});

// Check if current user has reviewed a specific recipe
router.get('/check/:recipeId', verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const review = await Review.findOne({ 
      userId: req.user.id, 
      recipeId 
    });

    res.json({
      success: true,
      hasReviewed: !!review,
      review: review ? {
        id: review._id,
        userId: review.userId,
        username: review.username,
        recipeId: review.recipeId,
        recipeTitle: review.recipeTitle,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      } : null
    });
  } catch (error) {
    console.error('Check review error:', error);
    res.status(500).json({ error: 'Server error while checking review' });
  }
});

module.exports = router;
