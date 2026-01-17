<!-- RecipeItem.vue -->
<template>
  <div class="col-lg-4 col-md-6 col-12" data-aos="zoom-in">
    <router-link :to="{ name: 'RecipeDetail', params: { id: recipe.id } }" class="no-link-decoration">
      <div class="recipe-card-wrapper">
        <!-- Glass Background Layers -->
        <svg style="display: none">
          <filter id="glass-distortion-card-item">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="9" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
          </filter>
        </svg>

        <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 recipe-card">
          <!-- Glass Effect Layers (only for the content area) -->
          <div class="glass-filter-layer"></div>
          <div class="glass-overlay-layer"></div>
          <div class="glass-specular-layer"></div>

          <!-- Content Container -->
          <div class="card-content-wrapper">
            <img :src="recipe.image" class="card-img-top" :alt="recipe.title">
            <div class="card-body text-center px-4 pt-4">
              <a href="#" class="badge text-bg-success rounded-pill px-3 py-2 text-decoration-none">{{ recipe.category }}</a>
              <h5 class="card-title truncate-text fw-bold pt-3">{{ recipe.title }}</h5>
              <p class="card-text text-muted truncate-text">{{ recipe.description }}</p>
              <div class="rating">
                <span v-for="star in fullStars" :key="star" class="fa fa-star checked"></span>
                <span v-if="hasHalfStar" class="fa fa-star-half-alt checked"></span>
                <span v-for="star in emptyStars" :key="star" class="fa fa-star"></span>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0 px-4 pb-4">
              <small class="d-flex align-items-center gap-2">
                <a href="#"><img :src="authorImageSrc" alt="post-profile" class="img-fluid rounded-circle post-profile"></a>
                <a class="text-decoration-none text-dark" href="#">{{ recipe.author }}</a>
                <span>/</span> {{ recipe.date }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  computed: {
    fullStars() {
      return Math.floor(this.recipe.rating);
    },
    hasHalfStar() {
      return this.recipe.rating % 1 >= 0.1 && this.recipe.rating % 1 < 0.7;
    },
    emptyStars() {
      return 5 - Math.ceil(this.recipe.rating);
    },
    authorImageSrc() {
      // Use recipe image as fallback for author image from API
      return this.recipe.authorImage || this.recipe.image || require('@/assets/img/person.png');
    },
  },
};
</script>

<style scoped>
/* Remove link decorations for router-link */
.no-link-decoration {
  text-decoration: none;
  color: inherit;
}

.no-link-decoration:hover {
  color: #2e7d32;
}

/* Recipe Card Wrapper */
.recipe-card-wrapper {
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recipe-card-wrapper:hover {
  transform: translateY(-12px);
}

/* Glass Layers for Card Content Area */
.recipe-card {
  --bg-color: rgba(255, 255, 255, 0.5);
  --highlight: rgba(255, 255, 255, 0.85);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

.recipe-card-wrapper:hover .recipe-card {
  box-shadow: 0 16px 48px rgba(46, 125, 50, 0.18),
              inset 0 1px 2px rgba(255, 255, 255, 0.7),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

/* Glass Filter Layers - Only apply to card body area */
.glass-filter-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-card-item) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
  pointer-events: none;
}

.glass-overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
  pointer-events: none;
}

.glass-specular-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 2px 2px 4px var(--highlight),
              inset -1px -1px 2px rgba(0, 0, 0, 0.08);
  z-index: 3;
  pointer-events: none;
}

/* Card Content Wrapper */
.card-content-wrapper {
  position: relative;
  z-index: 4;
  height: 100%;
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-card-wrapper:hover .card-img-top {
  transform: scale(1.05);
}

.card-body {
  padding: 16px 16px;
  background: transparent;
}

.badge {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%) !important;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.badge:hover {
  transform: scale(1.05);
}

.card-title {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.card-text {
  font-size: 0.85rem;
  color: #4a4a4a;
  margin-bottom: 12px;
  line-height: 1.4;
}

.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.3);
}

.post-profile {
  width: 28px;
  height: 28px;
  border: 1.5px solid rgba(46, 125, 50, 0.3);
  transition: all 0.3s ease;
}

.post-profile:hover {
  border-color: #2e7d32;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
}

.card-footer small {
  color: #4a4a4a;
  font-weight: 500;
}

.card-footer a {
  color: #1a1a1a;
  text-decoration: none;
  transition: color 0.3s ease;
}

.card-footer a:hover {
  color: #2e7d32;
}

/* Styles for the rating stars */
.rating {
  color: #ffd700;
  margin: 12px 0;
}

.fa-star,
.fa-star-half-alt {
  font-size: 16px;
  margin-right: 4px;
}

.checked {
  color: #ffdf00;
}

@media (max-width: 768px) {
  .card-title {
    font-size: 1rem;
  }

  .card-text {
    font-size: 0.8rem;
  }

  .recipe-card {
    border-radius: 20px;
  }

  .card-img-top {
    height: 180px;
  }
}
</style>
