<template>
  <div class="profile-page EG-Default overflow-hidden">
    <div class="container px-3 px-md-4 py-4 py-md-5">
      <div class="row g-3 g-md-4">
        <!-- Sidebar / Navigation -->
        <div class="col-12 col-lg-4">
          <div class="glass-card profile-sidebar text-center p-3 p-md-4">
            <div class="profile-avatar-wrapper mb-3">
              <div class="profile-avatar">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <h3 class="fw-bold text-dark mb-1">{{ currentUser?.username || 'User' }}</h3>
            <p class="text-muted small mb-4">{{ currentUser?.email }}</p>

            <div class="nav flex-column nav-pills profile-nav" role="tablist">
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'reviews' }"
                @click="activeTab = 'reviews'"
              >
                <i class="fas fa-star me-2"></i> My Reviews
                <span class="badge bg-success ms-auto rounded-pill">{{ userReviews.length }}</span>
              </button>
              <button
                class="nav-link"
                :class="{ active: activeTab === 'myRecipes' }"
                @click="activeTab = 'myRecipes'"
              >
                <i class="fas fa-book-open me-2"></i> My Recipes
                <span class="badge bg-success ms-auto rounded-pill">{{ userRecipes.length }}</span>
              </button>
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'submit' }"
                @click="activeTab = 'submit'"
              >
                <i class="fas fa-seedling me-2"></i> Submit Recipe
              </button>
              <button 
                class="nav-link" 
                :class="{ active: activeTab === 'settings' }"
                @click="activeTab = 'settings'"
              >
                <i class="fas fa-cog me-2"></i> Account Settings
              </button>
              <button
                class="nav-link logout-nav-link"
                @click="handleLogout"
                :disabled="logoutLoading"
              >
                <i class="fas fa-sign-out-alt me-2"></i>
                {{ logoutLoading ? 'Logging out...' : 'Logout' }}
              </button>
            </div>

            <div class="mt-5">
              <router-link to="/home-page" class="btn btn-light rounded-pill w-100">
                <i class="fas fa-arrow-left me-2"></i>Back to Home
              </router-link>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="col-12 col-lg-8">
          <div class="glass-card content-card p-3 p-md-4 p-xxl-5">
            
            <!-- REVIEWS TAB -->
            <transition name="fade" mode="out-in">
              <div v-if="activeTab === 'reviews'" key="reviews">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h4 class="section-title mb-0">
                    <i class="fas fa-star text-success me-2"></i>My Reviews
                  </h4>
                </div>

                <!-- Loading state -->
                <div v-if="reviewsLoading" class="text-center py-5">
                  <div class="spinner-border text-success" role="status"></div>
                  <p class="text-muted mt-3">Loading your reviews...</p>
                </div>

                <!-- Reviews list -->
                <div v-else-if="userReviews.length > 0" class="reviews-list">
                  <div 
                    class="review-item glass-card mb-3 p-3" 
                    v-for="review in paginatedReviews" 
                    :key="review.id"
                  >
                    <div class="d-flex justify-content-between align-items-start gap-3">
                      <div class="flex-grow-1">
                        <router-link 
                          :to="`/recipe/${review.recipeId}`" 
                          class="review-recipe-title h6 mb-1 d-block"
                        >
                          {{ review.recipeTitle || 'Recipe' }}
                        </router-link>
                        <div class="review-meta mb-2">
                          <span class="stars me-2">
                            <i class="fas fa-star" v-for="n in review.rating" :key="'full-'+n"></i>
                            <i class="far fa-star" v-for="n in (5 - review.rating)" :key="'empty-'+n"></i>
                          </span>
                          <span class="text-muted small">{{ formatDate(review.createdAt) }}</span>
                        </div>
                        <p class="review-comment text-secondary mb-0">{{ review.comment }}</p>
                      </div>
                      <div class="review-actions">
                        <button 
                          class="btn btn-icon btn-light text-danger"
                          @click="confirmDeleteReview(review)"
                          title="Delete"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Pagination -->
                  <nav v-if="totalReviewPages > 1" class="mt-4">
                    <ul class="pagination pagination-sm justify-content-center mb-0 custom-pagination">
                      <li class="page-item" :class="{ disabled: reviewCurrentPage === 1 }">
                        <button class="page-link" @click="changeReviewPage(reviewCurrentPage - 1)"><i class="fas fa-chevron-left"></i></button>
                      </li>
                      <li class="page-item" v-for="page in totalReviewPages" :key="page" :class="{ active: page === reviewCurrentPage }">
                        <button class="page-link" @click="changeReviewPage(page)">{{ page }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: reviewCurrentPage === totalReviewPages }">
                        <button class="page-link" @click="changeReviewPage(reviewCurrentPage + 1)"><i class="fas fa-chevron-right"></i></button>
                      </li>
                    </ul>
                  </nav>
                </div>

                <!-- No reviews -->
                <div v-else class="text-center py-5 text-muted">
                  <div class="empty-state-icon mb-3">
                    <i class="fas fa-comment-slash fa-3x text-light-gray"></i>
                  </div>
                  <h5>No reviews yet</h5>
                  <p>Share your thoughts on recipes you've tried!</p>
                  <router-link to="/recipes" class="btn btn-outline-success rounded-pill mt-2">
                    Browse Recipes
                  </router-link>
                </div>
              </div>

              <!-- MY RECIPES TAB -->
              <div v-else-if="activeTab === 'myRecipes'" key="myRecipes">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                  <div>
                    <h4 class="section-title mb-1 text-start">
                      <i class="fas fa-book-open text-success me-2"></i>My Recipes
                    </h4>
                    <p class="text-muted small mb-0 text-start">Track your submitted recipes and review status.</p>
                  </div>
                  <button class="btn btn-outline-success rounded-pill px-4" @click="activeTab = 'submit'">
                    <i class="fas fa-plus me-2"></i>Submit New
                  </button>
                </div>

                <div v-if="recipesLoading" class="text-center py-5">
                  <div class="spinner-border text-success" role="status"></div>
                  <p class="text-muted mt-3">Loading your recipes...</p>
                </div>

                <div v-else-if="userRecipes.length > 0" class="row g-3 g-md-4 my-recipes-list">
                  <div
                    class="col-12 col-xxl-6"
                    v-for="recipe in userRecipes"
                    :key="recipe.id"
                  >
                   <div class="my-recipe-card glass-card h-100">
                    <div class="recipe-status-row">
                      <span class="recipe-status-pill" :class="recipeStatusClass(recipe)">
                        {{ recipeStatus(recipe) }}
                      </span>
                      <span class="text-muted small">{{ formatDate(recipe.createdAt) }}</span>
                    </div>

                    <div class="my-recipe-body">
                      <div class="recipe-thumb">
                        <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" />
                        <i v-else class="fas fa-utensils"></i>
                      </div>

                      <div class="recipe-info">
                        <h5 class="mb-1">{{ recipe.title }}</h5>
                        <p class="text-muted mb-3">{{ recipe.description || 'No description added yet.' }}</p>

                        <div class="recipe-meta-grid">
                          <span><i class="fas fa-layer-group me-1"></i>{{ recipe.category || 'General' }}</span>
                          <span><i class="fas fa-globe-asia me-1"></i>{{ recipe.cuisine || 'Any cuisine' }}</span>
                          <span><i class="fas fa-clock me-1"></i>{{ recipeTotalTime(recipe) }} min</span>
                          <span><i class="fas fa-carrot me-1"></i>{{ recipe.ingredients?.length || 0 }} ingredients</span>
                        </div>
                      </div>
                    </div>
                   </div>
                  </div>
                </div>

                <div v-else class="text-center py-5 text-muted">
                  <div class="empty-state-icon mb-3">
                    <i class="fas fa-bowl-food fa-3x text-light-gray"></i>
                  </div>
                  <h5>No recipes submitted yet</h5>
                  <p>Add your first recipe and watch its approval status here.</p>
                  <button class="btn btn-outline-success rounded-pill mt-2" @click="activeTab = 'submit'">
                    Submit Recipe
                  </button>
                </div>
              </div>

              <!-- SUBMIT RECIPE TAB -->
              <div v-else-if="activeTab === 'submit'" key="submit">
                <div class="mb-4">
                  <h4 class="section-title mb-1">
                    <i class="fas fa-seedling text-success me-2"></i>Submit a Recipe
                  </h4>
                  <p class="text-muted small">Share your culinary creations. Submissions are reviewed by moderators before becoming public.</p>
                </div>

                <form @submit.prevent="handleRecipeSubmit" class="recipe-form">
                  <div class="row g-3">
                    <div class="col-md-12">
                      <div class="form-floating">
                        <input type="text" class="form-control" id="recipeTitle" v-model="recipeForm.title" :disabled="recipeSubmitting" placeholder="Recipe Title" required />
                        <label for="recipeTitle">Recipe Title *</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input type="text" class="form-control" id="recipeCategory" v-model="recipeForm.category" :disabled="recipeSubmitting" placeholder="Category" />
                        <label for="recipeCategory">Category (e.g., Dessert)</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input type="text" class="form-control" id="recipeCuisine" v-model="recipeForm.cuisine" :disabled="recipeSubmitting" placeholder="Cuisine" />
                        <label for="recipeCuisine">Cuisine (e.g., Italian)</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating">
                        <input type="url" class="form-control" id="recipeImg" v-model="recipeForm.image" :disabled="recipeSubmitting" placeholder="Image URL" />
                        <label for="recipeImg">Image URL</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <label class="form-label text-muted small fw-bold mb-1">Short Description</label>
                      <textarea class="form-control premium-textarea" rows="2" v-model="recipeForm.description" :disabled="recipeSubmitting" placeholder="Quick summary..."></textarea>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-muted small fw-bold mb-1">Ingredients (one per line)</label>
                      <textarea class="form-control premium-textarea" rows="5" v-model="recipeForm.ingredients" :disabled="recipeSubmitting" placeholder="2 eggs&#10;1 cup flour..."></textarea>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-muted small fw-bold mb-1">Instructions</label>
                      <textarea class="form-control premium-textarea" rows="5" v-model="recipeForm.instructions" :disabled="recipeSubmitting" placeholder="Step 1...&#10;Step 2..."></textarea>
                    </div>
                    
                    <div class="col-6 col-md-3">
                      <div class="form-floating">
                        <input type="number" min="0" class="form-control" id="prepTime" v-model="recipeForm.prepTime" :disabled="recipeSubmitting" placeholder="Prep Time" />
                        <label for="prepTime">Prep (min)</label>
                      </div>
                    </div>
                    <div class="col-6 col-md-3">
                      <div class="form-floating">
                        <input type="number" min="0" class="form-control" id="cookTime" v-model="recipeForm.cookingTime" :disabled="recipeSubmitting" placeholder="Cook Time" />
                        <label for="cookTime">Cook (min)</label>
                      </div>
                    </div>
                    <div class="col-6 col-md-3">
                      <div class="form-floating">
                        <input type="number" min="1" class="form-control" id="servings" v-model="recipeForm.servings" :disabled="recipeSubmitting" placeholder="Servings" />
                        <label for="servings">Servings</label>
                      </div>
                    </div>
                    <div class="col-6 col-md-3">
                      <div class="form-floating">
                        <input type="number" min="0" class="form-control" id="calories" v-model="recipeForm.calories" :disabled="recipeSubmitting" placeholder="Calories" />
                        <label for="calories">Calories</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-floating">
                        <input type="text" class="form-control" id="tags" v-model="recipeForm.tags" :disabled="recipeSubmitting" placeholder="Tags" />
                        <label for="tags">Tags (comma separated)</label>
                      </div>
                    </div>
                  </div>

                  <div v-if="recipeError" class="alert alert-danger mt-4 rounded-3 border-0 bg-soft-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>{{ recipeError }}
                  </div>
                  <div v-if="recipeSuccess" class="alert alert-success mt-4 rounded-3 border-0 bg-soft-success" role="alert">
                    <i class="fas fa-check-circle me-2"></i>{{ recipeSuccess }}
                  </div>

                  <div class="text-end mt-4">
                    <button type="button" class="btn btn-light rounded-pill me-2 px-4" @click="resetRecipeForm" :disabled="recipeSubmitting">Clear</button>
                    <button type="submit" class="btn btn-success rounded-pill px-5 shadow-sm" :disabled="recipeSubmitting">
                      <span v-if="recipeSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                      {{ recipeSubmitting ? 'Submitting...' : 'Submit Recipe' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- SETTINGS TAB -->
              <div v-else-if="activeTab === 'settings'" key="settings">
                <div class="mb-5">
                  <h4 class="section-title mb-4">
                    <i class="fas fa-user-cog text-success me-2"></i>Account Settings
                  </h4>
                  
                  <div class="settings-block mb-5">
                    <h5 class="h6 fw-bold mb-3">Profile Information</h5>
                    <form @submit.prevent="handleUpdateUsername" class="card bg-transparent border-0">
                      <div class="row align-items-center">
                        <div class="col-md-8 mb-3 mb-md-0">
                          <div class="form-floating">
                            <input type="text" class="form-control" id="newUsername" v-model="newUsername" :placeholder="currentUser?.username" minlength="3" />
                            <label for="newUsername">Username</label>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <button type="submit" class="btn btn-outline-success rounded-pill w-100 h-100 py-3" :disabled="usernameLoading || !newUsername">
                            <span v-if="usernameLoading" class="spinner-border spinner-border-sm me-2"></span>
                            Update
                          </button>
                        </div>
                      </div>
                      <div v-if="usernameError" class="text-danger small mt-2"><i class="fas fa-exclamation-circle me-1"></i>{{ usernameError }}</div>
                      <div v-if="usernameSuccess" class="text-success small mt-2"><i class="fas fa-check-circle me-1"></i>{{ usernameSuccess }}</div>
                    </form>
                  </div>

                  <hr class="text-muted opacity-25">

                  <div class="settings-block mt-5">
                    <h5 class="h6 fw-bold mb-3">Security</h5>
                    <form @submit.prevent="handleUpdatePassword">
                      <div class="row g-3">
                        <div class="col-12">
                          <div class="input-group premium-input-group">
                            <span class="input-group-text bg-transparent border-end-0"><i class="fas fa-lock text-muted"></i></span>
                            <input :type="showCurrentPassword ? 'text' : 'password'" class="form-control border-start-0 ps-0" id="currentPassword" v-model="currentPassword" placeholder="Current Password" required />
                            <button class="btn btn-outline-secondary border-start-0" type="button" @click="showCurrentPassword = !showCurrentPassword">
                              <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="input-group premium-input-group">
                            <span class="input-group-text bg-transparent border-end-0"><i class="fas fa-key text-muted"></i></span>
                            <input :type="showNewPassword ? 'text' : 'password'" class="form-control border-start-0 ps-0" id="newPassword" v-model="newPassword" placeholder="New Password" required minlength="6" />
                            <button class="btn btn-outline-secondary border-start-0" type="button" @click="showNewPassword = !showNewPassword">
                              <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="input-group premium-input-group">
                            <span class="input-group-text bg-transparent border-end-0"><i class="fas fa-check-double text-muted"></i></span>
                            <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control border-start-0 ps-0" id="confirmNewPassword" v-model="confirmNewPassword" placeholder="Confirm Password" required />
                            <button class="btn btn-outline-secondary border-start-0" type="button" @click="showConfirmPassword = !showConfirmPassword">
                              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div v-if="passwordError" class="alert alert-danger mt-3 py-2 small border-0 bg-soft-danger" role="alert">
                        {{ passwordError }}
                      </div>
                      <div v-if="passwordSuccess" class="alert alert-success mt-3 py-2 small border-0 bg-soft-success" role="alert">
                        {{ passwordSuccess }}
                      </div>

                      <div class="text-end mt-4">
                        <button type="submit" class="btn btn-success rounded-pill px-5 shadow-sm" :disabled="passwordLoading">
                          <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-2"></span>
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </transition>
            
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="custom-modal-overlay" @click.self="cancelDelete">
      <div class="custom-modal glass-card">
        <div class="modal-icon text-danger bg-soft-danger mb-3 mx-auto">
          <i class="fas fa-trash-alt"></i>
        </div>
        <h5 class="fw-bold text-center mb-2">Delete Review?</h5>
        <p class="text-muted text-center mb-4">This action cannot be undone. Are you sure you want to remove your review for <strong>{{ reviewToDelete?.recipeTitle }}</strong>?</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-light rounded-pill px-4" @click="cancelDelete">Cancel</button>
          <button class="btn btn-danger rounded-pill px-4 shadow-sm" @click="deleteReviewConfirmed" :disabled="isDeleting">
            <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, isAuthenticated, logoutUser, updateUsername, updateUserPassword } from '@/services/authService'
import { getUserReviews, deleteReview } from '@/services/reviewService'
import { getUserSubmittedRecipes, submitUserRecipe } from '@/services/recipeService'

export default {
  name: 'ProfilePage',
  data() {
    return {
      activeTab: 'reviews',
      currentUser: null,
      newUsername: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      usernameLoading: false,
      passwordLoading: false,
      usernameError: '',
      usernameSuccess: '',
      passwordError: '',
      passwordSuccess: '',
      // Reviews data
      userReviews: [],
      reviewsLoading: false,
      reviewCurrentPage: 1,
      reviewsPerPage: 4,
      showDeleteModal: false,
      reviewToDelete: null,
      isDeleting: false,
      userRecipes: [],
      recipesLoading: false,
      recipeForm: {
        title: '',
        category: '',
        cuisine: '',
        image: '',
        description: '',
        ingredients: '',
        instructions: '',
        prepTime: '',
        cookingTime: '',
        servings: '',
        calories: '',
        tags: ''
      },
      recipeSubmitting: false,
      recipeSuccess: '',
      recipeError: '',
      logoutLoading: false
    }
  },
  computed: {
    totalReviewPages() {
      return Math.ceil(this.userReviews.length / this.reviewsPerPage);
    },
    paginatedReviews() {
      const start = (this.reviewCurrentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.userReviews.slice(start, end);
    }
  },
  async mounted() {
    if (!isAuthenticated()) {
      this.$router.push('/login')
      return
    }

    this.currentUser = await getCurrentUser()
    if (!this.currentUser) {
      this.$router.push('/login')
      return
    }

    // Load user's reviews
    await Promise.all([
      this.loadUserReviews(),
      this.loadUserRecipes()
    ])
  },
  methods: {
    async loadUserReviews() {
      this.reviewsLoading = true
      try {
        const result = await getUserReviews()
        if (result.success) {
          this.userReviews = result.reviews
        } else {
          console.error('Failed to load reviews:', result.error)
        }
      } catch (error) {
        console.error('Error loading reviews:', error)
      }
      this.reviewsLoading = false
    },

    async loadUserRecipes() {
      this.recipesLoading = true
      try {
        const result = await getUserSubmittedRecipes()
        if (result.success) {
          this.userRecipes = result.recipes
        } else {
          console.error('Failed to load recipes:', result.error)
        }
      } catch (error) {
        console.error('Error loading recipes:', error)
      }
      this.recipesLoading = false
    },

    recipeStatus(recipe) {
      if (!recipe.isActive) {
        return 'Removed'
      }

      if (recipe.isApproved) {
        return 'Approved'
      }

      if (recipe.updatedAt && recipe.createdAt && recipe.updatedAt !== recipe.createdAt) {
        return 'Under Review'
      }

      return 'Pending'
    },

    recipeStatusClass(recipe) {
      return `status-${this.recipeStatus(recipe).toLowerCase().replace(/\s+/g, '-')}`
    },

    recipeTotalTime(recipe) {
      return Number(recipe.prepTime || 0) + Number(recipe.cookingTime || 0)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    changeReviewPage(page) {
      if (page >= 1 && page <= this.totalReviewPages) {
        this.reviewCurrentPage = page
      }
    },

    confirmDeleteReview(review) {
      this.reviewToDelete = review
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.showDeleteModal = false
      this.reviewToDelete = null
    },

    async deleteReviewConfirmed() {
      if (!this.reviewToDelete) return

      this.isDeleting = true
      try {
        const result = await deleteReview(this.reviewToDelete.id)
        if (result.success) {
          // Remove from local list
          const index = this.userReviews.findIndex(r => r.id === this.reviewToDelete.id)
          if (index !== -1) {
            this.userReviews.splice(index, 1)
          }
          // Adjust page if needed
          if (this.paginatedReviews.length === 0 && this.reviewCurrentPage > 1) {
            this.reviewCurrentPage--
          }
        } else {
          console.error('Failed to delete review:', result.error)
        }
      } catch (error) {
        console.error('Error deleting review:', error)
      }

      this.isDeleting = false
      this.showDeleteModal = false
      this.reviewToDelete = null
    },
    resetRecipeForm() {
      this.recipeForm = {
        title: '',
        category: '',
        cuisine: '',
        image: '',
        description: '',
        ingredients: '',
        instructions: '',
        prepTime: '',
        cookingTime: '',
        servings: '',
        calories: '',
        tags: ''
      }
    },
    async handleRecipeSubmit() {
      if (!this.recipeForm.title.trim()) {
        this.recipeError = 'Recipe title is required'
        this.recipeSuccess = ''
        return
      }

      this.recipeSubmitting = true
      this.recipeError = ''
      this.recipeSuccess = ''

      const ingredients = this.recipeForm.ingredients
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)

      const tags = this.recipeForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)

      const payload = {
        title: this.recipeForm.title,
        category: this.recipeForm.category,
        cuisine: this.recipeForm.cuisine,
        image: this.recipeForm.image,
        description: this.recipeForm.description,
        ingredients,
        instructions: this.recipeForm.instructions,
        prepTime: this.recipeForm.prepTime,
        cookingTime: this.recipeForm.cookingTime,
        servings: this.recipeForm.servings,
        calories: this.recipeForm.calories,
        tags
      }

      const result = await submitUserRecipe(payload)

      if (result.success) {
        this.recipeSuccess = 'Recipe submitted! An admin will review it shortly.'
        if (result.recipe) {
          this.userRecipes.unshift(result.recipe)
        }
        this.resetRecipeForm()
      } else {
        this.recipeError = result.error || 'Failed to submit recipe'
      }

      this.recipeSubmitting = false
    },

    async handleUpdateUsername() {
      this.usernameLoading = true
      this.usernameError = ''
      this.usernameSuccess = ''

      if (this.newUsername.length < 3) {
        this.usernameError = 'Username must be at least 3 characters'
        this.usernameLoading = false
        return
      }

      const result = await updateUsername(this.newUsername)

      if (result.success) {
        this.usernameSuccess = 'Username updated successfully!'
        this.newUsername = ''
        // Refresh current user data
        this.currentUser = await getCurrentUser()
      } else {
        this.usernameError = result.error || 'Failed to update username'
      }

      this.usernameLoading = false
    },

    async handleUpdatePassword() {
      this.passwordLoading = true
      this.passwordError = ''
      this.passwordSuccess = ''

      if (this.newPassword !== this.confirmNewPassword) {
        this.passwordError = 'New passwords do not match'
        this.passwordLoading = false
        return
      }

      if (this.newPassword.length < 6) {
        this.passwordError = 'Password must be at least 6 characters'
        this.passwordLoading = false
        return
      }

      const result = await updateUserPassword(this.currentPassword, this.newPassword)

      if (result.success) {
        this.passwordSuccess = 'Password changed successfully!'
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmNewPassword = ''
      } else {
        this.passwordError = result.error || 'Failed to change password'
      }

      this.passwordLoading = false
    },

    async handleLogout() {
      this.logoutLoading = true
      try {
        await logoutUser()
        this.$router.push('/home-page')
      } catch (error) {
        console.error('Logout error:', error)
        alert('Failed to logout. Please try again.')
      } finally {
        this.logoutLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Premium White Liquid Glass Theme */
.profile-page {
  min-height: 100vh;
  background-color: #ffffff;
  background-image: 
    radial-gradient(at 0% 0%, rgba(46, 125, 50, 0.03) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(46, 125, 50, 0.03) 0px, transparent 50%);
  padding-top: clamp(90px, 12vw, 120px);
  padding-bottom: 60px;
}

.section-title {
  font-size: clamp(1.15rem, 3.5vw, 1.5rem);
}

/* Glass Card Global */
.glass-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 20px;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

/* Sidebar */
.profile-sidebar {
  position: sticky;
  top: 100px;
}

.profile-avatar-wrapper {
  display: inline-flex;
  padding: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(46, 125, 50, 0.02));
  border: 1px solid rgba(46, 125, 50, 0.1);
}

.profile-avatar {
  width: 90px;
  height: 90px;
  background: #2e7d32;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.2);
}

.profile-nav .nav-link {
  color: #6c757d;
  border-radius: 50rem;
  padding: 12px 20px;
  margin-bottom: 8px;
  font-weight: 600;
  text-align: left;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.profile-nav .nav-link:hover {
  background: rgba(46, 125, 50, 0.04);
  color: #2e7d32;
}

.profile-nav .nav-link.active {
  background: #2e7d32;
  color: white;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.2);
}

.profile-nav .logout-nav-link {
  margin-top: 8px;
  color: #b91c1c;
  background: #fff5f5;
  border-color: rgba(185, 28, 28, 0.12);
}

.profile-nav .logout-nav-link i {
  color: #dc2626;
}

.profile-nav .logout-nav-link:hover:not(:disabled) {
  color: #991b1b;
  background: #fee2e2;
  border-color: rgba(185, 28, 28, 0.22);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(185, 28, 28, 0.12);
}

.profile-nav .logout-nav-link:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Typography & General */
.section-title {
  color: #1a1a1a;
  font-weight: 800;
}

.text-light-gray {
  color: #e0e0e0;
}

/* Forms */
.form-floating > .form-control {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  background-color: #fcfcfc;
  transition: all 0.3s ease;
}

.form-floating > .form-control:focus {
  background-color: #ffffff;
  border-color: #2e7d32;
  box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.1);
}

.premium-textarea {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  background-color: #fcfcfc;
  padding: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.premium-textarea:focus {
  background-color: #ffffff;
  border-color: #2e7d32;
  box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.1);
  outline: none;
}

.premium-input-group {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
  background-color: #fcfcfc;
  transition: all 0.3s ease;
}

.premium-input-group:focus-within {
  background-color: #ffffff;
  border-color: #2e7d32;
  box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.1);
}

.premium-input-group .form-control {
  border: none;
  background: transparent;
  box-shadow: none !important;
}

.premium-input-group .btn {
  border: none;
  background: transparent;
}

/* Reviews */
.review-item {
  border: 1px solid rgba(0,0,0,0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.review-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.stars { color: #ffc107; font-size: 0.9rem; }
.review-recipe-title { color: #1a1a1a; text-decoration: none; font-weight: 700; transition: color 0.2s; }
.review-recipe-title:hover { color: #2e7d32; }

/* My Recipes */
.my-recipe-card {
  padding: 18px;
  border: 1px solid rgba(0,0,0,0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.my-recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.recipe-status-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.recipe-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.status-pending {
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fde68a;
}

.status-approved {
  color: #166534;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.status-under-review {
  color: #1d4ed8;
  background: #dbeafe;
  border: 1px solid #bfdbfe;
}

.status-removed {
  color: #991b1b;
  background: #fee2e2;
  border: 1px solid #fecaca;
}

.my-recipe-body {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
}

.recipe-thumb {
  width: 118px;
  height: 98px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.08);
  border-radius: 16px;
  font-size: 2rem;
}

.recipe-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info h5 {
  color: #1a1a1a;
  font-weight: 800;
}

.recipe-info p {
  display: -webkit-box;
  overflow: hidden;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recipe-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 14px;
}

.recipe-meta-grid span {
  color: #6c757d;
  font-size: 0.82rem;
  font-weight: 700;
}

/* Buttons */
.btn-icon {
  width: 36px; height: 36px; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}
.btn-icon:hover {
  background: #fee2e2 !important;
  color: #dc3545 !important;
}

/* Pagination */
.custom-pagination .page-link {
  border: none;
  color: #6c757d;
  margin: 0 4px;
  border-radius: 50%;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600;
  transition: all 0.2s;
}
.custom-pagination .page-item.active .page-link {
  background-color: #2e7d32;
  color: white;
  box-shadow: 0 4px 10px rgba(46, 125, 50, 0.2);
}
.custom-pagination .page-link:hover:not(.active) {
  background-color: rgba(46, 125, 50, 0.08);
  color: #2e7d32;
}

/* Modal */
.custom-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050;
}
.custom-modal {
  width: 90%; max-width: 400px;
  padding: 2rem;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}
.modal-icon {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}
.bg-soft-danger { background-color: rgba(220, 53, 69, 0.1); }
.bg-soft-success { background-color: rgba(46, 125, 50, 0.1); }

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 576px) {
  .my-recipe-body {
    grid-template-columns: 1fr;
  }

  .recipe-thumb {
    width: 100%;
    height: 170px;
  }

  .recipe-meta-grid,
  .recipe-status-row {
    grid-template-columns: 1fr;
  }

  .recipe-status-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
