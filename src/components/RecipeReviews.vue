<template>
    <div class="recipe-reviews mt-4" data-aos="fade-up">
      <h4 class="fw-bold mb-3 review-title">Customer Reviews ({{ totalReviews }})</h4>

      <div v-if="loading" class="text-center py-3 text-muted">Loading reviews...</div>
      
      <!-- Reviews List -->
      <div v-else-if="reviews.length > 0">
        <div class="review-card mb-3 p-3 bg-white rounded-3 shadow-sm" v-for="review in paginatedReviews" :key="review._id">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="mb-1 fw-600">{{ review.name }}</h6>
              <div class="text-muted" style="font-size: 12px;">
                {{ formatDate(review.createdAt) }}
              </div>
            </div>
            <div class="rating bg-success text-white px-2 py-1 rounded-pill" style="font-size: 12px;">
              ⭐ {{ review.rating }}/5
            </div>
          </div>
          <p class="mb-0" style="font-size: 14px; line-height: 1.6;">{{ review.comment }}</p>
          <div class="d-flex justify-content-end mt-2">
            <button
              v-if="isAuthenticated()"
              class="btn btn-sm btn-outline-danger"
              @click="handleReport(review)"
            >
              <i class="fa-solid fa-flag me-1"></i>Report
            </button>
          </div>
        </div>
  
        <!-- Pagination -->
        <nav v-if="totalPages > 1" aria-label="Review pagination" class="mt-3">
          <ul class="pagination pagination-sm justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                Prev
              </button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
              <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
  
      <!-- No Reviews Message -->
      <div v-else class="text-center py-4">
        <i class="fa-solid fa-comments fa-2x mb-2 text-muted"></i>
        <p class="text-muted mb-0" style="font-size: 14px;">No reviews yet. Be the first to review!</p>
      </div>
    </div>
  </template>
  
  <script>
  import { fetchApprovedReviews, reportReview } from '@/services/reviewService';
  import { isAuthenticated } from '@/services/authService';

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
        loading: false,
        currentPage: 1,
        reviewsPerPage: 5
      }
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
      addReview(reviewData) {
        if (reviewData?.status === 'approved') {
          this.reviews.unshift(reviewData);
          this.currentPage = 1;
          return;
        }

        this.fetchReviews();
      },
      async fetchReviews() {
        this.loading = true;
        const result = await fetchApprovedReviews(this.recipeId);
        this.reviews = result.success ? result.reviews : [];
        this.currentPage = 1;
        this.loading = false;
      },
      async handleReport(review) {
        const reason = window.prompt('Why are you reporting this review?');
        if (!reason || !reason.trim()) {
          return;
        }

        const result = await reportReview(review._id, reason.trim());
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
    watch: {
      recipeId() {
        this.fetchReviews();
      }
    },
    created() {
      this.fetchReviews();
    }
  }
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
  </style>