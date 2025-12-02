<template>
  <div class="recipe-detail-page" data-aos="fade-up">
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

    <!-- Hero Section -->
    <div class="recipe-hero-section" v-if="recipe">
      <div class="hero-gradient-bg"></div>
      <div class="container">
        <button @click="goBack" class="back-btn">
          <i class="fa-solid fa-chevron-left"></i> Back
        </button>
        <div class="hero-content">
          <span class="recipe-badge">{{ recipe.type }}</span>
          <h1 class="recipe-title">{{ recipe.title }}</h1>
          <div class="recipe-meta">
            <span class="meta-author">by {{ recipe.author }}</span>
            <span class="meta-divider">•</span>
            <span class="meta-date">{{ recipe.date }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="recipe" class="recipe-content-section">
      <div class="container">
        <!-- Recipe Image with Glass Effect -->
        <div class="recipe-image-container" data-aos="zoom-out">
          <div class="recipe-image-glass">
            <div class="image-glass-filter"></div>
            <div class="image-glass-overlay"></div>
            <div class="image-glass-specular"></div>
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
          </div>
        </div>

        <!-- Quick Info Cards -->
        <div class="recipe-info-grid">
          <div class="info-card" data-aos="fade-up">
            <div class="info-card-glass">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="info-card-content">
                <i class="fa-solid fa-star"></i>
                <h4>Rating</h4>
                <p>{{ recipe.rating }}/5</p>
              </div>
            </div>
          </div>

          <div class="info-card" data-aos="fade-up">
            <div class="info-card-glass">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="info-card-content">
                <i class="fa-solid fa-users"></i>
                <h4>Servings</h4>
                <p>{{ recipe.servings || "N/A" }}</p>
              </div>
            </div>
          </div>

          <div class="info-card" data-aos="fade-up">
            <div class="info-card-glass">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="info-card-content">
                <i class="fa-solid fa-clock"></i>
                <h4>Total Time</h4>
                <p>{{ (recipe.prepTime || 0) + (recipe.cookingTime || 0) }} min</p>
              </div>
            </div>
          </div>

          <div class="info-card" data-aos="fade-up">
            <div class="info-card-glass">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="info-card-content">
                <i class="fa-solid fa-fire"></i>
                <h4>Calories</h4>
                <p>{{ recipe.calories || "N/A" }} kcal</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recipe Details -->
        <div class="recipe-details-section">
          <p class="recipe-details-text">
            <strong>Course:</strong> {{ recipe.course }} <strong class="ms-4">Cuisine:</strong> {{ recipe.cuisine }} <strong class="ms-4">Difficulty:</strong> {{ recipe.difficulty }}
          </p>
        </div>

        <!-- Ingredients Section -->
        <div class="recipe-section ingredients-section" data-aos="fade-up">
          <div class="section-glass-card">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="section-content">
              <h3 class="section-title">
                <i class="fa-solid fa-leaf"></i> Ingredients
              </h3>
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
              <p class="directions-text">{{ recipe.instructions }}</p>
            </div>
          </div>
        </div>
        <!-- Notes Section -->
        <div v-if="recipe.notes" class="recipe-section notes-section" data-aos="fade-up">
          <div class="section-glass-card">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="section-content">
              <h3 class="section-title">
                <i class="fa-solid fa-info"></i> Notes
              </h3>
              <div class="notes-list">
                <div class="note-item" v-for="(note, index) in recipe.notes" :key="index">
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
        <div class="recipe-section related-section" data-aos="fade-up">
          <h3 class="section-title-main">
            <i class="fa-solid fa-sparkles"></i> You Might Also Like
          </h3>
          <div class="related-recipes-grid">
            <div class="related-recipe-card" v-for="relatedRecipe in suggestedRecipes" :key="relatedRecipe.id">
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

        <!-- Review Components -->
        <RecipeReviewForm />
        <RecipeReviews :recipeId="recipe.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchRecipe } from "@/services/recipeService";
import RecipeReviewForm from '@/components/RecipeReviewForm.vue';
import RecipeReviews from '@/components/RecipeReviews.vue'

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
    };
  },

  watch: {
    // Add this watcher
    id: {
      immediate: true,
      handler: async function(newId) {
        // Reset the current recipe
        this.recipe = null;
        
        // Fetch new recipe
        this.recipe = await fetchRecipe(newId);

        // Get suggested recipes
        const allRecipes = await Promise.all(
          Array.from({ length: 20 }, (_, i) => fetchRecipe((i + 1).toString()))
        );

        // Filter out current recipe and get suggestions
        this.suggestedRecipes = allRecipes
          .filter(r => r.id !== newId) // Remove current recipe
          .filter(r =>
            r.type === this.recipe.type || // Same type
            r.course === this.recipe.course // Or same course
          )
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, 4); // Get first 4

        // If we don't have enough suggestions, add random recipes
        if (this.suggestedRecipes.length < 4) {
          const remainingRecipes = allRecipes
            .filter(r => r.id !== newId)
            .filter(r => !this.suggestedRecipes.find(sr => sr.id === r.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 4 - this.suggestedRecipes.length);

          this.suggestedRecipes = [...this.suggestedRecipes, ...remainingRecipes];
        }
      }
    }
  },

  // Remove the mounted hook since we're using the watcher now
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
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
  margin-bottom: 48px;
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

.related-recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

.related-recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
</style>