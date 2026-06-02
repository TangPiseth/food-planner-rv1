<template>
  <article class="recipe-card h-100 w-100">
    <router-link :to="{ name: 'RecipeDetail', params: { id: recipe.id } }" class="recipe-card-link">
      <div class="recipe-image-wrap">
        <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" class="recipe-image" loading="lazy" />
        <div v-else class="recipe-image-fallback">
          <i class="fa-solid fa-utensils"></i>
        </div>
        <span class="category-badge">{{ recipe.category || recipe.type || 'Recipe' }}</span>
      </div>

      <div class="recipe-card-body">
        <div class="recipe-card-meta">
          <span><i class="fa-solid fa-location-dot"></i>{{ recipe.cuisine || 'Global' }}</span>
          <span><i class="fa-solid fa-clock"></i>{{ totalTime }} min</span>
        </div>

        <h3 class="text-wrap">{{ recipe.title }}</h3>
        <p>{{ recipe.description || 'A delicious recipe ready for your kitchen.' }}</p>

        <div class="recipe-card-stats">
          <div class="rating-pill">
            <i class="fa-solid fa-star"></i>
            <span>{{ displayRating }}</span>
          </div>
          <div class="difficulty-pill">{{ recipe.difficulty || 'Easy' }}</div>
        </div>
      </div>

      <div class="recipe-card-footer">
        <div>
          <span class="author-label">By</span>
          <strong>{{ recipe.author || 'TheMealDB' }}</strong>
        </div>
        <span class="view-recipe-btn">
          View
          <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    </router-link>
  </article>
</template>

<script>
export default {
  name: 'RecipeItem',
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  computed: {
    totalTime() {
      return (this.recipe.prepTime || 0) + (this.recipe.cookingTime || 0);
    },
    displayRating() {
      const rating = Number(this.recipe.rating || 0);
      return rating.toFixed(1);
    }
  }
};
</script>

<style scoped>
.recipe-card {
  height: 100%;
}

.recipe-card-link {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
  transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease;
}

.recipe-card-link:hover {
  color: inherit;
  border-color: #bbf7d0;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.14);
  transform: translateY(-8px);
}

.recipe-image-wrap {
  position: relative;
  height: 230px;
  overflow: hidden;
  background: #f3f4f6;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.recipe-card-link:hover .recipe-image {
  transform: scale(1.06);
}

.recipe-image-fallback {
  height: 100%;
  display: grid;
  place-items: center;
  color: #166534;
  font-size: 42px;
}

.category-badge {
  position: absolute;
  left: 16px;
  top: 16px;
  max-width: calc(100% - 32px);
  padding: 8px 12px;
  color: #14532d;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(187, 247, 208, 0.9);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.14);
}

.recipe-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 16px;
}

.recipe-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.recipe-card-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
}

.recipe-card-meta i {
  color: #166534;
}

.recipe-card-body h3 {
  min-height: 58px;
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.22;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card-body p {
  flex: 1;
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
}

.rating-pill,
.difficulty-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.rating-pill {
  gap: 6px;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.rating-pill i {
  color: #f59e0b;
}

.difficulty-pill {
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.recipe-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 20px 20px;
  border-top: 1px solid #f3f4f6;
}

.recipe-card-footer > div {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.author-label {
  color: #9ca3af;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.recipe-card-footer strong {
  color: #111827;
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-recipe-btn {
  flex-shrink: 0;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  color: #ffffff;
  background: #166534;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  transition: background 0.2s ease, transform 0.2s ease;
}

.recipe-card-link:hover .view-recipe-btn {
  background: #14532d;
  transform: translateX(2px);
}

@media (max-width: 768px) {
  .recipe-image-wrap {
    height: 210px;
  }

  .recipe-card-body h3 {
    min-height: auto;
    font-size: 19px;
  }
}
</style>
