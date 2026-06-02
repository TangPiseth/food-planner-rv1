<template>
  <div class="recipe-detail-page overflow-hidden" data-aos="fade-up">
    <!-- Toast Notification - at root level for proper z-index -->
    <teleport to="body">
      <transition name="toast-fade">
        <div v-if="showToast" class="toast-notification">
          <i class="fa-solid fa-check-circle"></i>
          <span>{{ toastMessage }}</span>
        </div>
      </transition>
    </teleport>

    <!-- SVG Filters -->
    <svg style="display: none">
      <filter id="glass-distortion-recipe-hero">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="15" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
      <filter id="glass-distortion-recipe-cards">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="16" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
      <filter id="glass-distortion-recipe-image">
        <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="3" result="noise" seed="20" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="85" />
      </filter>
    </svg>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading recipe details...</p>
    </div>

    <!-- Recipe Not Found -->
    <div v-else-if="!recipe" class="not-found-container">
      <div class="container text-center py-5">
        <i class="fa-solid fa-utensils fa-3x text-muted mb-3"></i>
        <h2>Recipe Not Found</h2>
        <p class="text-muted">The recipe you're looking for doesn't exist or has been removed.</p>
        <button @click="goBack" class="btn btn-success mt-3">Go Back</button>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="recipe-hero-section" v-else-if="recipe">
      <div class="container">
        <button @click="goBack" class="back-btn">
          <i class="fa-solid fa-chevron-left"></i>
          <span>Back</span>
        </button>

        <div class="hero-content">
          <div class="hero-copy">
            <span class="recipe-badge">{{ formattedRecipeType }}</span>
            <h1 class="recipe-title">{{ recipe.title }}</h1>
            <p class="recipe-description">{{ recipe.description || recipe.chefsTips || 'A fresh, flavorful recipe ready for your next meal.' }}</p>

            <div class="recipe-meta">
              <span class="meta-author">By {{ recipe.author }}</span>
              <span class="meta-divider"></span>
              <span class="meta-date">{{ recipe.date }}</span>
            </div>
          </div>

          <div class="hero-actions-card">
            <div class="hero-rating">
              <span class="hero-rating-value">{{ displayRating }}</span>
              <span class="hero-rating-label">out of 5</span>
              <span v-if="totalReviews > 0" class="hero-review-count">{{ totalReviews }} reviews</span>
            </div>

            <div class="hero-actions">
              <button class="primary-action-btn" @click="addIngredientsToNewList">
                <i class="fa-solid fa-cart-plus"></i>
                <span>Add to Grocery List</span>
              </button>
              <button class="secondary-action-btn" @click="downloadPDF" :disabled="isGeneratingPDF">
                <i :class="isGeneratingPDF ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-file-pdf'"></i>
                <span>{{ isGeneratingPDF ? 'Generating...' : 'Download PDF' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="recipe" class="recipe-content-section">
      <div class="container">
        <div class="recipe-overview-grid">
          <!-- Recipe Image -->
          <div class="recipe-image-container" data-aos="zoom-out">
            <div class="recipe-image-glass">
              <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" class="recipe-image" />
              <div v-else class="recipe-image-fallback">
                <i class="fa-solid fa-utensils"></i>
              </div>
            </div>
          </div>

          <aside class="recipe-summary-panel" data-aos="fade-left">
            <div class="summary-header">
              <span>Recipe Snapshot</span>
              <strong>{{ recipe.difficulty || 'Easy' }}</strong>
            </div>

            <!-- Quick Info Cards -->
            <div class="recipe-info-grid">
              <div class="info-card">
                <div class="info-card-content">
                  <i class="fa-solid fa-star"></i>
                  <h4>Rating</h4>
                  <p>{{ displayRating }}/5</p>
                </div>
              </div>

              <div class="info-card">
                <div class="info-card-content">
                  <i class="fa-solid fa-users"></i>
                  <h4>Servings</h4>
                  <p>{{ recipe.servings || "N/A" }}</p>
                </div>
              </div>

              <div class="info-card">
                <div class="info-card-content">
                  <i class="fa-solid fa-clock"></i>
                  <h4>Total Time</h4>
                  <p>{{ totalTime }} min</p>
                </div>
              </div>

              <div class="info-card">
                <div class="info-card-content">
                  <i class="fa-solid fa-fire"></i>
                  <h4>Calories</h4>
                  <p>{{ recipe.calories || "N/A" }} kcal</p>
                </div>
              </div>
            </div>

            <!-- Recipe Details -->
            <div class="recipe-details-section">
              <div v-for="detail in recipeDetails" :key="detail.label" class="detail-pill">
                <span>{{ detail.label }}</span>
                <strong>{{ detail.value }}</strong>
              </div>
            </div>
          </aside>
        </div>

        <!-- Ingredients Section -->
        <div class="recipe-section ingredients-section" data-aos="fade-up">
          <div class="section-glass-card">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="section-content">
              <div class="section-title-with-button">
                <h3 class="section-title">
                  <i class="fa-solid fa-leaf"></i> Ingredients
                </h3>
                <span class="section-count">{{ recipe.ingredients?.length || 0 }} items</span>
              </div>
              <div class="ingredients-list">
                <div class="ingredient-item" v-for="(ingredient, index) in recipe.ingredients" :key="index">
                  <input class="ingredient-checkbox" type="checkbox" :id="'ingredient-' + index" />
                  <label :for="'ingredient-' + index">{{ ingredient }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Directions Section -->
        <div class="recipe-section directions-section" data-aos="fade-up">
          <div class="section-glass-card">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="section-content">
              <h3 class="section-title">
                <i class="fa-solid fa-utensils"></i> Directions
              </h3>
              <ol class="directions-list">
                <li v-for="(step, index) in instructionSteps" :key="index">
                  <span class="step-number">{{ index + 1 }}</span>
                  <p>{{ step }}</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <!-- Notes Section -->
        <div v-if="normalizedNotes.length" class="recipe-section notes-section" data-aos="fade-up">
          <div class="section-glass-card">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="section-content">
              <h3 class="section-title">
                <i class="fa-solid fa-info"></i> Notes
              </h3>
              <div class="notes-list">
                <div class="note-item" v-for="(note, index) in normalizedNotes" :key="index">
                  <i class="fa-solid fa-lightbulb"></i>
                  <p>{{ note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chef's Tips Section -->
        <div v-if="recipe.chefsTips" class="recipe-section tips-section" data-aos="fade-up">
          <div class="section-glass-card">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="section-content">
              <h3 class="section-title">
                <i class="fa-solid fa-chef-hat"></i> Chef's Tips
              </h3>
              <p class="tips-text">{{ recipe.chefsTips }}</p>
            </div>
          </div>
        </div>

        <!-- Related Recipes Section -->
        <div v-if="suggestedRecipes.length" class="recipe-section related-section" data-aos="fade-up">
          <h3 class="section-title-main">
            <i class="fa-solid fa-sparkles"></i> You Might Also Like
          </h3>
          
          <!-- Slider Container -->
          <div class="related-slider-container">
            <!-- Left Navigation Button -->
            <button 
              class="slider-nav-btn slider-nav-prev" 
              @click="prevSlide" 
              :disabled="currentSlide === 0"
              aria-label="Previous recipes"
            >
              <i class="fa-solid fa-chevron-left"></i>
            </button>

            <!-- Slider Track -->
            <div class="related-slider-wrapper">
              <div 
                class="related-slider-track" 
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
              >
                <!-- Slide Pages -->
                <div 
                  class="related-slider-page" 
                  v-for="(page, pageIndex) in sliderPages" 
                  :key="pageIndex"
                >
                  <div class="related-recipes-grid">
                    <div class="related-recipe-card" v-for="relatedRecipe in page" :key="relatedRecipe.id">
                      <div class="recipe-card-glass">
                        <div class="glass-filter"></div>
                        <div class="glass-overlay"></div>
                        <div class="glass-specular"></div>
                        <div class="recipe-card-content">
                          <div class="recipe-card-image">
                            <img :src="relatedRecipe.image" :alt="relatedRecipe.title" />
                          </div>
                          <div class="recipe-card-body">
                            <span class="recipe-type-badge">{{ relatedRecipe.type.toLowerCase().replace('_', ' ') }}</span>
                            <h4 class="recipe-card-title">{{ relatedRecipe.title }}</h4>
                            <p class="recipe-card-desc">{{ relatedRecipe.description }}</p>
                            <div class="recipe-card-footer">
                              <span class="recipe-time">
                                <i class="fa-solid fa-clock"></i> {{ relatedRecipe.cookingTime }} mins
                              </span>
                              <router-link :to="'/recipes/' + relatedRecipe.id" class="recipe-card-link">View</router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Navigation Button -->
            <button 
              class="slider-nav-btn slider-nav-next" 
              @click="nextSlide" 
              :disabled="currentSlide === totalSlides - 1"
              aria-label="Next recipes"
            >
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Page Indicators -->
          <div class="slider-indicators">
            <button 
              v-for="(page, index) in totalSlides" 
              :key="index"
              class="slider-dot"
              :class="{ active: currentSlide === index }"
              @click="goToSlide(index)"
              :aria-label="`Go to page ${index + 1}`"
            ></button>
          </div>
        </div>

        <!-- Review Components -->
        <div class="reviews-container">
          <RecipeReviewForm 
            ref="reviewFormComponent"
            :recipeId="recipe.id" 
            :recipeTitle="recipe.title"
            @review-submitted="handleNewReview" 
          />
          <RecipeReviews 
            ref="reviewsComponent" 
            :recipeId="recipe.id" 
            @edit-review="handleEditReview"
            @review-deleted="handleReviewDeleted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRecipe, getSuggestedRecipes } from "@/services/recipeService";
import { createGroceryList, addRecipeToList, isAuthenticated } from "@/services/groceryListService";
import { getRecipeRating } from "@/services/reviewService";
import RecipeReviewForm from '@/components/RecipeReviewForm.vue';
import RecipeReviews from '@/components/RecipeReviews.vue';
import jsPDF from 'jspdf';

export default {
  components: {
    RecipeReviewForm,
    RecipeReviews,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      recipe: null,
      suggestedRecipes: [],
      loading: false,
      showToast: false,
      toastMessage: '',
      averageRating: 0,
      totalReviews: 0,
      currentSlide: 0,
      recipesPerPage: 3,
      isGeneratingPDF: false,
    };
  },

  computed: {
    formattedRecipeType() {
      return (this.recipe?.type || 'Recipe').toString().replace(/_/g, ' ').toLowerCase();
    },
    totalTime() {
      return (this.recipe?.prepTime || 0) + (this.recipe?.cookingTime || 0);
    },
    recipeDetails() {
      if (!this.recipe) {
        return [];
      }

      return [
        { label: 'Course', value: this.recipe.course || 'N/A' },
        { label: 'Cuisine', value: this.recipe.cuisine || 'N/A' },
        { label: 'Difficulty', value: this.recipe.difficulty || 'Easy' },
        { label: 'Prep', value: `${this.recipe.prepTime || 0} min` },
        { label: 'Cook', value: `${this.recipe.cookingTime || 0} min` }
      ];
    },
    instructionSteps() {
      const instructions = this.recipe?.instructions || '';
      const lineSteps = instructions
        .split(/\r?\n+/)
        .map((step) => step.trim())
        .filter(Boolean);

      if (lineSteps.length > 1) {
        return lineSteps;
      }

      return instructions
        .split(/\.\s+/)
        .map((step, index, steps) => {
          const trimmed = step.trim();
          if (!trimmed) {
            return '';
          }
          return index < steps.length - 1 && !/[.!?]$/.test(trimmed) ? `${trimmed}.` : trimmed;
        })
        .filter(Boolean);
    },
    normalizedNotes() {
      const notes = this.recipe?.notes;
      if (Array.isArray(notes)) {
        return notes.filter(Boolean);
      }
      if (typeof notes === 'string' && notes.trim()) {
        return [notes.trim()];
      }
      return [];
    },
    displayRating() {
      if (this.totalReviews > 0) {
        return this.averageRating;
      }
      return this.recipe?.rating || 0;
    },
    sliderPages() {
      const pages = [];
      for (let i = 0; i < this.suggestedRecipes.length; i += this.recipesPerPage) {
        pages.push(this.suggestedRecipes.slice(i, i + this.recipesPerPage));
      }
      return pages;
    },
    totalSlides() {
      return this.sliderPages.length;
    }
  },

  watch: {
    // Add this watcher
    id: {
      immediate: true,
      handler: async function(newId) {
        // Reset the current recipe
        this.recipe = null;
        this.loading = true;
        this.averageRating = 0;
        this.totalReviews = 0;
        
        try {
          // Fetch new recipe from API
          this.recipe = await fetchRecipe(newId);

          if (this.recipe) {
            // Get suggested recipes based on category/cuisine (max 9 for slider)
            this.suggestedRecipes = await getSuggestedRecipes(this.recipe, 9);
            this.currentSlide = 0; // Reset slider position
            
            // Fetch real rating from reviews database
            await this.fetchRating();
          }
        } catch (error) {
          console.error('Error fetching recipe:', error);
        } finally {
          this.loading = false;
        }
      }
    }
  },

  // Remove the mounted hook since we're using the watcher now
  methods: {
    async downloadPDF() {
      if (this.isGeneratingPDF) return;
      
      this.isGeneratingPDF = true;
      this.toastMessage = 'Generating your recipe PDF...';
      this.showToast = true;

      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let y = margin;

        // Helper function to add text with word wrap
        const addWrappedText = (text, x, startY, maxWidth, lineHeight = 6) => {
          const lines = pdf.splitTextToSize(text, maxWidth);
          let currentY = startY;
          lines.forEach(line => {
            if (currentY > pageHeight - margin) {
              pdf.addPage();
              currentY = margin;
            }
            pdf.text(line, x, currentY);
            currentY += lineHeight;
          });
          return currentY;
        };

        // Check if we need a new page
        const checkNewPage = (neededHeight) => {
          if (y + neededHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
        };

        // ========== HEADER ==========
        pdf.setFillColor(46, 125, 50); // Green header bar
        pdf.rect(0, 0, pageWidth, 35, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('EatsBuddy', margin, 18);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        pdf.text(dateStr, pageWidth - margin - pdf.getTextWidth(dateStr), 18);
        
        pdf.setFontSize(11);
        pdf.text('Your Recipe Collection', margin, 28);

        y = 50;

        // ========== RECIPE TITLE ==========
        pdf.setTextColor(26, 26, 26);
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        y = addWrappedText(this.recipe.title, margin, y, contentWidth, 9);
        
        // Author and Type
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        y += 3;
        pdf.text(`by ${this.recipe.author}  |  ${this.recipe.type || 'Recipe'}`, margin, y);
        y += 12;

        // ========== INFO BOX ==========
        pdf.setFillColor(241, 248, 233); // Light green background
        pdf.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');
        
        const infoY = y + 10;
        const colWidth = contentWidth / 4;
        
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Rating', margin + 10, infoY);
        pdf.text('Servings', margin + colWidth + 10, infoY);
        pdf.text('Total Time', margin + colWidth * 2 + 10, infoY);
        pdf.text('Calories', margin + colWidth * 3 + 10, infoY);
        
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(46, 125, 50);
        pdf.text(`${this.displayRating}/5`, margin + 10, infoY + 10);
        pdf.text(`${this.recipe.servings || 'N/A'}`, margin + colWidth + 10, infoY + 10);
        pdf.text(`${(this.recipe.prepTime || 0) + (this.recipe.cookingTime || 0)} min`, margin + colWidth * 2 + 10, infoY + 10);
        pdf.text(`${this.recipe.calories || 'N/A'}`, margin + colWidth * 3 + 10, infoY + 10);
        
        y += 38;

        // ========== DETAILS ROW ==========
        pdf.setFillColor(255, 248, 225); // Light yellow
        pdf.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        const details = `Course: ${this.recipe.course || 'N/A'}    |    Cuisine: ${this.recipe.cuisine || 'N/A'}    |    Difficulty: ${this.recipe.difficulty || 'N/A'}`;
        pdf.text(details, margin + 8, y + 8);
        y += 22;

        // ========== INGREDIENTS SECTION ==========
        checkNewPage(40);
        
        pdf.setFillColor(46, 125, 50);
        pdf.rect(margin, y, 4, 10, 'F'); // Green accent bar
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(46, 125, 50);
        pdf.text('Ingredients', margin + 8, y + 7);
        y += 16;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 51, 51);
        
        if (this.recipe.ingredients && this.recipe.ingredients.length > 0) {
          this.recipe.ingredients.forEach((ingredient) => {
            checkNewPage(8);
            pdf.setFillColor(200, 200, 200);
            pdf.circle(margin + 3, y - 1.5, 1.5, 'F');
            y = addWrappedText(ingredient, margin + 10, y, contentWidth - 10, 6);
            y += 2;
          });
        }
        y += 8;

        // ========== INSTRUCTIONS SECTION ==========
        checkNewPage(40);
        
        pdf.setFillColor(46, 125, 50);
        pdf.rect(margin, y, 4, 10, 'F');
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(46, 125, 50);
        pdf.text('Instructions', margin + 8, y + 7);
        y += 16;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 51, 51);
        
        if (this.recipe.instructions) {
          y = addWrappedText(this.recipe.instructions, margin, y, contentWidth, 6);
        }
        y += 10;

        // ========== CHEF'S TIPS (if exists) ==========
        if (this.recipe.chefsTips) {
          checkNewPage(30);
          
          pdf.setFillColor(227, 242, 253); // Light blue
          const tipsHeight = Math.max(20, pdf.splitTextToSize(this.recipe.chefsTips, contentWidth - 16).length * 6 + 16);
          pdf.roundedRect(margin, y, contentWidth, tipsHeight, 3, 3, 'F');
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(21, 101, 192);
          pdf.text("Chef's Tips", margin + 8, y + 10);
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          addWrappedText(this.recipe.chefsTips, margin + 8, y + 18, contentWidth - 16, 6);
          y += tipsHeight + 10;
        }

        // ========== NOTES (if exists) ==========
        if (this.recipe.notes && this.recipe.notes.length > 0) {
          checkNewPage(30);
          
          pdf.setFillColor(255, 243, 224); // Light orange
          const notesText = this.recipe.notes.join('\n• ');
          const notesHeight = Math.max(20, pdf.splitTextToSize('• ' + notesText, contentWidth - 16).length * 6 + 16);
          pdf.roundedRect(margin, y, contentWidth, notesHeight, 3, 3, 'F');
          
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(230, 81, 0);
          pdf.text('Notes', margin + 8, y + 10);
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          addWrappedText('• ' + notesText, margin + 8, y + 18, contentWidth - 16, 6);
          y += notesHeight + 10;
        }

        // ========== FOOTER ==========
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(9);
          pdf.setTextColor(150, 150, 150);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
          pdf.text('www.eatsbuddy.com', pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        // Download the PDF
        const fileName = this.recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        pdf.save(`${fileName}_recipe.pdf`);

        this.showToast = false;
        setTimeout(() => {
          this.toastMessage = 'Recipe PDF downloaded successfully!';
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 2000);
        }, 100);

      } catch (error) {
        console.error('Error generating PDF:', error);
        this.showToast = false;
        setTimeout(() => {
          this.toastMessage = 'Error generating PDF. Please try again.';
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 3000);
        }, 100);
      } finally {
        this.isGeneratingPDF = false;
      }
    },
    nextSlide() {
      if (this.currentSlide < this.totalSlides - 1) {
        this.currentSlide++;
      }
    },
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },
    goToSlide(index) {
      this.currentSlide = index;
    },
    async fetchRating() {
      try {
        const result = await getRecipeRating(this.id);
        if (result.success) {
          this.averageRating = result.averageRating;
          this.totalReviews = result.totalReviews;
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    },
    async handleNewReview(reviewData) {
      await this.$nextTick();

      if (this.$refs.reviewsComponent) {
        this.$refs.reviewsComponent.addReview(reviewData);
      }

      this.fetchRating();
    },
    handleEditReview(review) {
      // Scroll to the review form
      if (this.$refs.reviewFormComponent) {
        this.$refs.reviewFormComponent.$el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleReviewDeleted(reviewId) {
      // Refresh the review form to allow creating a new review
      if (this.$refs.reviewFormComponent) {
        this.$refs.reviewFormComponent.checkExistingReview();
      }
      // Refresh the rating
      this.fetchRating();
    },
    goBack() {
      this.$router.go(-1);
    },
    async addIngredientsToNewList() {
      // Check if user is authenticated first
      if (!isAuthenticated()) {
        this.toastMessage = 'Please login to add ingredients to grocery list';
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
          this.$router.push('/login');
        }, 2000);
        return;
      }

      try {
        // Create a new grocery list with the recipe name
        const newList = await createGroceryList({
          name: this.recipe.title,
          date: new Date().toISOString(),
          items: []
        });

        // Parse ingredients into items
        const items = this.recipe.ingredients.map(ingredient => {
          return {
            name: ingredient,
            quantity: 1,
            unit: 'pcs'
          };
        });

        // Add ingredients to the newly created list
        await addRecipeToList(newList._id, items);
        
        // Show success toast
        this.toastMessage = `${this.recipe.title} added to your grocery list!`;
        this.showToast = true;

        // Hide toast after 2 seconds
        setTimeout(() => {
          this.showToast = false;
        }, 2000);

      } catch (error) {
        console.error('Error adding ingredients:', error);
        if (error.response?.status === 401) {
          this.toastMessage = 'Please login to add ingredients';
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
            this.$router.push('/login');
          }, 2000);
        } else {
          this.toastMessage = 'Error adding ingredients. Please try again.';
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 2000);
        }
      }
    }
  },
};
</script>

<style scoped>
/* Loading and Not Found States */
.loading-container,
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding-top: 80px;
}

/* Hero Section */
.recipe-detail-page {
  padding-top: 80px;
  font-family: 'Poppins', sans-serif !important;
}

.recipe-hero-section {
  position: relative;
  padding: 60px 20px;
  overflow: hidden;
}

.hero-gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  z-index: -1;
}

.recipe-hero-section .container {
  position: relative;
  z-index: 1;
}

.back-btn {
  padding: 8px 16px;
  background: rgba(46, 125, 50, 0.15);
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.3);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: rgba(46, 125, 50, 0.25);
  transform: translateY(-2px);
}

.hero-content {
  text-align: center;
}

.recipe-badge {
  display: inline-block;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.recipe-title {
  font-size: 48px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 16px 0;
  line-height: 1.2;
  font-family: system-ui, -apple-system, sans-serif;
}

.recipe-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #4a4a4a;
}

.meta-divider {
  color: #ccc;
}

.meta-author {
  font-weight: 500;
}

/* Content Section */
.recipe-content-section {
  padding: 40px 0;
}

.recipe-image-container {
  max-width: 600px;
  margin: 0 auto 48px;
  border-radius: 32px;
  overflow: hidden;
}

.recipe-image-glass {
  --bg-color: rgba(255, 255, 255, 0.4);
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6),
              inset -2px -2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.recipe-image-glass:hover {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6),
              inset -2px -2px 8px rgba(0, 0, 0, 0.08);
  transform: scale(1.01);
}

.image-glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(3px);
  filter: url(#glass-distortion-recipe-image) saturate(130%) brightness(1.15) contrast(1.05);
  z-index: 1;
  pointer-events: none;
}

.image-glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(0, 0, 0, 0.03) 100%);
  z-index: 2;
  pointer-events: none;
}

.image-glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 2px 2px 8px rgba(255, 255, 255, 0.6),
              inset -3px -3px 10px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  z-index: 3;
  pointer-events: none;
}

.recipe-image {
  position: relative;
  z-index: 4;
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-image-glass:hover .recipe-image {
  transform: scale(1.03);
}

/* Info Cards Grid */
.recipe-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-card {
  position: relative;
  height: 180px;
}

.info-card-glass {
  --bg-color: rgba(255, 255, 255, 0.55);
  --highlight: rgba(255, 255, 255, 0.9);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card-glass:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
}

.glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-recipe-cards) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color);
  z-index: 2;
}

.glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.75),
              inset -1px -1px 2px rgba(0, 0, 0, 0.05);
  z-index: 3;
}

.info-card-content {
  position: relative;
  z-index: 4;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.info-card-content i {
  font-size: 32px;
  color: #2e7d32;
  margin-bottom: 12px;
}

.info-card-content h4 {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card-content p {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

/* Recipe Details */
.recipe-details-section {
  padding: 24px;
  background: rgba(46, 125, 50, 0.05);
  border-radius: 20px;
  margin-bottom: 40px;
}

.recipe-details-text {
  font-size: 15px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.8;
}

/* Section Glass Cards */
.recipe-section {
  margin-bottom: 40px;
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-glass-card {
  --bg-color: rgba(255, 255, 255, 0.55);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.section-glass-card .glass-filter {
  backdrop-filter: blur(5px);
}

.section-content {
  position: relative;
  z-index: 4;
  padding: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title i {
  color: #2e7d32;
  font-size: 28px;
}

/* Ingredients */
.ingredients-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(46, 125, 50, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(46, 125, 50, 0.1);
  transition: all 0.2s ease;
}

.ingredient-item:hover {
  background: rgba(46, 125, 50, 0.08);
  border-color: rgba(46, 125, 50, 0.2);
}

.ingredient-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #2e7d32;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.ingredient-checkbox:checked {
  background-color: #2e7d32;
}

.ingredient-item label {
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  margin: 0;
  font-family: inherit;
}

.ingredient-item input:checked ~ label {
  text-decoration: line-through;
  color: #999;
}

/* Directions */
.directions-text {
  font-size: 15px;
  line-height: 1.8;
  color: #1a1a1a;
  margin: 0;
  font-family: inherit;
}

/* Notes */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 193, 7, 0.08);
  border-radius: 12px;
  border-left: 4px solid #ffc107;
}

.note-item i {
  color: #ffc107;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.note-item p {
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.6;
  font-family: inherit;
}

/* Chef's Tips */
.tips-text {
  font-size: 15px;
  line-height: 1.8;
  color: #1a1a1a;
  margin: 0;
  font-family: inherit;
}

/* Related Recipes */
.section-title-main {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.section-title-main i {
  color: #2e7d32;
}

/* Slider Container */
.related-slider-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.related-slider-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 24px;
}

.related-slider-track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.related-slider-page {
  min-width: 100%;
  padding: 0 4px;
}

/* Slider Navigation Buttons */
.slider-nav-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(46, 125, 50, 0.3);
  background: rgba(255, 255, 255, 0.9);
  color: #2e7d32;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.slider-nav-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border-color: transparent;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.3);
}

.slider-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* Page Indicators */
.slider-indicators {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(46, 125, 50, 0.4);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.slider-dot:hover {
  border-color: #2e7d32;
  background: rgba(46, 125, 50, 0.2);
}

.slider-dot.active {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  border-color: transparent;
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.4);
}

.related-recipes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.related-recipe-card {
  position: relative;
  height: 100%;
}

.recipe-card-glass {
  --bg-color: rgba(255, 255, 255, 0.55);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.recipe-card-glass:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.recipe-card-content {
  position: relative;
  z-index: 4;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.recipe-card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: rgba(46, 125, 50, 0.1);
}

.recipe-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card-glass:hover .recipe-card-image img {
  transform: scale(1.05);
}

.recipe-card-body {
  position: relative;
  z-index: 5;
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.recipe-type-badge {
  display: inline-block;
  background: rgba(46, 125, 50, 0.15);
  color: #2e7d32;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  width: fit-content;
}

.recipe-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: inherit;
}

.recipe-card-desc {
  font-size: 13px;
  color: #4a4a4a;
  margin: 0 0 12px;
  flex: 1;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: inherit;
}

.recipe-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(46, 125, 50, 0.1);
}

.recipe-time {
  font-size: 12px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recipe-time i {
  color: #2e7d32;
}

.recipe-card-link {
  padding: 6px 16px;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recipe-card-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  color: white;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .recipe-title {
    font-size: 36px;
  }

  .recipe-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .related-recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .recipe-hero-section {
    padding: 40px 15px;
  }

  .recipe-title {
    font-size: 28px;
  }

  .section-content {
    padding: 20px;
  }

  .recipe-info-grid {
    grid-template-columns: 1fr;
  }

  .ingredients-list {
    grid-template-columns: 1fr;
  }

  .related-recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recipe-card-image {
    height: 150px;
  }

  /* Slider responsive - tablet */
  .slider-nav-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .recipe-hero-section {
    padding: 30px 12px;
    margin-bottom: 24px;
  }

  .recipe-title {
    font-size: 22px;
    margin: 12px 0;
  }

  .recipe-badge {
    font-size: 10px;
  }

  .back-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .section-content {
    padding: 16px;
  }

  .section-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .recipe-section {
    margin-bottom: 24px;
  }

  .recipe-details-section {
    padding: 16px;
  }

  .recipe-details-text {
    font-size: 13px;
  }

  /* Slider responsive - mobile */
  .related-slider-container {
    gap: 8px;
  }

  .slider-nav-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .related-recipes-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .slider-indicators {
    margin-top: 16px;
    gap: 8px;
  }

  .slider-dot {
    width: 10px;
    height: 10px;
  }
}

.glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.75),
              inset -1px -1px 2px rgba(0, 0, 0, 0.05);
  z-index: 3;
}

.info-card-content {
  position: relative;
  z-index: 4;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.info-card-content i {
  font-size: 32px;
  color: #2e7d32;
  margin-bottom: 12px;
}

.info-card-content h4 {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card-content p {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

/* Recipe Details */
.recipe-details-section {
  padding: 24px;
  background: rgba(46, 125, 50, 0.05);
  border-radius: 20px;
  margin-bottom: 40px;
}

.recipe-details-text {
  font-size: 15px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.8;
}

/* Section Glass Cards */
.recipe-section {
  margin-bottom: 40px;
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-glass-card {
  --bg-color: rgba(255, 255, 255, 0.55);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.section-glass-card .glass-filter {
  backdrop-filter: blur(5px);
}

.section-content {
  position: relative;
  z-index: 4;
  padding: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title i {
  color: #2e7d32;
  font-size: 28px;
}

/* Ingredients */
.ingredients-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(46, 125, 50, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(46, 125, 50, 0.1);
  transition: all 0.2s ease;
}

.ingredient-item:hover {
  background: rgba(46, 125, 50, 0.08);
  border-color: rgba(46, 125, 50, 0.2);
}

.ingredient-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #2e7d32;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.ingredient-checkbox:checked {
  background-color: #2e7d32;
}

.ingredient-item label {
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  margin: 0;
}

.ingredient-item input:checked ~ label {
  text-decoration: line-through;
  color: #999;
}

/* Directions */
.directions-text {
  font-size: 15px;
  line-height: 1.8;
  color: #1a1a1a;
  margin: 0;
}

/* Notes */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 193, 7, 0.08);
  border-radius: 12px;
  border-left: 4px solid #ffc107;
}

.note-item i {
  color: #ffc107;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.note-item p {
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.6;
}

/* Chef's Tips */
.tips-text {
  font-size: 15px;
  line-height: 1.8;
  color: #1a1a1a;
  margin: 0;
}

/* Related Recipes - Second set removed, see main styles above */

.related-recipe-card {
  position: relative;
  height: 100%;
}

.recipe-card-glass {
  --bg-color: rgba(255, 255, 255, 0.55);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.recipe-card-glass:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.recipe-card-content {
  position: relative;
  z-index: 4;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.recipe-card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: rgba(46, 125, 50, 0.1);
}

.recipe-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card-glass:hover .recipe-card-image img {
  transform: scale(1.05);
}

.recipe-card-body {
  position: relative;
  z-index: 5;
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.recipe-type-badge {
  display: inline-block;
  background: rgba(46, 125, 50, 0.15);
  color: #2e7d32;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  width: fit-content;
}

.recipe-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card-desc {
  font-size: 13px;
  color: #4a4a4a;
  margin: 0 0 12px;
  flex: 1;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(46, 125, 50, 0.1);
}

.recipe-time {
  font-size: 12px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recipe-time i {
  color: #2e7d32;
}

.recipe-card-link {
  padding: 6px 16px;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recipe-card-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  color: white;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .recipe-title {
    font-size: 36px;
  }

  .recipe-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .related-recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .recipe-hero-section {
    padding: 40px 15px;
  }

  .recipe-title {
    font-size: 28px;
  }

  .section-content {
    padding: 20px;
  }

  .recipe-info-grid {
    grid-template-columns: 1fr;
  }

  .ingredients-list {
    grid-template-columns: 1fr;
  }

  .related-recipes-grid {
    grid-template-columns: 1fr;
  }

  .recipe-card-image {
    height: 150px;
  }
}

@media (max-width: 576px) {
  .recipe-hero-section {
    padding: 30px 12px;
    margin-bottom: 24px;
  }

  .recipe-title {
    font-size: 22px;
    margin: 12px 0;
  }

  .recipe-badge {
    font-size: 10px;
  }

  .back-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .section-content {
    padding: 16px;
  }

  .section-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .recipe-section {
    margin-bottom: 24px;
  }

  .recipe-details-section {
    padding: 16px;
  }

  .recipe-details-text {
    font-size: 13px;
  }
}
/* Ingredients Section Button */
.section-title-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.download-pdf-btn {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.download-pdf-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.3);
}

.download-pdf-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.add-to-list-btn {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
}

.add-to-list-btn:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d3817 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.3);
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.3);
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-notification i {
  font-size: 20px;
}

/* Reviews Container */
.reviews-container {
  max-width: 800px;
  margin: 60px auto 40px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-title {
    font-size: 2rem !important;
  }
  
  .reviews-container {
    margin: 40px auto 20px;
  }
  
  .recipe-hero-section {
    padding: 40px 0;
  }
  
  .hero-content {
    padding: 20px;
  }
  
  .recipe-image-container {
    margin-bottom: 30px;
  }
  
  .recipe-info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .info-card h4 {
    font-size: 0.9rem;
  }
  
  .info-card p {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }

  .section-title-with-button {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .download-pdf-btn,
  .add-to-list-btn {
    width: 100%;
    justify-content: center;
  }
  
  .back-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
  
  .recipe-content-section {
    padding: 30px 0;
  }
}

@media (max-width: 576px) {
  .recipe-title {
    font-size: 1.5rem !important;
  }
  
  .recipe-hero-section {
    padding: 30px 0;
  }
  
  .recipe-info-grid {
    grid-template-columns: 1fr;
  }
  
  .recipe-badge {
    font-size: 0.75rem;
    padding: 4px 12px;
  }
  
  .meta-author, .meta-date {
    font-size: 0.85rem;
  }

  .modal-content {
    width: 95%;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .recipe-title {
    font-size: 2.5rem !important;
  }
  
  .recipe-info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.review-count {
  font-size: 12px !important;
  font-weight: 500 !important;
  color: #666 !important;
}

/* Premium white detail page refresh */
.recipe-detail-page {
  background: #ffffff;
  color: #111827;
  padding-top: clamp(90px, 12vw, 120px);
  overflow-x: hidden;
  font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

.recipe-detail-page :where(button, a, input, textarea) {
  font-family: inherit;
}

.recipe-hero-section {
  background:
    radial-gradient(circle at top left, rgba(46, 125, 50, 0.11), transparent 34%),
    linear-gradient(180deg, #ffffff 0%, #f8faf8 100%);
  border-bottom: 1px solid #e5e7eb;
  padding: 38px 0 56px;
}

.recipe-hero-section .container,
.recipe-content-section .container {
  max-width: 1180px;
}

.back-btn {
  width: fit-content;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  margin: 0 0 28px;
  color: #14532d;
  background: #ffffff;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  box-shadow: 0 10px 25px rgba(17, 24, 39, 0.06);
}

.back-btn:hover {
  color: #ffffff;
  background: #166534;
  border-color: #166534;
  transform: translateY(-1px);
}

.hero-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: end;
  gap: 48px;
  text-align: left;
}

.recipe-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin: 0 0 18px;
  padding: 8px 14px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
}

.recipe-title {
  max-width: 820px;
  margin: 0;
  color: #0f172a;
  font-size: clamp(2.4rem, 5vw, 4.75rem);
  font-weight: 900;
  letter-spacing: -0.06em;
  line-height: 0.97;
}

.recipe-description {
  max-width: 720px;
  margin: 22px 0 0;
  color: #4b5563;
  font-size: 17px;
  line-height: 1.75;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 24px;
  color: #374151;
  font-size: 14px;
}

.meta-divider {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #16a34a;
}

.meta-author {
  color: #111827;
  font-weight: 800;
}

.hero-actions-card {
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
}

.hero-rating {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: end;
  column-gap: 10px;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid #e5e7eb;
}

.hero-rating-value {
  color: #14532d;
  font-size: 52px;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.9;
}

.hero-rating-label,
.hero-review-count {
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.hero-review-count {
  grid-column: 1 / -1;
  margin-top: 8px;
}

.hero-actions {
  display: grid;
  gap: 12px;
}

.primary-action-btn,
.secondary-action-btn {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 0 18px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 800;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.primary-action-btn {
  color: #ffffff;
  background: #166534;
  border: 1px solid #166534;
  box-shadow: 0 14px 30px rgba(22, 101, 52, 0.24);
}

.secondary-action-btn {
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.primary-action-btn:hover,
.secondary-action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.primary-action-btn:hover {
  background: #14532d;
  box-shadow: 0 18px 34px rgba(22, 101, 52, 0.3);
}

.secondary-action-btn:hover:not(:disabled) {
  border-color: #166534;
  color: #14532d;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.secondary-action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.recipe-content-section {
  padding: 54px 0 72px;
  background: #ffffff;
}

.recipe-overview-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
  gap: 28px;
  align-items: stretch;
  margin-bottom: 34px;
}

.recipe-image-container {
  max-width: none;
  margin: 0;
  border-radius: 32px;
}

.recipe-image-glass {
  height: 100%;
  min-height: 520px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 32px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.recipe-image-glass:hover {
  transform: none;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.15);
}

.image-glass-filter,
.image-glass-overlay,
.image-glass-specular,
.glass-filter,
.glass-overlay,
.glass-specular {
  display: none;
}

.recipe-image {
  width: 100%;
  height: 100%;
  min-height: 520px;
  object-fit: cover;
  border-radius: 32px;
}

.recipe-image-glass:hover .recipe-image {
  transform: scale(1.015);
}

.recipe-image-fallback {
  min-height: 520px;
  display: grid;
  place-items: center;
  color: #166534;
  font-size: 64px;
}

.recipe-summary-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 32px;
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-header strong {
  color: #14532d;
  background: #dcfce7;
  border-radius: 999px;
  padding: 8px 12px;
  letter-spacing: 0;
  text-transform: none;
}

.recipe-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
}

.info-card {
  height: auto;
}

.info-card-glass {
  display: contents;
}

.info-card-content {
  min-height: 142px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px;
  text-align: left;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.info-card-content i {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin: 0 0 16px;
  color: #166534;
  background: #dcfce7;
  border-radius: 14px;
  font-size: 18px;
}

.info-card-content h4 {
  margin: auto 0 6px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.info-card-content p {
  color: #111827;
  font-size: 21px;
  font-weight: 900;
  line-height: 1.1;
}

.recipe-details-section {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  background: transparent;
  border-radius: 0;
}

.detail-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 48px;
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.detail-pill span {
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.detail-pill strong {
  color: #111827;
  font-size: 14px;
  font-weight: 900;
  text-align: right;
}

.recipe-section {
  margin-bottom: 28px;
}

.section-glass-card,
.recipe-card-glass {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.section-content {
  padding: 30px;
}

.section-title-with-button {
  align-items: center;
  margin-bottom: 22px;
}

.section-title,
.section-title-main {
  color: #111827;
  letter-spacing: -0.03em;
}

.section-title i,
.section-title-main i {
  color: #166534;
}

.section-count {
  padding: 8px 12px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.ingredients-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ingredient-item {
  min-height: 54px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.ingredient-item:hover {
  background: #f0fdf4;
  border-color: #86efac;
}

.ingredient-checkbox {
  accent-color: #166534;
}

.ingredient-item label,
.directions-text,
.tips-text,
.note-item p,
.recipe-card-desc {
  color: #374151;
}

.directions-list {
  display: grid;
  gap: 14px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.directions-list li {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 16px;
  padding: 18px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
}

.step-number {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: #ffffff;
  background: #166534;
  border-radius: 14px;
  font-weight: 900;
}

.directions-list p {
  margin: 0;
  color: #1f2937;
  font-size: 15px;
  line-height: 1.75;
}

.note-item {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-left: 5px solid #f59e0b;
  border-radius: 16px;
}

.related-slider-container {
  gap: 18px;
}

.slider-nav-btn {
  width: 46px;
  height: 46px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #14532d;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.slider-nav-btn:hover:not(:disabled) {
  background: #166534;
  border-color: #166534;
  box-shadow: 0 14px 28px rgba(22, 101, 52, 0.22);
}

.recipe-card-glass:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.12);
}

.recipe-card-image {
  background: #f3f4f6;
}

.recipe-type-badge {
  color: #14532d;
  background: #dcfce7;
}

.recipe-card-title {
  color: #111827;
}

.recipe-card-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 16px;
  background: #166534;
  border-radius: 999px;
}

.reviews-container {
  max-width: 960px;
  margin: 58px auto 0;
}

.toast-notification {
  background: #166534;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 18px 40px rgba(22, 101, 52, 0.28);
}

@media (max-width: 1024px) {
  .hero-content,
  .recipe-overview-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions-card {
    max-width: 520px;
  }

  .recipe-image,
  .recipe-image-glass,
  .recipe-image-fallback {
    min-height: 420px;
  }
}

@media (max-width: 768px) {
  .recipe-hero-section {
    padding: 26px 0 42px;
  }

  .hero-content {
    gap: 28px;
  }

  .recipe-title {
    font-size: clamp(2rem, 11vw, 3.2rem) !important;
  }

  .recipe-description {
    font-size: 15px;
  }

  .hero-actions-card,
  .recipe-summary-panel,
  .section-content {
    padding: 20px;
    border-radius: 24px;
  }

  .recipe-info-grid,
  .ingredients-list {
    grid-template-columns: 1fr;
  }

  .recipe-image,
  .recipe-image-glass,
  .recipe-image-fallback {
    min-height: 340px;
    border-radius: 24px;
  }

  .directions-list li {
    grid-template-columns: 1fr;
  }

  .related-slider-container {
    gap: 10px;
  }
}

@media (max-width: 576px) {
  .recipe-detail-page {
    padding-top: clamp(80px, 22vw, 100px);
  }

  .recipe-meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .meta-divider {
    display: none;
  }

  .hero-actions-card,
  .recipe-summary-panel,
  .section-glass-card,
  .recipe-card-glass {
    border-radius: 20px;
  }

  .recipe-content-section {
    padding: 34px 0 48px;
  }

  .slider-nav-btn {
    width: 38px;
    height: 38px;
  }
}
</style>

<!-- Global styles for teleported toast -->
<style>
.toast-notification {
  position: fixed !important;
  bottom: 30px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%) !important;
  color: white !important;
  padding: 16px 24px !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4) !important;
  z-index: 999999 !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  animation: toastSlideUp 0.3s ease-out !important;
}

@keyframes toastSlideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-notification i {
  font-size: 20px !important;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>