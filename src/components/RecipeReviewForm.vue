<template>
  <div class="review-form-compact" data-aos="fade-up">
    <div v-if="!isLoggedIn" class="login-prompt text-center py-4">
      <i class="fa-solid fa-lock fa-2x mb-3 text-muted"></i>
      <h5 class="fw-bold mb-2">Login to Leave a Review</h5>
      <p class="text-muted small mb-3">Please login to share your thoughts about this recipe</p>
      <router-link to="/login" class="btn btn-success btn-sm px-4">
        <i class="fa-solid fa-sign-in-alt me-2"></i>Login Now
      </router-link>
    </div>

    <div v-else>
      <div
        v-if="showAlert"
        :class="['alert', alertType === 'success' ? 'alert-success' : 'alert-danger', 'mb-3']"
        role="alert"
      >
        <i
          :class="['fa-solid', alertType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle', 'me-2']"
        ></i>
        {{ alertMessage }}
      </div>

      <div v-if="isEditMode" class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 class="fw-bold mb-1">Edit Your Review</h4>
          <p class="text-muted small mb-0">Update your review for this recipe</p>
        </div>
        <button @click="cancelEdit" class="btn btn-outline-secondary btn-sm">
          <i class="fa-solid fa-times me-1"></i>Cancel
        </button>
      </div>

      <div v-else>
        <h4 class="fw-bold mb-1">Leave a Review</h4>
        <p class="text-muted small mb-3">
          Reviewing as <strong class="text-success">{{ currentUser?.username }}</strong>
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="fw-600 d-block mb-2 small">Your Rating *</label>
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
          <div class="text-danger small mt-1" v-if="errors.rating">{{ errors.rating }}</div>
        </div>

        <div class="mb-3">
          <textarea
            class="form-control"
            :class="{ 'is-invalid': errors.review }"
            v-model="formData.review"
            rows="4"
            placeholder="Share your experience with this recipe... What did you like? Any tips for others?"
          ></textarea>
          <div class="invalid-feedback" v-if="errors.review">{{ errors.review }}</div>
        </div>

        <button type="submit" class="btn btn-success px-4" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else :class="['fa-solid', isEditMode ? 'fa-save' : 'fa-paper-plane', 'me-2']"></i>
          {{ isSubmitting ? 'Submitting...' : (isEditMode ? 'Update Review' : 'Post Review') }}
        </button>
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
          this.alertType = 'success';
          this.alertMessage = this.isEditMode ? 'Your review has been updated!' : 'Thank you for your review!';
          this.showAlert = true;

          if (result.review) {
            this.$emit('review-submitted', result.review);
            this.isEditMode = true;
            this.existingReviewId = result.review.id || result.review._id || this.existingReviewId;
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

      setTimeout(() => {
        this.showAlert = false;
      }, 4000);
    }
  }
};
</script>

<style scoped>
.review-form-compact {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(46, 125, 50, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.review-form-compact h4 {
  color: #2e7d32;
  font-size: 1.25rem;
}

.login-prompt {
  color: #555;
}

.login-prompt i {
  color: #2e7d32;
}

.star-rating-container {
  display: flex;
  align-items: center;
}

.star-rating {
  display: flex;
  gap: 4px;
}

.star-rating .star {
  cursor: pointer;
  font-size: 1.5rem;
  color: #ddd;
  transition: all 0.2s ease;
}

.star-rating .star:hover,
.star-rating .star.active {
  color: #ffc107;
  transform: scale(1.1);
}

.rating-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.form-control,
.form-select {
  background-color: white;
  border: 1px solid rgba(46, 125, 50, 0.2);
  font-size: 0.95rem;
  padding: 12px 16px;
}

.form-control:focus,
.form-select:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 0.2rem rgba(46, 125, 50, 0.15);
}

.btn-success {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 24px;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #1b5e20 0%, #0d3817 100%);
  transform: translateY(-1px);
}

.btn-success:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.alert {
  padding: 12px 16px;
  font-size: 0.9rem;
  border-radius: 8px;
}

.alert-success {
  background-color: rgba(46, 125, 50, 0.1);
  border: 1px solid rgba(46, 125, 50, 0.2);
  color: #2e7d32;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
  color: #dc3545;
}

.fw-600 {
  font-weight: 600;
}
</style>
