<template>
  <section class="recipe-search-experience">
    <form class="recipe-filter-panel" @submit.prevent="runSearch">
      <div class="filter-panel-header">
        <div>
          <span class="eyebrow">Smart recipe search</span>
          <h2>Find the right meal faster</h2>
          <p>Search by name, then refine with TheMealDB category, cuisine, and ingredient filters.</p>
        </div>
        <button type="button" class="filter-toggle-btn" @click="showAdvanced = !showAdvanced">
          <i class="fa-solid fa-sliders"></i>
          <span>{{ showAdvanced ? 'Hide Filters' : 'Advanced Filters' }}</span>
        </button>
      </div>

      <div class="search-row">
        <label class="search-field">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            v-model.trim="filters.query"
            type="search"
            placeholder="Search recipes, meals, or keywords..."
            @input="debouncedSearch"
          />
        </label>

        <label class="sort-field">
          <span>Sort</span>
          <select v-model="sortOption">
            <option value="relevance">Relevance</option>
            <option value="rating">Highest Rating</option>
            <option value="popular">Most Popular</option>
            <option value="time">Fastest</option>
            <option value="az">A-Z</option>
          </select>
        </label>

        <button type="submit" class="search-submit-btn" :disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          <i v-show="!loading" class="fa-solid fa-arrow-right"></i>
          <span>{{ loading ? 'Searching' : 'Search' }}</span>
        </button>
      </div>

      <div v-show="showAdvanced" class="advanced-filter-menu">
        <label class="filter-field">
          <span>Category</span>
          <select v-model="filters.category" @change="runSearch">
            <option value="">Any category</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </label>

        <label class="filter-field">
          <span>Cuisine</span>
          <select v-model="filters.area" @change="runSearch">
            <option value="">Any cuisine</option>
            <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
          </select>
        </label>

        <label class="filter-field">
          <span>Main ingredient</span>
          <input
            v-model.trim="filters.ingredient"
            list="ingredient-options"
            type="text"
            placeholder="Chicken, salmon, rice..."
            @input="debouncedSearch"
          />
          <datalist id="ingredient-options">
            <option v-for="ingredient in ingredients" :key="ingredient" :value="ingredient"></option>
          </datalist>
        </label>

        <div class="filter-actions">
          <button type="button" class="clear-filter-btn" @click="resetFilters" :disabled="loading || !hasActiveFilters">
            Clear All
          </button>
          <button type="button" class="apply-filter-btn" @click="runSearch" :disabled="loading">
            Apply Filters
          </button>
        </div>
      </div>

      <div v-show="hasActiveFilters" class="active-filter-row">
        <button v-show="filters.query" type="button" class="filter-chip" @click="clearFilter('query')">
          Search: {{ filters.query }} <i class="fa-solid fa-xmark"></i>
        </button>
        <button v-show="filters.category" type="button" class="filter-chip" @click="clearFilter('category')">
          Category: {{ filters.category }} <i class="fa-solid fa-xmark"></i>
        </button>
        <button v-show="filters.area" type="button" class="filter-chip" @click="clearFilter('area')">
          Cuisine: {{ filters.area }} <i class="fa-solid fa-xmark"></i>
        </button>
        <button v-show="filters.ingredient" type="button" class="filter-chip" @click="clearFilter('ingredient')">
          Ingredient: {{ filters.ingredient }} <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </form>

    <div class="results-toolbar">
      <div>
        <span class="results-label">Results</span>
        <!-- <strong>{{ sortedRecipes.length }}</strong>
        <span>recipes found</span> -->
      </div>
      <p>Hungry? Filter food, find your feast.</p>
    </div>

    <div v-show="loading" class="state-card">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Finding premium recipe matches...</p>
    </div>

    <div v-show="!loading && sortedRecipes.length === 0" class="state-card">
      <i class="fa-solid fa-utensils"></i>
      <h3>No recipes found</h3>
      <p>Try fewer filters or a broader ingredient.</p>
    </div>

    <div v-show="!loading && sortedRecipes.length > 0" class="row g-3 g-md-4">
      <div
        v-for="recipe in paginatedRecipes"
        :key="recipe.id"
        class="col-12 col-sm-6 col-lg-4 col-xxl-3 d-flex"
      >
        <RecipeItem :recipe="recipe" />
      </div>
    </div>

    <nav v-show="!loading && totalPages > 1" aria-label="Recipe pagination" class="pagination-shell">
      <button class="page-nav-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-number-btn"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button class="page-nav-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </nav>
  </section>
</template>

<script>
import RecipeItem from './RecipeItem.vue';
import {
  advancedSearchRecipes,
  getAreas,
  getCategories,
  getIngredients,
  getMultipleRandomMeals
} from '@/services/recipeService';

export default {
  name: 'RecipeList',
  components: {
    RecipeItem,
  },
  data() {
    return {
      filters: {
        query: '',
        category: '',
        area: '',
        ingredient: ''
      },
      sortOption: 'relevance',
      showAdvanced: true,
      categories: [],
      areas: [],
      ingredients: [],
      currentPage: 1,
      perPage: 12,
      recipes: [],
      loading: false,
      searchTimeout: null
    };
  },
  computed: {
    hasActiveFilters() {
      return Object.values(this.filters).some((value) => value && value.trim());
    },
    sortedRecipes() {
      const sorted = [...this.recipes];

      if (this.sortOption === 'rating') {
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      if (this.sortOption === 'popular') {
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }
      if (this.sortOption === 'time') {
        return sorted.sort((a, b) => this.recipeTime(a) - this.recipeTime(b));
      }
      if (this.sortOption === 'az') {
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      }

      return sorted;
    },
    paginatedRecipes() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.sortedRecipes.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.sortedRecipes.length / this.perPage));
    },
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + 4);

      for (let page = start; page <= end; page += 1) {
        pages.push(page);
      }

      return pages;
    }
  },
  watch: {
    '$route.query': {
      async handler() {
        this.applyRouteFilters();

        if (this.hasActiveFilters) {
          await this.runSearch();
        } else {
          await this.fetchDefaultRecipes();
        }
      }
    }
  },
  methods: {
    normalizeQueryValue(value) {
      return Array.isArray(value) ? value[0] || '' : value || '';
    },
    applyRouteFilters() {
      const routeQuery = this.$route.query || {};

      this.filters = {
        query: this.normalizeQueryValue(routeQuery.query),
        category: this.normalizeQueryValue(routeQuery.category),
        area: this.normalizeQueryValue(routeQuery.area),
        ingredient: this.normalizeQueryValue(routeQuery.ingredient)
      };

      if (this.filters.category || this.filters.area || this.filters.ingredient) {
        this.showAdvanced = true;
      }

      this.currentPage = 1;
    },
    recipeTime(recipe) {
      return (recipe.prepTime || 0) + (recipe.cookingTime || 0);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 360, behavior: 'smooth' });
      }
    },
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.runSearch();
      }, 450);
    },
    async runSearch() {
      this.loading = true;
      this.currentPage = 1;

      try {
        this.recipes = await advancedSearchRecipes(this.filters, 84);
      } catch (error) {
        console.error('Error searching recipes:', error);
        this.recipes = [];
      } finally {
        this.loading = false;
      }
    },
    async resetFilters() {
      this.filters = {
        query: '',
        category: '',
        area: '',
        ingredient: ''
      };
      this.sortOption = 'relevance';
      this.currentPage = 1;
      await this.fetchDefaultRecipes();
    },
    async clearFilter(key) {
      this.filters[key] = '';
      await this.runSearch();
    },
    async fetchDefaultRecipes() {
      this.loading = true;

      try {
        this.recipes = await getMultipleRandomMeals(84);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        this.recipes = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchFilterOptions() {
      try {
        const [categories, areas, ingredients] = await Promise.all([
          getCategories(),
          getAreas(),
          getIngredients()
        ]);

        this.categories = categories.map((category) => category.strCategory || category).filter(Boolean);
        this.areas = areas;
        this.ingredients = ingredients.slice(0, 220);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    }
  },
  async mounted() {
    this.applyRouteFilters();

    await Promise.all([
      this.hasActiveFilters ? this.runSearch() : this.fetchDefaultRecipes(),
      this.fetchFilterOptions()
    ]);
  },
  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
};
</script>

<style scoped>
.recipe-search-experience {
  display: grid;
  gap: 28px;
}

.recipe-filter-panel {
  padding: 28px;
  color: #111827;
  background:
    radial-gradient(circle at top right, rgba(22, 101, 52, 0.1), transparent 30%),
    #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 32px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
}

.filter-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5e7eb;
}

.eyebrow,
.results-label {
  display: inline-flex;
  margin-bottom: 8px;
  color: #14532d;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.filter-panel-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -0.06em;
}

.filter-panel-header p {
  max-width: 680px;
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.7;
}

.filter-toggle-btn,
.search-submit-btn,
.apply-filter-btn,
.clear-filter-btn,
.filter-chip,
.page-nav-btn,
.page-number-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 16px;
  font-weight: 900;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.filter-toggle-btn {
  min-height: 46px;
  flex-shrink: 0;
  padding: 0 16px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.search-row {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 190px 150px;
  gap: 14px;
  align-items: stretch;
}

.search-field,
.sort-field,
.filter-field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 0 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.search-field:focus-within,
.sort-field:focus-within,
.filter-field:focus-within {
  background: #ffffff;
  border-color: #166534;
  box-shadow: 0 0 0 4px rgba(22, 101, 52, 0.1);
}

.search-field i {
  color: #166534;
}

.search-field input,
.sort-field select,
.filter-field input,
.filter-field select {
  width: 100%;
  color: #111827;
  background: transparent;
  border: 0;
  outline: none;
  font-size: 14px;
  font-weight: 700;
}

.sort-field,
.filter-field {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3px;
}

.sort-field span,
.filter-field span {
  color: #6b7280;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.search-submit-btn,
.apply-filter-btn {
  min-height: 56px;
  padding: 0 18px;
  color: #ffffff;
  background: #166534;
  border: 1px solid #166534;
  box-shadow: 0 14px 28px rgba(22, 101, 52, 0.22);
}

.clear-filter-btn {
  min-height: 56px;
  padding: 0 18px;
  color: #374151;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.filter-toggle-btn:hover,
.search-submit-btn:hover:not(:disabled),
.apply-filter-btn:hover:not(:disabled),
.clear-filter-btn:hover:not(:disabled),
.filter-chip:hover,
.page-nav-btn:hover:not(:disabled),
.page-number-btn:hover {
  transform: translateY(-2px);
}

.search-submit-btn:hover:not(:disabled),
.apply-filter-btn:hover:not(:disabled) {
  background: #14532d;
  box-shadow: 0 18px 34px rgba(22, 101, 52, 0.28);
}

.search-submit-btn:disabled,
.apply-filter-btn:disabled,
.clear-filter-btn:disabled {
  opacity: 0.62;
  cursor: not-allowed;
}

.advanced-filter-menu {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 14px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.filter-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.active-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.filter-chip {
  min-height: 36px;
  padding: 0 12px;
  color: #14532d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  font-size: 12px;
}

.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
}

.results-toolbar div {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.results-toolbar strong {
  color: #0f172a;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.results-toolbar span:not(.results-label),
.results-toolbar p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
}

.state-card {
  min-height: 280px;
  display: grid;
  place-items: center;
  padding: 40px 20px;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #d1d5db;
  border-radius: 28px;
}

.state-card i {
  color: #166534;
  font-size: 42px;
}

.state-card h3 {
  margin: 12px 0 4px;
  color: #111827;
  font-weight: 900;
}

.state-card p {
  margin: 12px 0 0;
  color: #6b7280;
  font-weight: 700;
}

.pagination-shell {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.page-nav-btn,
.page-number-btn {
  width: 42px;
  height: 42px;
  color: #14532d;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.page-number-btn.active {
  color: #ffffff;
  background: #166534;
  border-color: #166534;
}

.page-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.filter-menu-enter-active,
.filter-menu-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.filter-menu-enter-from,
.filter-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1100px) {
  .search-row,
  .advanced-filter-menu {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .recipe-filter-panel {
    padding: 20px;
    border-radius: 24px;
  }

  .filter-panel-header,
  .results-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-row,
  .advanced-filter-menu {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 520px) {
  .filter-actions {
    grid-template-columns: 1fr;
  }
}
</style>
