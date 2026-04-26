const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'REVIEW_EDIT',
        'REVIEW_DELETE',
        'REVIEW_STATUS_CHANGE',
        'USER_PROMOTE',
        'USER_DEMOTE',
        'USER_BAN',
        'USER_UNBAN',
        'REPORT_RESOLVED',
        'REPORT_DISMISSED'
      ],
      index: true
    },
    targetType: {
      type: String,
      required: true,
      enum: ['review', 'user'],
      index: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    reason: {
      type: String,
      trim: true,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

moderationLogSchema.index({ createdAt: -1 });

const ModerationLog = mongoose.model('ModerationLog', moderationLogSchema);

module.exports = ModerationLog;
