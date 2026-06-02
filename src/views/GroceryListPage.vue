<template>
  <div class="EG-Default grocery-page overflow-hidden">
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
      <div class="container text-center py-4 py-md-5 px-3 px-md-4">
        <div class="hero-copy mx-auto" data-aos="fade-up">
          <span class="eyebrow">Grocery Planner</span>
          <h1 class="fw-bold display-4 mb-3 text-wrap" data-aos="fade-down">Manage Your Grocery Lists</h1>
          <p class="lead text-muted mb-0 text-wrap" data-aos="fade-up">Create, organize, print, and carry your grocery lists with ease.</p>
        </div>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="grocery-section py-4 py-md-5">
      <div class="container px-3 px-md-4">
        <div class="page-panel mb-4 mb-md-5" data-aos="zoom-in">
          <div class="row g-3 g-md-4 align-items-center">
            <div class="col-12 col-lg-5">
              <div class="panel-copy">
                <span class="panel-label">Quick capture</span>
                <h3 class="fw-bold mb-3">Create a clean grocery list in seconds.</h3>
                <p class="text-muted mb-0">Keep shopping organized, print what you need, and bring a polished list with you when you leave the house.</p>
              </div>
            </div>
            <div class="col-12 col-lg-7">
              <div class="grocery-form-glass-card">
                <div class="glass-filter"></div>
                <div class="glass-overlay"></div>
                <div class="glass-specular"></div>

                <div class="form-content">
                  <h3 class="mb-4 fw-bold" style="color: #1b5e20;">Add a Grocery List</h3>
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
        </div>

        <div class="grocery-lists-container page-panel" data-aos="fade-up">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h3 class="fw-bold mb-0" style="color: #1a1a1a; font-size: 2rem;">Your Grocery Lists</h3>
            </div>
            <div class="grocery-list-hint text-muted">Print any list from its card when you need a paper copy.</div>
          </div>
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
.grocery-page {
  background: #ffffff;
  padding-top: clamp(90px, 12vw, 120px);
  overflow-x: hidden;
}

/* Breadcrumb Section */
.breadcrumb-section {
  background: #ffffff;
  padding: 20px 0;
  border-bottom: 1px solid rgba(27, 94, 32, 0.08);
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
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfb 100%);
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
  max-width: 760px;
  margin: 0;
  color: #0f172a;
  font-size: clamp(2.8rem, 6vw, 5.2rem);
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.95;
}

.grocery-hero-section p {
  position: relative;
  z-index: 1;
  margin: 24px 0 0;
  color: #4b5563;
  font-size: 17px;
  line-height: 1.75;
}

/* Main Content Section */
.grocery-section {
  background: #ffffff;
  min-height: 100vh;
}

.hero-copy {
  max-width: 760px;
}

.eyebrow,
.panel-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(46, 125, 50, 0.08);
  color: #1b5e20;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.page-panel {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(27, 94, 32, 0.08);
  border-radius: 28px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.06);
  padding: clamp(1.2rem, 2vw, 2rem);
}

.panel-copy {
  padding: 0.5rem 0.25rem;
}

.grocery-list-hint {
  font-size: 0.95rem;
}

/* Grocery Form Glass Card */
.grocery-form-glass-card {
  --bg-color: rgba(248, 250, 248, 0.9);
  --highlight: rgba(255, 255, 255, 0.9);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08),
              inset 0 1px 2px rgba(255, 255, 255, 0.8),
              inset 0 -1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(27, 94, 32, 0.08);
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
  padding: 38px;
}

.grocery-form-glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 48px rgba(46, 125, 50, 0.12),
              inset 0 1px 2px rgba(255, 255, 255, 0.75),
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
  margin-top: 1.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
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
  .page-panel {
    border-radius: 22px;
    padding: 1rem;
  }

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
    padding-top: 1.5rem !important;
    padding-bottom: 2rem !important;
  }
  
  .grocery-form-glass-card h3 {
    font-size: 1.3rem;
  }
  
  .grocery-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .grocery-list-hint {
    font-size: 0.86rem;
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
