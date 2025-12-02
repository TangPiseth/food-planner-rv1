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

        <!-- Recipe Cards Grid -->
        <div class="row g-4">
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

export default {
    components: {
        RecipeItem,
    },
    data() {
        return {
            searchQuery: '',
            sortOption: 'latest',
            currentPage: 1,
            recipes: [
                { id: 1, title: 'Amok Fish', description: 'A traditional Cambodian dish with coconut and spices.', image: require('@/assets/img/AmokFish.jpg'), popularity: 5, rating: 4.8, category: 'Main Course', author: 'Elite', date: 'June 20, 2019', authorImage: require('@/assets/img/person.png') },
                { id: 2, title: 'Beef Lok Lak', description: 'A flavorful stir-fried beef dish everyone loves.', image: require('@/assets/img/LokLak.jpg'), popularity: 4, rating: 4.5, category: 'Main Course', author: 'Piseth', date: 'July 01, 2019', authorImage: require('@/assets/img/person.png') },
                { id: 3, title: 'Num Banh Chok', description: 'Khmer noodles with green curry sauce.', image: require('@/assets/img/NBChok.jpg'), popularity: 3, rating: 4.6, category: 'Main Course', author: 'Veasna', date: 'September 19, 2019', authorImage: require('@/assets/img/person.png') },
                { id: 4, title: 'Kuy Teav', description: 'A popular Cambodian noodle soup.', image: require('@/assets/img/KuyTeav.jpg'), popularity: 2, rating: 4.3, category: 'Main Course', author: 'Thida', date: 'May 23, 2020', authorImage: require('@/assets/img/person.png') },
                { id: 5, title: 'Bai Sach Chrouk', description: 'Pork and rice dish with pickled vegetables.', image: require('@/assets/img/BSJruk.jpg'), popularity: 5, rating: 4.7, category: 'Main Course', author: 'Sokha', date: 'August 12, 2020', authorImage: require('@/assets/img/person.png') },
                { id: 6, title: 'Trey Chien Choun', description: 'Deep-fried fish with a tangy tamarind sauce.', image: require('@/assets/img/TCChoun.jpg'), popularity: 1, rating: 4.1, category: 'Main Course', author: 'Thida', date: 'August 12, 2020', authorImage: require('@/assets/img/person.png') },
                { id: 7, title: 'Cha Houy Teuk', description: 'A refreshing Cambodian dessert with coconut milk and jelly.', image: require('@/assets/img/CHTeuk.jpg'), popularity: 4, rating: 4.4, category: 'Dessert', author: 'Panha', date: 'October 23, 2020', authorImage: require('@/assets/img/person.png') },
                { id: 8, title: 'Prahok Ktis', description: 'A spicy dip made with fermented fish paste.', image: require('@/assets/img/PHKtis.jpg'), popularity: 3, rating: 4.5, category: 'Appetizer', author: 'Raksa', date: 'October 31, 2021', authorImage: require('@/assets/img/person.png') },
                { id: 9, title: 'Samlor Korko', description: 'A hearty soup with vegetables and fish.', image: require('@/assets/img/SKKo.jpg'), popularity: 2, rating: 4.2, category: 'Appetizer', author: 'Elite', date: 'November 09, 2021', authorImage: require('@/assets/img/person.png') },
                { id: 10, title: 'Bruschetta', description: 'Toasted bread topped with a fresh mix of vegies drizzled with olive oil and balsamic glaze.', image: require('@/assets/img/BSCHTA.jpg'), popularity: 1, rating: 4.0, category: 'Appetizer', author: 'Youim', date: 'December 25, 2021', authorImage: require('@/assets/img/person.png') },
                { id: 11, title: 'Bok Lahong', description: 'Green papaya salad with peanuts and dried shrimp.', image: require('@/assets/img/BLHong.jpg'), popularity: 5, rating: 4.9, category: 'Appetizer', author: 'Youim', date: 'January 01, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 12, title: 'Kralan', description: 'Bamboo sticky rice cooked in a bamboo tube.', image: require('@/assets/img/Kralan.jpg'), popularity: 4, rating: 4.3, category: 'Dessert', author: 'Tey', date: 'February 14, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 13, title: 'Sach Ko Ang', description: 'Grilled beef skewers with a tangy lime and pepper dipping sauce.', image: require('@/assets/img/SKAng.jpg'), popularity: 3, rating: 4.1, category: 'Dessert', author: 'Sa', date: 'February 15, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 14, title: 'Mango Sticky Rice', description: 'Sweet sticky rice topped with fresh mango slices and drizzled with coconut milk.', image: require('@/assets/img/MSRice.jpg'), popularity: 2, rating: 4.4, category: 'Dessert', author: 'Piseth', date: 'March 01, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 15, title: 'Trey Chha Kreung', description: 'Stir-fried fish with lemongrass and kroeung.', image: require('@/assets/img/TCKR.jpg'), popularity: 5, rating: 4.6, category: 'Main Course', author: 'Veasna', date: 'March 15, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 16, title: 'Num Pang Sach', description: 'Lightly flamed bread with meat and veggie fillings.', image: require('@/assets/img/NPS.jpg'), popularity: 5, rating: 3.8, category: 'Dessert', author: 'Sa', date: 'April 01, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 17, title: 'Num Pang Siv Mai', description: 'Num Pang Sach but with Siv Mai sauce to dip.', image: require('@/assets/img/NPSM.jpg'), popularity: 3, rating: 4.1, category: 'Dessert', author: 'Panha', date: 'April 15, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 18, title: 'Somlor Machu Kroeung', description: 'A tangy Cambodian soup made with tamarind, lemongrass, and fish.', image: require('@/assets/img/SMKR.jpg'), popularity: 4, rating: 4.4, category: 'Dessert', author: 'HuyKheang', date: 'May 01, 2022', authorImage: require('@/assets/img/person.png') },
                { id: 19, title: 'Banana Blossom Salad', description: 'A refreshing salad made with banana blossoms, herbs, and a tangy dressing.', image: require('@/assets/img/BBSalad.jpg'), popularity: 3, rating: 4.5, category: 'Dessert', author: 'HuyKheang', date: 'July 23, 2022', authorImage: require('@/assets/img/person.png')  },
                { id: 20, title: 'Khmer Scallion Pancakes', description: 'Crispy pancakes with scallions, perfect as an appetizer or snack.', image: require('@/assets/img/KSPC.jpg'), popularity: 2, rating: 4.3, category: 'Dessert', author: 'Elite', date: 'September 01, 2024', authorImage: require('@/assets/img/person.png') },
            ]
        };
    },
    computed: {
        filteredRecipes() {
            let filtered = this.recipes.filter(recipe => recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
            if (this.sortOption === 'latest') {
                filtered = filtered.reverse();
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
            return Math.ceil(this.recipes.length / 9);
        }
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        searchRecipes() {
            this.currentPage = 1;
        }
    },
    mounted() {
        AOS.init();
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