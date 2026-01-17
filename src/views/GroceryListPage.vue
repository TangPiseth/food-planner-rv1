<template>
  <div class="EG-Default" style="margin-top: 80px;">
    <!-- SVG Filters -->
    <svg style="display: none">
      <filter id="glass-distortion-grocery-form">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="12" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
      <filter id="glass-distortion-grocery-list">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="13" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
    </svg>

    <!-- Breadcrumb Section -->
    <div class="breadcrumb-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-7 col-lg-8 col-md-10 col-12">
            <div class="text-center" data-aos="fade-down" data-aos-duration="1300">
              <nav>
                <ol class="breadcrumb justify-content-center">
                  <li class="breadcrumb-item"><a href="#" class="text-success">HOME</a></li>
                  <li class="breadcrumb-item link-secondary active" aria-current="page">GROCERY LISTS</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="grocery-hero-section">
      <div class="container text-center py-5">
        <h1 class="fw-bold display-4 mb-3" data-aos="fade-down">Manage Your Grocery Lists</h1>
        <p class="lead text-muted mb-0" data-aos="fade-up">Create and manage your grocery lists with ease!</p>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="grocery-section py-5">
      <div class="container">
        <!-- Add New Grocery List Form -->
        <div class="row justify-content-center mb-5" data-aos="zoom-in">
          <div class="col-lg-8 col-md-10 col-sm-12">
            <div class="grocery-form-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>

              <div class="form-content">
                <h3 class="mb-4 fw-bold" style="color: #2e7d32;">Add a Grocery List</h3>
                <form @submit.prevent="addNewList">
                  <div class="mb-4">
                    <label for="listName" class="form-label fw-600">List Name</label>
                    <input type="text" v-model="newListName" class="form-control glass-input" id="listName" placeholder="Enter list name" />
                  </div>
                  <div class="mb-4">
                    <label for="listDate" class="form-label fw-600">Date</label>
                    <input type="datetime-local" v-model="newListDate" class="form-control glass-input" id="listDate" />
                  </div>
                  <button type="submit" class="grocery-btn w-100">Add List</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Grocery Lists Section -->
        <div class="grocery-lists-container">
          <h3 class="fw-bold mb-5 text-center" data-aos="fade-left" style="color: #1a1a1a; font-size: 2rem;">Your Grocery Lists</h3>
          <div class="grocery-lists-content">
            <div v-if="groceryLists.length > 0" class="grocery-lists-grid">
              <GroceryList v-for="(list, index) in groceryLists" :key="index" :list="list" data-aos="flip-left" @remove-list="removeList(index)"/>
            </div>
            <div v-else class="grocery-lists-empty">
              <div class="empty-state">
                <p class="text-muted fs-5">No grocery lists yet. Time to get cracking, or you might end up having cereal for dinner...again. 🥣</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GroceryList from '@/components/GroceryList.vue';
import { getGroceryLists, createGroceryList, deleteGroceryList } from '@/services/groceryListService';

export default {
  components: {
    GroceryList,
  },
  data() {
    return {
      newListName: '',
      newListDate: '',
      groceryLists: [],
      loading: false,
    };
  },
  methods: {
    async addNewList() {
      if (this.newListName && this.newListDate) {
        try {
          const newList = await createGroceryList({
            name: this.newListName,
            date: this.newListDate,
            items: []
          });
          this.groceryLists.unshift(newList);
          this.newListName = '';
          this.newListDate = '';
        } catch (error) {
          console.error('Error adding list:', error);
          if (error.response?.status === 401) {
            alert('Please login to save grocery lists');
            this.$router.push('/login');
          } else {
            alert('Error adding list. Please try again.');
          }
        }
      }
    },
    async removeList(index) {
      try {
        const list = this.groceryLists[index];
        await deleteGroceryList(list._id);
        this.groceryLists.splice(index, 1);
      } catch (error) {
        console.error('Error removing list:', error);
        alert('Error removing list. Please try again.');
      }
    },
    async loadGroceryLists() {
      this.loading = true;
      try {
        this.groceryLists = await getGroceryLists();
      } catch (error) {
        console.error('Error loading grocery lists:', error);
        if (error.response?.status === 401) {
          // User not logged in, that's okay
          this.groceryLists = [];
        }
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.loadGroceryLists();
  }
};
</script>

<style scoped>
/* Breadcrumb Section */
.breadcrumb-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.breadcrumb-section .breadcrumb {
  background: transparent;
  padding: 0;
  margin: 0;
}

.breadcrumb-section .breadcrumb-item a {
  color: #2e7d32;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-section .breadcrumb-item a:hover {
  color: #1b5e20;
}

/* Hero Section */
.grocery-hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
  overflow: hidden;
}

.grocery-hero-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(46, 125, 50, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  filter: blur(80px);
  pointer-events: none;
}

.grocery-hero-section::after {
  content: '';
  position: absolute;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(23, 185, 122, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -100px;
  left: -100px;
  filter: blur(60px);
  pointer-events: none;
}

.grocery-hero-section h1 {
  position: relative;
  z-index: 1;
  color: #1a1a1a;
  letter-spacing: -1px;
}

.grocery-hero-section p {
  position: relative;
  z-index: 1;
  color: #4a4a4a;
}

/* Main Content Section */
.grocery-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

/* Grocery Form Glass Card */
.grocery-form-glass-card {
  --bg-color: rgba(255, 255, 255, 0.55);
  --highlight: rgba(255, 255, 255, 0.9);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.grocery-form-glass-card .glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  filter: url(#glass-distortion-grocery-form) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.grocery-form-glass-card .glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
}

.grocery-form-glass-card .glass-specular {
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

.form-content {
  position: relative;
  z-index: 4;
  padding: 40px;
}

.grocery-form-glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(46, 125, 50, 0.15),
              inset 0 1px 2px rgba(255, 255, 255, 0.7),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

/* Form Labels */
.form-label {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 8px;
}

/* Glass Input */
.glass-input {
  --input-bg: rgba(255, 255, 255, 0.5);
  position: relative;
  background: var(--input-bg);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 12px 16px;
  color: #1a1a1a;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

.glass-input:focus {
  outline: none;
  --input-bg: rgba(255, 255, 255, 0.65);
  border-color: rgba(46, 125, 50, 0.3);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6),
              0 0 0 3px rgba(46, 125, 50, 0.1);
}

.glass-input::placeholder {
  color: #4a4a4a;
}

/* Add List Button */
.grocery-btn {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  letter-spacing: 0.3px;
}

.grocery-btn:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d3817 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.4);
}

.grocery-btn:active {
  transform: translateY(0);
}

/* Grocery Lists Container - Responsive and Reactive */
.grocery-lists-container {
  margin-top: 3rem;
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.grocery-lists-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.4s ease;
}

/* When lists are present */
.grocery-lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

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

/* Empty state - fills screen nicely */
.grocery-lists-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-state {
  text-align: center;
  padding: 40px;
  max-width: 500px;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.empty-state p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a4a4a;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .grocery-lists-container {
    min-height: 35vh;
  }

  .grocery-lists-empty {
    min-height: 35vh;
  }

  .grocery-lists-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .form-content {
    padding: 28px 20px;
  }

  .grocery-lists-container {
    min-height: 50vh;
  }

  .grocery-lists-empty {
    min-height: 50vh;
  }

  .grocery-lists-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .empty-state {
    padding: 30px 20px;
  }

  .empty-state p {
    font-size: 1rem;
  }
  
  .grocery-hero-section h1 {
    font-size: 2rem !important;
  }
  
  .grocery-hero-section p {
    font-size: 1rem !important;
  }
  
  .breadcrumb-section {
    padding: 15px 0;
  }
  
  .grocery-section {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  
  .grocery-form-glass-card h3 {
    font-size: 1.3rem;
  }
  
  .grocery-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .grocery-lists-container {
    min-height: 60vh;
  }

  .grocery-lists-empty {
    min-height: 60vh;
  }

  .empty-state {
    padding: 25px 15px;
  }

  .empty-state p {
    font-size: 0.95rem;
  }
  
  .grocery-hero-section {
    padding: 30px 0 !important;
  }
  
  .col-lg-8, .col-md-10, .col-sm-12 {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
