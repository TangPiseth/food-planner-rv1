<template>
  <div class="recipe-reviews mt-4" data-aos="fade-up">
    <h4 class="fw-bold mb-3 review-title">Customer Reviews ({{ totalReviews }})</h4>

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

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border spinner-border-sm text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted small mt-2 mb-0">Loading reviews...</p>
    </div>

    <div v-else-if="paginatedReviews.length > 0">
      <div
        class="review-card mb-3 p-3 bg-white rounded-3 shadow-sm"
        v-for="review in paginatedReviews"
        :key="review.id || review._id"
        :class="{ 'user-review': isCurrentUserReview(review) }"
      >
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 class="mb-1 fw-600">
              {{ review.username || review.name }}
              <span v-if="isCurrentUserReview(review)" class="badge bg-success ms-2" style="font-size: 10px;">You</span>
            </h6>
            <div class="text-muted" style="font-size: 12px;">
              {{ formatDate(review.createdAt) }}
              <span v-if="review.updatedAt && review.updatedAt !== review.createdAt" class="ms-1">(edited)</span>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <div class="rating bg-success text-white px-2 py-1 rounded-pill" style="font-size: 12px;">
              ⭐ {{ review.rating }}/5
            </div>

            <div v-if="isCurrentUserReview(review)" class="review-actions">
              <button
                class="btn btn-sm btn-outline-primary action-btn"
                @click="editReview(review)"
                title="Edit review"
              >
                <i class="fa-solid fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger action-btn"
                @click="deleteReview(review)"
                title="Delete review"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <p class="mb-0" style="font-size: 14px; line-height: 1.6;">{{ review.comment }}</p>

        <div class="d-flex justify-content-end mt-2">
          <button
            v-if="isAuthenticated() && !isCurrentUserReview(review)"
            class="btn btn-sm btn-outline-danger"
            @click="handleReport(review)"
            :disabled="isReportingReviewId === (review.id || review._id)"
          >
            <i class="fa-solid fa-flag me-1"></i>
            {{ isReportingReviewId === (review.id || review._id) ? 'Reporting...' : 'Report' }}
          </button>
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

    <div v-else class="text-center py-4">
      <i class="fa-solid fa-comments fa-2x mb-2 text-muted"></i>
      <p class="text-muted mb-0" style="font-size: 14px;">No reviews yet. Be the first to review!</p>
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
      isReportingReviewId: null
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
    async handleReport(review) {
      const reviewId = review.id || review._id;
      if (!reviewId) {
        return;
      }

      const reason = window.prompt('Why are you reporting this review?');
      if (!reason || !reason.trim()) {
        return;
      }

      this.isReportingReviewId = reviewId;
      const result = await reportReview(reviewId, reason.trim());
      this.isReportingReviewId = null;

      if (result.success) {
        alert(result.message || 'Report submitted.');
      } else {
        alert(result.error || 'Failed to submit report.');
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
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(46, 125, 50, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.review-title {
  color: #2e7d32;
  font-size: 1.25rem;
}

.review-card {
  transition: all 0.2s ease;
  border: 1px solid rgba(46, 125, 50, 0.1);
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.review-card.user-review {
  border-left: 3px solid #2e7d32;
  background: rgba(46, 125, 50, 0.03);
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
  gap: 4px;
}

.action-btn {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
}

.action-btn:hover {
  transform: scale(1.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
