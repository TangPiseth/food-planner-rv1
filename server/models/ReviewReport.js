const mongoose = require('mongoose');

const reviewReportSchema = new mongoose.Schema(
  {
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
      index: true
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
      index: true
    },
    decisionNote: {
      type: String,
      trim: true,
      default: ''
    },
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    decidedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

reviewReportSchema.index({ status: 1, createdAt: -1 });
reviewReportSchema.index({ reviewId: 1, reporterId: 1, status: 1 });

const ReviewReport = mongoose.model('ReviewReport', reviewReportSchema);

module.exports = ReviewReport;
