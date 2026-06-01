<template>
  <div class="recipe-reviews mt-4" data-aos="fade-up">
    <div class="reviews-header">
      <div>
        <span class="reviews-eyebrow">Community voice</span>
        <h4 class="review-title">Customer Reviews</h4>
      </div>
      <span class="reviews-count">{{ totalReviews }} {{ totalReviews === 1 ? 'review' : 'reviews' }}</span>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
      <div class="delete-modal">
        <div class="modal-icon">
          <i class="fa-solid fa-trash-alt"></i>
        </div>
        <h5 class="fw-bold mb-2">Delete Review?</h5>
        <p class="text-muted mb-3">Are you sure you want to delete this review? This action cannot be undone.</p>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-outline-secondary" @click="cancelDelete">Cancel</button>
          <button class="btn btn-danger" @click="confirmDelete" :disabled="isDeleting">
            <span v-if="isDeleting" class="spinner-border spinner-border-sm me-1"></span>
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <transition name="report-overlay">
      <div v-if="showReportModal" class="modal-overlay report-overlay" @click.self="cancelReport">
        <div class="report-modal">
          <button class="modal-close-btn" @click="cancelReport" aria-label="Close report dialog">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="report-modal-icon">
            <i class="fa-solid fa-flag"></i>
          </div>

          <span class="report-eyebrow">Moderation report</span>
          <h5>Report Review</h5>
          <p>
            Tell us what is wrong with this comment. Your report helps keep recipe reviews useful and respectful.
          </p>

          <div v-if="reportSuccessMessage" class="report-success">
            <i class="fa-solid fa-check-circle"></i>
            {{ reportSuccessMessage }}
          </div>

          <form v-else @submit.prevent="submitReport">
            <label for="report-reason" class="report-label">Reason for reporting</label>
            <textarea
              id="report-reason"
              v-model="reportReason"
              class="report-textarea"
              :class="{ 'is-invalid': reportError }"
              rows="5"
              placeholder="Example: This comment is offensive, spam, or unrelated to the recipe."
              maxlength="500"
            ></textarea>
            <div class="report-form-meta">
              <span v-if="reportError" class="report-error">{{ reportError }}</span>
              <span>{{ reportReason.length }}/500</span>
            </div>

            <div class="report-actions">
              <button type="button" class="report-cancel-btn" @click="cancelReport">Cancel</button>
              <button type="submit" class="report-submit-btn" :disabled="isReportingReviewId">
                <span v-if="isReportingReviewId" class="spinner-border spinner-border-sm"></span>
                <i v-else class="fa-solid fa-paper-plane"></i>
                <span>{{ isReportingReviewId ? 'Submitting...' : 'Submit Report' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <div v-show="loading" class="text-center py-4">
      <div class="spinner-border spinner-border-sm text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted small mt-2 mb-0">Loading reviews...</p>
    </div>

    <div v-show="!loading && paginatedReviews.length > 0" class="reviews-list">
      <div
        class="review-card"
        v-for="review in paginatedReviews"
        :key="review.id || review._id"
        :class="{ 'user-review': isCurrentUserReview(review) }"
      >
        <div class="review-main">
          <div class="review-content">
            <div class="review-topline">
              <div class="reviewer-info">
                <div class="reviewer-row">
                  <h6>{{ review.username || review.name || 'Food lover' }}</h6>
                  <span v-if="isCurrentUserReview(review)" class="you-badge">You</span>
                </div>
                <div class="review-date">
                  {{ formatDate(review.createdAt) }}
                  <span v-if="review.updatedAt && review.updatedAt !== review.createdAt">(edited)</span>
                </div>
              </div>

              <div class="rating-pill" :aria-label="`${review.rating} out of 5 stars`">
                <template v-for="star in 5" :key="star">
                  <i
                    class="fa-star"
                    :class="star <= review.rating ? 'fa-solid' : 'fa-regular'"
                  ></i>
                </template>
                <span>{{ review.rating }}/5</span>
              </div>
            </div>

            <p class="review-comment">{{ review.comment }}</p>

            <div class="review-footer">
              <button
                v-if="isAuthenticated() && !isCurrentUserReview(review)"
                class="report-review-btn"
                @click="handleReport(review)"
                :disabled="isReportingReviewId === (review.id || review._id)"
              >
                <i class="fa-solid fa-flag"></i>
                <span>{{ isReportingReviewId === (review.id || review._id) ? 'Reporting...' : 'Report' }}</span>
              </button>

              <div v-if="isCurrentUserReview(review)" class="review-actions">
                <button
                  class="action-btn edit-btn"
                  @click="editReview(review)"
                  title="Edit review"
                >
                  <i class="fa-solid fa-edit"></i>
                  <span>Edit</span>
                </button>
                <button
                  class="action-btn delete-btn"
                  @click="deleteReview(review)"
                  title="Delete review"
                >
                  <i class="fa-solid fa-trash"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav v-if="totalPages > 1" aria-label="Review pagination" class="mt-3">
        <ul class="pagination pagination-sm justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
          </li>

          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
          </li>
        </ul>
      </nav>
    </div>

    <div v-show="!loading && paginatedReviews.length === 0" class="empty-reviews">
      <i class="fa-solid fa-comments"></i>
      <p>No reviews yet. Be the first to review!</p>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { getRecipeReviews, deleteReview, reportReview } from '@/services/reviewService';

export default {
  name: 'RecipeReviews',
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      currentPage: 1,
      reviewsPerPage: 5,
      loading: false,
      currentUser: null,
      showDeleteModal: false,
      reviewToDelete: null,
      isDeleting: false,
      isReportingReviewId: null,
      showReportModal: false,
      reviewToReport: null,
      reportReason: '',
      reportError: '',
      reportSuccessMessage: ''
    };
  },
  computed: {
    totalReviews() {
      return this.reviews.length;
    },
    totalPages() {
      return Math.ceil(this.reviews.length / this.reviewsPerPage);
    },
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.reviews.slice(start, end);
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getReviewerInitial(review) {
      const name = review.username || review.name || 'F';
      return name.charAt(0).toUpperCase();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    isCurrentUserReview(review) {
      if (!this.currentUser) {
        return false;
      }

      const reviewUserId = review.userId?.toString?.() || review.userId;
      return reviewUserId === this.currentUser.id;
    },
    addReview(reviewData) {
      const incomingId = reviewData?.id || reviewData?._id;
      if (!incomingId) {
        this.fetchReviews();
        return;
      }

      const existingIndex = this.reviews.findIndex((item) => (item.id || item._id) === incomingId);
      if (existingIndex !== -1) {
        this.reviews.splice(existingIndex, 1, reviewData);
      } else {
        this.reviews.unshift(reviewData);
      }
      this.currentPage = 1;
    },
    editReview(review) {
      this.$emit('edit-review', review);
    },
    deleteReview(review) {
      this.reviewToDelete = review;
      this.showDeleteModal = true;
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.reviewToDelete = null;
    },
    async confirmDelete() {
      if (!this.reviewToDelete) return;

      this.isDeleting = true;
      const targetId = this.reviewToDelete.id || this.reviewToDelete._id;
      const result = await deleteReview(targetId);

      if (result.success) {
        const index = this.reviews.findIndex((item) => (item.id || item._id) === targetId);
        if (index !== -1) {
          this.reviews.splice(index, 1);
        }
        this.$emit('review-deleted', targetId);
      } else {
        console.error('Failed to delete review:', result.error);
      }

      this.isDeleting = false;
      this.showDeleteModal = false;
      this.reviewToDelete = null;
    },
    async fetchReviews() {
      this.loading = true;
      try {
        const result = await getRecipeReviews(this.recipeId);
        this.reviews = result.success ? (result.reviews || []) : [];
        this.currentPage = 1;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.reviews = [];
      }
      this.loading = false;
    },
    handleReport(review) {
      const reviewId = review.id || review._id;
      if (!reviewId) {
        return;
      }

      this.reviewToReport = review;
      this.reportReason = '';
      this.reportError = '';
      this.reportSuccessMessage = '';
      this.showReportModal = true;
    },
    cancelReport() {
      if (this.isReportingReviewId) {
        return;
      }

      this.showReportModal = false;
      this.reviewToReport = null;
      this.reportReason = '';
      this.reportError = '';
      this.reportSuccessMessage = '';
    },
    async submitReport() {
      const reviewId = this.reviewToReport?.id || this.reviewToReport?._id;
      const reason = this.reportReason.trim();

      if (!reviewId) {
        this.cancelReport();
        return;
      }

      if (reason.length < 10) {
        this.reportError = 'Please add at least 10 characters so moderators have context.';
        return;
      }

      this.reportError = '';
      this.isReportingReviewId = reviewId;
      const result = await reportReview(reviewId, reason);
      this.isReportingReviewId = null;

      if (result.success) {
        this.reportSuccessMessage = result.message || 'Report submitted. Thank you for helping us review it.';
        setTimeout(() => {
          this.cancelReport();
        }, 1200);
      } else {
        this.reportError = result.error || 'Failed to submit report.';
      }
    },
    isAuthenticated() {
      return isAuthenticated();
    }
  },
  async created() {
    if (isAuthenticated()) {
      this.currentUser = await getCurrentUser();
    }
    await this.fetchReviews();
  },
  watch: {
    recipeId: {
      async handler() {
        await this.fetchReviews();
      }
    }
  }
};
</script>

<style scoped>
.recipe-reviews {
  position: relative;
  overflow: hidden;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
  animation: reviewsIn 0.45s ease both;
}

.recipe-reviews::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, #14532d, #22c55e, #facc15);
}

.reviews-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e7eb;
}

.reviews-eyebrow {
  display: block;
  text-align: start;
  margin-bottom: 8px;
  color: #14532d;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.review-title {
  margin: 0;
  text-align: start;
  color: #0f172a;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.reviews-count {
  flex-shrink: 0;
  padding: 9px 13px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.reviews-list {
  display: grid;
  gap: 16px;
}

.review-card {
  position: relative;
  overflow: hidden;
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
  animation: reviewCardIn 0.38s ease both;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease, background 0.24s ease;
  display: flex;
  align-items: center;
}

.review-card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: transparent;
  transition: background 0.24s ease;
}

.review-card:hover {
  background: #fcfffd;
  border-color: #bbf7d0;
  box-shadow: 0 22px 52px rgba(15, 23, 42, 0.1);
  transform: translateY(-4px);
}

.review-card:hover::before,
.review-card.user-review::before {
  background: #166534;
}

.review-card.user-review {
  background: #f7fff9;
  border-color: #bbf7d0;
}

.review-main {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.review-content {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.review-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.reviewer-row {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
}

.reviewer-row h6 {
  margin: 0;
  text-align: start;
  color: #111827;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.you-badge {
  padding: 4px 8px;
  color: #14532d;
  background: #dcfce7;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.review-date {
  margin-top: 3px;
  text-align: start;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
}

.review-date span {
  margin-left: 4px;
}

.rating-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.rating-pill i {
  font-size: 11px;
}

.rating-pill i.fa-solid {
  color: #f59e0b;
}

.rating-pill i.fa-regular {
  color: #d1d5db;
}

.rating-pill span {
  margin-left: 4px;
  color: #111827;
}

.review-comment {
  margin: 0;
  color: #374151;
  font-size: 15px;
  line-height: 1.75;
  text-align: center;
}

.review-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.fw-600 {
  font-weight: 600;
}

.page-link {
  color: #2e7d32;
  cursor: pointer;
  font-size: 0.875rem;
}

.page-link:hover {
  color: #1b5e20;
  background-color: rgba(46, 125, 50, 0.1);
}

.page-item.active .page-link {
  background-color: #2e7d32;
  border-color: #2e7d32;
  color: white;
}

.rating {
  font-weight: 600;
}

.review-actions {
  display: flex;
  gap: 8px;
}

.action-btn,
.report-review-btn {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.action-btn:hover,
.report-review-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.edit-btn {
  color: #1d4ed8;
  border-color: #bfdbfe;
}

.edit-btn:hover {
  background: #eff6ff;
  box-shadow: 0 10px 20px rgba(29, 78, 216, 0.1);
}

.delete-btn,
.report-review-btn {
  color: #b91c1c;
  border-color: #fecaca;
}

.delete-btn:hover,
.report-review-btn:hover:not(:disabled) {
  background: #fef2f2;
  box-shadow: 0 10px 20px rgba(185, 28, 28, 0.1);
}

.report-review-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.empty-reviews {
  display: grid;
  place-items: center;
  min-height: 190px;
  color: #6b7280;
  text-align: center;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 22px;
}

.empty-reviews i {
  margin-bottom: 10px;
  color: #166534;
  font-size: 30px;
}

.empty-reviews p {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1050;
}

.delete-modal {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.report-modal {
  position: relative;
  width: min(92vw, 520px);
  overflow: hidden;
  padding: 32px;
  background:
    radial-gradient(circle at top right, rgba(185, 28, 28, 0.1), transparent 34%),
    #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  box-shadow: 0 34px 90px rgba(15, 23, 42, 0.34);
  animation: reportModalPop 0.34s cubic-bezier(0.2, 0.9, 0.2, 1.2) both;
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.report-modal::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: linear-gradient(90deg, #991b1b, #ef4444, #f97316);
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.modal-close-btn:hover {
  color: #111827;
  background: #f3f4f6;
  transform: rotate(90deg);
}

.report-modal-icon {
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 22px;
  font-size: 24px;
  box-shadow: 0 16px 28px rgba(185, 28, 28, 0.12);
}

.report-eyebrow {
  display: inline-flex;
  margin-bottom: 6px;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.report-modal h5 {
  margin: 0;
  color: #0f172a;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.report-modal p {
  margin: 9px 0 20px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.7;
}

.report-label {
  display: block;
  margin-bottom: 8px;
  color: #111827;
  font-size: 13px;
  font-weight: 800;
}

.report-textarea {
  width: 100%;
  min-height: 146px;
  padding: 16px 18px;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 18px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.report-textarea:focus {
  background: #fffafa;
  border-color: #166534;
  box-shadow: 0 0 0 4px rgba(22, 101, 52, 0.12);
}

.report-textarea.is-invalid {
  border-color: #dc2626;
}

.report-form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 22px;
  margin-top: 8px;
  color: #6b7280;
  font-size: 12px;
}

.report-error {
  color: #dc2626;
  font-weight: 700;
}

.report-success {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 16px;
  font-weight: 800;
  animation: reportSuccessIn 0.28s ease both;
}

.report-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.report-cancel-btn,
.report-submit-btn {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 18px;
  border-radius: 16px;
  font-weight: 900;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.report-cancel-btn {
  color: #374151;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.report-submit-btn {
  color: #ffffff;
  background: #b91c1c;
  border: 1px solid #b91c1c;
  box-shadow: 0 14px 28px rgba(185, 28, 28, 0.22);
}

.report-cancel-btn:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

.report-submit-btn:hover:not(:disabled) {
  background: #991b1b;
  box-shadow: 0 18px 34px rgba(185, 28, 28, 0.28);
  transform: translateY(-2px);
}

.report-submit-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

.modal-icon {
  width: 60px;
  height: 60px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.modal-icon i {
  font-size: 1.5rem;
  color: #dc3545;
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #a71d2a 100%);
}

.report-overlay-enter-active,
.report-overlay-leave-active {
  transition: opacity 0.24s ease;
}

.report-overlay-enter-from,
.report-overlay-leave-to {
  opacity: 0;
}

.report-overlay-enter-from .report-modal,
.report-overlay-leave-to .report-modal {
  transform: translateY(22px) scale(0.96);
}

@keyframes reviewsIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes reviewCardIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes reportModalPop {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes reportSuccessIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 576px) {
  .recipe-reviews {
    padding: 22px;
    border-radius: 24px;
  }

  .reviews-header,
  .review-topline,
  .review-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .rating-pill,
  .review-actions,
  .action-btn,
  .report-review-btn {
    width: 100%;
  }

  .review-actions {
    flex-direction: column;
  }

  .report-modal {
    padding: 22px;
    border-radius: 20px;
  }

  .report-actions {
    grid-template-columns: 1fr;
  }
}
</style>