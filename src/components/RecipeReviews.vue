<template>
    <div class="recipe-reviews mt-4" data-aos="fade-up">
      <h4 class="fw-bold mb-3 review-title">Customer Reviews ({{ totalReviews }})</h4>
      
      <!-- Reviews List -->
      <div v-if="reviews.length > 0">
        <div class="review-card mb-3 p-3 bg-white rounded-3 shadow-sm" v-for="review in reviews" :key="review.id">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 class="mb-1 fw-600">{{ review.name }}</h6>
              <div class="text-muted" style="font-size: 12px;">
                {{ formatDate(review.date) }}
              </div>
            </div>
            <div class="rating bg-success text-white px-2 py-1 rounded-pill" style="font-size: 12px;">
              ⭐ {{ review.rating }}/5
            </div>
          </div>
          <p class="mb-0" style="font-size: 14px; line-height: 1.6;">{{ review.comment }}</p>
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
        reviews: [
          // Mock data - replace with actual API calls later
          {
            id: 1,
            name: "John Doe",
            rating: 5,
            comment: "This recipe was amazing! My whole family loved it. The instructions were clear and easy to follow. Will definitely make it again!",
            date: "2024-01-15"
          },
          {
            id: 2,
            name: "Jane Smith",
            rating: 4,
            comment: "Great recipe! I made a few modifications to suit my taste but the base recipe is solid. Would recommend.",
            date: "2024-01-14"
          },
          {
            id: 3,
            name: "Mike Johnson",
            rating: 5,
            comment: "Perfect recipe! Turned out exactly as shown in the pictures. The timing was spot on.",
            date: "2024-01-13"
          }
        ],
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
        // Add the new review to the beginning of the list
        this.reviews.unshift(reviewData);
        // Reset to first page to show the new review
        this.currentPage = 1;
      },
      async fetchReviews() {
        // In a real application, you would fetch reviews from your API here
        // Example:
        // try {
        //   const response = await axios.get(`/api/recipes/${this.recipeId}/reviews`);
        //   this.reviews = response.data;
        // } catch (error) {
        //   console.error('Error fetching reviews:', error);
        // }
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