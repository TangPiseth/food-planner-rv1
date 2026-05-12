<template>
  <div class="review-form-compact" data-aos="fade-up">
    <div v-if="!isLoggedIn" class="login-prompt">
      <div class="review-form-icon">
        <i class="fa-solid fa-lock"></i>
      </div>
      <h5>Login to Leave a Review</h5>
      <p>Please login to share your thoughts about this recipe.</p>
      <router-link to="/login" class="review-submit-btn">
        <i class="fa-solid fa-sign-in-alt"></i>
        <span>Login Now</span>
      </router-link>
    </div>

    <div v-else class="review-form-shell">
      <div
        v-show="showAlert"
        :class="['review-alert', alertType === 'success' ? 'alert-success' : 'alert-danger']"
        role="alert"
      >
        <i
          :class="['fa-solid', alertType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle']"
        ></i>
        {{ alertMessage }}
      </div>

      <div class="review-form-header">
        <div class="review-form-header-text">
          <span class="review-eyebrow">Your feedback</span>
          <h4>{{ isEditMode ? 'Edit Your Review' : 'Leave a Review' }}</h4>
          <p v-if="isEditMode">Update your rating and notes for this recipe.</p>
          <p v-else>
            Reviewing as <strong>{{ currentUser?.username }}</strong>
          </p>
        </div>
        <button v-show="isEditMode" @click="cancelEdit" class="review-cancel-btn" type="button">
          <i class="fa-solid fa-times"></i>
          <span>Cancel</span>
        </button>
      </div>

      <form class="review-form-grid" @submit.prevent="handleSubmit">
        <div class="review-field rating-field">
          <label>Your Rating *</label>
          <div class="star-rating-container">
            <div class="star-rating">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ active: star <= (hoverRating || formData.rating) }"
                @click="setRating(star)"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
              >
                <i class="fa-solid fa-star"></i>
              </span>
            </div>
            <span class="rating-text ms-2" v-if="formData.rating > 0">
              {{ ratingLabels[formData.rating] }}
            </span>
          </div>
          <div class="field-error" v-if="errors.rating">{{ errors.rating }}</div>
        </div>

        <div class="review-field">
          <label>Your Review *</label>
          <textarea
            class="review-textarea"
            :class="{ 'is-invalid': errors.review }"
            v-model="formData.review"
            rows="5"
            placeholder="Share your experience with this recipe... What did you like? Any tips for others?"
            maxlength="500"
          ></textarea>
          <div class="field-footer">
            <span class="field-error" v-if="errors.review">{{ errors.review }}</span>
            <span>{{ formData.review.length }}/500</span>
          </div>
        </div>

        <div class="review-submit-row">
          <button type="submit" class="review-submit-btn" :disabled="isSubmitting">
            <span v-show="isSubmitting" class="spinner-border spinner-border-sm"></span>
            <i v-show="!isSubmitting" :class="['fa-solid', isEditMode ? 'fa-save' : 'fa-paper-plane']"></i>
            <span>{{ isSubmitting ? 'Submitting...' : (isEditMode ? 'Update Review' : 'Post Review') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { createReview, updateReview, checkUserReview } from '@/services/reviewService';

export default {
  name: 'RecipeReviewForm',
  props: {
    recipeId: {
      type: String,
      required: true
    },
    recipeTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {
        review: '',
        rating: 0
      },
      currentUser: null,
      isLoggedIn: false,
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
      errors: {},
      hoverRating: 0,
      isSubmitting: false,
      isEditMode: false,
      existingReviewId: null,
      alertTimeoutId: null,
      ratingLabels: {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      }
    };
  },
  async mounted() {
    this.isLoggedIn = isAuthenticated();
    if (this.isLoggedIn) {
      this.currentUser = await getCurrentUser();
      await this.checkExistingReview();
    }
  },
  beforeUnmount() {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
    }
  },
  watch: {
    recipeId: {
      async handler() {
        if (this.isLoggedIn) {
          await this.checkExistingReview();
        }
      }
    }
  },
  methods: {
    async checkExistingReview() {
      const result = await checkUserReview(this.recipeId);
      if (result.success && result.hasReviewed && result.review) {
        this.isEditMode = true;
        this.existingReviewId = result.review.id || result.review._id;
        this.formData.rating = result.review.rating;
        this.formData.review = result.review.comment;
      } else {
        this.isEditMode = false;
        this.existingReviewId = null;
        this.formData.rating = 0;
        this.formData.review = '';
      }
    },
    setRating(rating) {
      this.formData.rating = rating;
    },
    validateForm() {
      const errors = {};

      if (!this.formData.review.trim()) {
        errors.review = 'Please write a review';
      } else if (this.formData.review.trim().length < 10) {
        errors.review = 'Review must be at least 10 characters';
      }

      if (!this.formData.rating || this.formData.rating === 0) {
        errors.rating = 'Please select a rating';
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    cancelEdit() {
      this.isEditMode = false;
      this.existingReviewId = null;
      this.formData.rating = 0;
      this.formData.review = '';
      this.errors = {};
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      const wasEditMode = this.isEditMode;
      this.isSubmitting = true;
      this.showAlert = false;

      try {
        let result;
        if (this.isEditMode && this.existingReviewId) {
          result = await updateReview(this.existingReviewId, this.formData.rating, this.formData.review);
        } else {
          result = await createReview(this.recipeId, this.recipeTitle, this.formData.rating, this.formData.review);
        }

        if (result.success) {
          const submittedReview = result.review;

          if (submittedReview) {
            this.isEditMode = true;
            this.existingReviewId = submittedReview.id || submittedReview._id || this.existingReviewId;
          }

          this.alertType = 'success';
          this.alertMessage = wasEditMode ? 'Your review has been updated!' : 'Thank you for your review!';
          this.showAlert = true;

          if (submittedReview) {
            await this.$nextTick();
            this.$emit('review-submitted', submittedReview);
          }
        } else {
          this.alertType = 'error';
          this.alertMessage = result.error || 'Failed to submit review';
          this.showAlert = true;
        }
      } catch (error) {
        console.error('Submit review error:', error);
        this.alertType = 'error';
        this.alertMessage = 'Something went wrong while submitting your review';
        this.showAlert = true;
      } finally {
        this.isSubmitting = false;
      }

      if (this.alertTimeoutId) {
        clearTimeout(this.alertTimeoutId);
      }

      this.alertTimeoutId = setTimeout(() => {
        this.showAlert = false;
        this.alertTimeoutId = null;
      }, 4000);
    }
  }
};
</script>

<style scoped>
.review-form-compact {
  position: relative;
  overflow: hidden;
  padding: 30px;
  color: #111827;
  background:
    radial-gradient(circle at top right, rgba(22, 101, 52, 0.1), transparent 34%),
    #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.review-form-compact::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, #14532d, #22c55e, #facc15);
}

.review-form-compact:hover {
  border-color: #bbf7d0;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.13);
  transform: translateY(-2px);
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  text-align: center;
  color: #4b5563;
}

.review-form-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 22px;
  font-size: 24px;
}

.login-prompt h5,
.review-form-header h4 {
  margin: 0;
  color: #0f172a;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.login-prompt p,
.review-form-header p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.review-form-header p strong {
  color: #14532d;
  font-weight: 900;
}

.review-form-shell {
  position: relative;
  z-index: 1;
}

.review-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 800;
}

.alert-success {
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.alert-danger {
  color: #991b1b;
  background: #fee2e2;
  border: 1px solid #fecaca;
}

.review-form-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-bottom: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}

.review-form-header-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.review-eyebrow {
  display: inline-flex;
  align-items: center;
  margin-bottom: 8px;
  color: #14532d;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.review-form-grid {
  display: grid;
  gap: 18px;
}

.review-field {
  display: grid;
  gap: 9px;
}

.review-field label {
  color: #111827;
  font-size: 13px;
  font-weight: 900;
}

.star-rating-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  gap: 18px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
}

.star-rating {
  display: flex;
  gap: 8px;
}

.star-rating .star {
  cursor: pointer;
  color: #d1d5db;
  font-size: 1.65rem;
  line-height: 1;
  transition: color 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}

.star-rating .star:hover,
.star-rating .star.active {
  color: #f59e0b;
  filter: drop-shadow(0 8px 12px rgba(245, 158, 11, 0.18));
  transform: translateY(-2px) scale(1.08);
}

.rating-text {
  flex-shrink: 0;
  margin-left: 0 !important;
  padding: 8px 12px;
  color: #14532d;
  background: #dcfce7;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.review-textarea {
  width: 100%;
  min-height: 150px;
  padding: 16px 18px;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.7;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.review-textarea:focus {
  background: #fcfffd;
  border-color: #166534;
  box-shadow: 0 0 0 4px rgba(22, 101, 52, 0.12);
}

.review-textarea.is-invalid {
  border-color: #dc2626;
}

.field-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 20px;
  color: #9ca3af;
  font-size: 12px;
}

.field-error {
  color: #dc2626;
  font-size: 12px;
  font-weight: 800;
}

.review-submit-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
}

.review-submit-btn,
.review-cancel-btn {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.review-submit-btn {
  min-width: 178px;
  padding: 0 22px;
  color: #ffffff;
  background: #166534;
  border: 1px solid #166534;
  box-shadow: 0 14px 30px rgba(22, 101, 52, 0.24);
}

.review-submit-btn:hover:not(:disabled) {
  color: #ffffff;
  background: #14532d;
  box-shadow: 0 18px 34px rgba(22, 101, 52, 0.3);
  transform: translateY(-2px);
}

.review-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.review-cancel-btn {
  padding: 0 16px;
  color: #374151;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.review-cancel-btn:hover {
  color: #111827;
  background: #f9fafb;
  border-color: #9ca3af;
}

.fw-600 {
  font-weight: 600;
}

@media (max-width: 640px) {
  .review-form-compact {
    padding: 22px;
    border-radius: 24px;
  }

  .review-form-header,
  .star-rating-container {
    align-items: center;
    flex-direction: column;
  }

  .review-submit-row,
  .review-submit-btn,
  .review-cancel-btn {
    width: 100%;
  }
}
</style>