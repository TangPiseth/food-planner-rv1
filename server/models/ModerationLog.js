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
        'RECIPE_CREATE',
        'RECIPE_UPDATE',
        'RECIPE_DELETE',
        'RECIPE_APPROVE',
        'RECIPE_REJECT',
        'USER_CREATE',
        'USER_UPDATE',
        'USER_DELETE',
        'USER_PROMOTE',
        'USER_DEMOTE',
        'USER_BAN',
        'USER_UNBAN',
        'LOG_REASON_UPDATE',
        'REPORT_RESOLVED',
        'REPORT_DISMISSED'
      ],
      index: true
    },
    targetType: {
      type: String,
      required: true,
      enum: ['review', 'user', 'recipe'],
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
