<template>
    <div>
        <svg style="display: none">
          <filter id="glass-distortion-recipe-controls">
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="7" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
          </filter>
        </svg>

        <!-- Search and Sort Controls -->
        <div class="recipe-controls mb-5">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div class="recipe-search-wrapper">
              <input 
                type="text" 
                v-model="searchQuery" 
                class="recipe-search-input" 
                placeholder="Search for recipes..."
              >
              <div class="search-glass-filter"></div>
              <div class="search-glass-overlay"></div>
              <div class="search-glass-specular"></div>
            </div>
            <div class="d-flex gap-3 flex-wrap">
              <div class="recipe-sort-wrapper">
                <select v-model="selectedCategory" class="recipe-sort-select" @change="handleCategoryChange">
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category.strCategory" :value="category.strCategory">
                    {{ category.strCategory }}
                  </option>
                </select>
                <div class="sort-glass-filter"></div>
                <div class="sort-glass-overlay"></div>
                <div class="sort-glass-specular"></div>
              </div>
              <div class="recipe-sort-wrapper">
                <select v-model="sortOption" class="recipe-sort-select">
                  <option value="latest">Sort by Latest</option>
                  <option value="popular">Sort by Popular</option>
                  <option value="rating">Sort by Rating</option>
                </select>
                <div class="sort-glass-filter"></div>
                <div class="sort-glass-overlay"></div>
                <div class="sort-glass-specular"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recipe Cards Grid -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading delicious recipes...</p>
        </div>
        
        <div v-else-if="recipes.length === 0" class="text-center py-5">
            <i class="fa-solid fa-utensils fa-3x text-muted mb-3"></i>
            <p class="text-muted">No recipes found. Try a different search term.</p>
        </div>
        
        <div v-else class="row g-4">
            <RecipeItem v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" />
        </div>

        <!-- Pagination -->
        <nav aria-label="Page navigation" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">&laquo;</a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">&raquo;</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import RecipeItem from './RecipeItem.vue';
import { getMultipleRandomMeals, searchMeals, getCategories, filterByCategory } from '@/services/recipeService';

export default {
    components: {
        RecipeItem,
    },
    data() {
        return {
            searchQuery: '',
            sortOption: 'latest',
            selectedCategory: '',
            categories: [],
            currentPage: 1,
            recipes: [],
            loading: false,
            searchTimeout: null
        };
    },
    computed: {
        filteredRecipes() {
            let filtered = [...this.recipes];
            
            if (this.sortOption === 'latest') {
                // Keep original order (already random/latest from API)
            } else if (this.sortOption === 'popular') {
                filtered = filtered.sort((a, b) => b.popularity - a.popularity);
            } else if (this.sortOption === 'rating') {
                filtered = filtered.sort((a, b) => b.rating - a.rating);
            }

            const start = (this.currentPage - 1) * 9;
            const end = start + 9;
            return filtered.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.recipes.length / 9) || 1;
        }
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        async fetchRecipes() {
            this.loading = true;
            try {
                this.recipes = await getMultipleRandomMeals(72);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                this.loading = false;
            }
        },
        async handleSearch() {
            // Debounce search
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            this.searchTimeout = setTimeout(async () => {
                this.loading = true;
                this.currentPage = 1;
                this.selectedCategory = ''; // Reset category when searching
                try {
                    if (this.searchQuery.trim()) {
                        this.recipes = await searchMeals(this.searchQuery);
                    } else {
                        this.recipes = await getMultipleRandomMeals(72);
                    }
                } catch (error) {
                    console.error('Error searching recipes:', error);
                } finally {
                    this.loading = false;
                }
            }, 500);
        },
        async handleCategoryChange() {
            this.loading = true;
            this.currentPage = 1;
            this.searchQuery = ''; // Reset search when filtering by category
            try {
                if (this.selectedCategory) {
                    this.recipes = await filterByCategory(this.selectedCategory);
                } else {
                    this.recipes = await getMultipleRandomMeals(72);
                }
            } catch (error) {
                console.error('Error filtering by category:', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchCategories() {
            try {
                this.categories = await getCategories();
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
    },
    watch: {
        searchQuery() {
            this.handleSearch();
        }
    },
    async mounted() {
        AOS.init();
        await Promise.all([
            this.fetchRecipes(),
            this.fetchCategories()
        ]);
    }
};
</script>

<style scoped>
/* Recipe Controls */
.recipe-controls {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recipe-search-wrapper,
.recipe-sort-wrapper {
  position: relative;
}

.recipe-search-wrapper {
  flex: 1;
  min-width: 240px;
  max-width: 400px;
}

/* Glass Search Input */
.recipe-search-input {
  --bg-color: rgba(255, 255, 255, 0.5);
  --highlight: rgba(255, 255, 255, 0.85);
  position: relative;
  z-index: 4;
  width: 100%;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  padding: 0 20px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: transparent;
  outline: none;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

.recipe-search-input::placeholder {
  color: #4a4a4a;
}

.recipe-search-input:focus {
  outline: none;
  --bg-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 12px 40px rgba(46, 125, 50, 0.15),
              inset 0 1px 2px rgba(255, 255, 255, 0.7),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

.search-glass-filter,
.search-glass-overlay,
.search-glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  pointer-events: none;
}

.search-glass-filter {
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-recipe-controls) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.search-glass-overlay {
  background: var(--bg-color);
  z-index: 2;
}

.search-glass-specular {
  box-shadow: inset 2px 2px 4px var(--highlight),
              inset -1px -1px 2px rgba(0, 0, 0, 0.08);
  z-index: 3;
}

/* Glass Sort Select */
.recipe-sort-wrapper {
  min-width: 180px;
}

.recipe-sort-select {
  --bg-color: rgba(255, 255, 255, 0.5);
  --highlight: rgba(255, 255, 255, 0.85);
  position: relative;
  z-index: 4;
  width: 100%;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  padding: 0 20px;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: transparent;
  outline: none;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1a1a' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.recipe-sort-select:focus {
  outline: none;
  --bg-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 12px 40px rgba(46, 125, 50, 0.15),
              inset 0 1px 2px rgba(255, 255, 255, 0.7),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

.sort-glass-filter,
.sort-glass-overlay,
.sort-glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  pointer-events: none;
}

.sort-glass-filter {
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-recipe-controls) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.sort-glass-overlay {
  background: var(--bg-color);
  z-index: 2;
}

.sort-glass-specular {
  box-shadow: inset 2px 2px 4px var(--highlight),
              inset -1px -1px 2px rgba(0, 0, 0, 0.08);
  z-index: 3;
}

/* Pagination */
.pagination {
  justify-content: center;
}

.page-link {
  color: #2e7d32;
  border-color: rgba(46, 125, 50, 0.3);
  border-radius: 8px;
  margin: 0 4px;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #2e7d32;
  color: white;
  border-color: #2e7d32;
}

.page-item.active .page-link {
  background-color: #2e7d32;
  border-color: #2e7d32;
}

@media (max-width: 768px) {
  .recipe-controls {
    flex-direction: column;
  }

  .recipe-search-wrapper {
    max-width: 100%;
  }

  .recipe-sort-wrapper {
    width: 100%;
  }
}
</style>