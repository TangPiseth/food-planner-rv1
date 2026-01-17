<template>
  <div class="EG-Default" style="margin-top: 80px;">
    <!-- SVG Filters -->
    <svg style="display: none">
      <filter id="glass-distortion-meal-form">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="10" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
      <filter id="glass-distortion-meal-card">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="11" />
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
                  <li class="breadcrumb-item link-secondary active" aria-current="page">MEAL PLANNER</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="meal-planner-hero">
      <div class="container text-center py-5">
        <h1 class="fw-bold display-4 mb-3" data-aos="fade-down">Plan Your Meals</h1>
        <p class="lead text-muted mb-0" data-aos="fade-up">Organize meals by date and time to streamline your planning!</p>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="meal-planner-section py-5">
      <div class="container">
        <!-- Meal Planner Form -->
        <div class="row justify-content-center mb-5" data-aos="zoom-in">
          <div class="col-lg-8 col-md-10 col-sm-12">
            <div class="meal-form-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>

              <div class="form-content">
                <h3 class="mb-4 fw-bold" style="color: #2e7d32;">Add a Meal</h3>
                <form @submit.prevent="addMeal">
                  <div class="mb-4">
                    <label for="mealName" class="form-label fw-600">Meal Name</label>
                    <input 
                      type="text" 
                      id="mealName" 
                      v-model="newMeal.name" 
                      class="form-control glass-input" 
                      placeholder="Enter meal name" 
                      required 
                    />
                  </div>
                  <div class="mb-4">
                    <label for="mealTime" class="form-label fw-600">Meal Time</label>
                    <select id="mealTime" v-model="newMeal.time" class="form-select glass-select" required>
                      <option disabled value="">Select a time</option>
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                    </select>
                  </div>
                  <div class="mb-4">
                    <label for="mealDate" class="form-label fw-600">Date</label>
                    <input 
                      type="date" 
                      id="mealDate" 
                      v-model="newMeal.date" 
                      class="form-control glass-input" 
                      required 
                    />
                  </div>
                  <button type="submit" class="meal-btn w-100">Add Meal</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Planned Meals Section -->
        <div class="meal-plan-container">
          <h3 class="fw-bold mb-5 text-center" data-aos="fade-left" style="color: #1a1a1a; font-size: 2rem;">Your Meal Plan</h3>
          <div class="meal-plan-content">
            <div v-if="meals.length > 0" class="meal-plan-grid">
              <div v-for="(mealsForDate, date) in groupedMeals" :key="date" class="meal-date-section" data-aos="fade-up">
                <h4 class="fw-bold mb-4" style="color: #2e7d32; text-align: center;">{{ date }}</h4>
                <div class="row justify-content-center">
                  <div v-for="(meal, index) in mealsForDate" :key="index" class="col-lg-4 col-md-6 mb-4" data-aos="flip-left">
                    <div class="meal-card-glass">
                      <div class="glass-filter"></div>
                      <div class="glass-overlay"></div>
                      <div class="glass-specular"></div>

                      <div class="meal-card-content">
                        <div class="meal-badge">{{ meal.time }}</div>
                        <h5 class="meal-card-title fw-bold mt-3">{{ meal.name }}</h5>
                        <button class="meal-remove-btn mt-4" @click="removeMeal(date, index)">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="meal-plan-empty">
              <div class="empty-state">
                <p class="text-muted fs-5">No meals planned yet. Unless "winging it" is your new diet plan, you might want to start adding meals here. 🍽️</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AOS from "aos";
import "aos/dist/aos.css";
import { getMealPlans, createMealPlan, deleteMealPlan } from '@/services/mealPlanService';

export default {
  name: "MealPlanner",
  data() {
    return {
      newMeal: {
        name: "",
        time: "",
        date: "",
      },
      meals: [],
      loading: false,
    };
  },
  computed: {
    groupedMeals() {
      return this.meals.reduce((group, meal) => {
        if (!group[meal.date]) group[meal.date] = [];
        group[meal.date].push(meal);
        return group;
      }, {});
    },
  },
  methods: {
    async addMeal() {
      if (this.newMeal.name && this.newMeal.time && this.newMeal.date) {
        try {
          const mealPlan = await createMealPlan(this.newMeal);
          this.meals.push(mealPlan);
          this.newMeal = { name: "", time: "", date: "" };
        } catch (error) {
          console.error('Error adding meal:', error);
          if (error.response?.status === 401) {
            alert('Please login to save meal plans');
            this.$router.push('/login');
          } else {
            alert('Error adding meal. Please try again.');
          }
        }
      }
    },
    async removeMeal(date, index) {
      const meal = this.groupedMeals[date][index];
      try {
        await deleteMealPlan(meal._id);
        this.groupedMeals[date].splice(index, 1);
        this.meals = Object.values(this.groupedMeals).flat();
      } catch (error) {
        console.error('Error removing meal:', error);
        alert('Error removing meal. Please try again.');
      }
    },
    async loadMealPlans() {
      this.loading = true;
      try {
        this.meals = await getMealPlans();
      } catch (error) {
        console.error('Error loading meal plans:', error);
        if (error.response?.status === 401) {
          // User not logged in, that's okay
          this.meals = [];
        }
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    AOS.init({ duration: 1000 });
    this.loadMealPlans();
  },
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
.meal-planner-hero {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
  overflow: hidden;
}

.meal-planner-hero::before {
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

.meal-planner-hero::after {
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

.meal-planner-hero h1 {
  position: relative;
  z-index: 1;
  color: #1a1a1a;
  letter-spacing: -1px;
}

.meal-planner-hero p {
  position: relative;
  z-index: 1;
  color: #4a4a4a;
}

/* Main Content Section */
.meal-planner-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

/* Meal Form Glass Card */
.meal-form-glass-card {
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

.meal-form-glass-card .glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  filter: url(#glass-distortion-meal-form) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.meal-form-glass-card .glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
}

.meal-form-glass-card .glass-specular {
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

.meal-form-glass-card:hover {
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
.glass-input,
.glass-select {
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

.glass-input:focus,
.glass-select:focus {
  outline: none;
  --input-bg: rgba(255, 255, 255, 0.65);
  border-color: rgba(46, 125, 50, 0.3);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6),
              0 0 0 3px rgba(46, 125, 50, 0.1);
}

.glass-input::placeholder {
  color: #4a4a4a;
}

.glass-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231a1a1a' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* Add Meal Button */
.meal-btn {
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

.meal-btn:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d3817 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.4);
}

.meal-btn:active {
  transform: translateY(0);
}

/* Meal Card Glass */
.meal-card-glass {
  --bg-color: rgba(255, 255, 255, 0.5);
  --highlight: rgba(255, 255, 255, 0.85);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  min-height: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.meal-card-glass .glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-meal-card) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.meal-card-glass .glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
}

.meal-card-glass .glass-specular {
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

.meal-card-content {
  position: relative;
  z-index: 4;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.meal-card-glass:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 48px rgba(46, 125, 50, 0.15),
              inset 0 1px 2px rgba(255, 255, 255, 0.7),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

/* Meal Badge */
.meal-badge {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
}

/* Meal Card Title */
.meal-card-title {
  color: #1a1a1a;
  font-size: 1.3rem;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

/* Meal Remove Button */
.meal-remove-btn {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.8) 0%, rgba(189, 30, 46, 0.9) 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.meal-remove-btn:hover {
  background: linear-gradient(135deg, rgba(189, 30, 46, 0.95) 0%, rgba(139, 20, 33, 1) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.3);
}

.meal-remove-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .form-content {
    padding: 28px 20px;
  }

  .meal-card-glass {
    min-height: 260px;
  }

  .meal-card-content {
    padding: 20px 16px;
  }

  .meal-card-title {
    font-size: 1.1rem;
  }
}

/* Meal Plan Container - Responsive and Reactive */
.meal-plan-container {
  margin-top: 3rem;
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.meal-plan-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.4s ease;
}

/* When meals are present */
.meal-plan-grid {
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

.meal-date-section {
  margin-bottom: 3rem;
  animation: fadeInSequence 0.6s ease-out;
}

@keyframes fadeInSequence {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Empty state - fills screen nicely */
.meal-plan-empty {
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
  .meal-plan-container {
    min-height: 35vh;
  }

  .meal-plan-empty {
    min-height: 35vh;
  }

  .meal-date-section {
    margin-bottom: 2.5rem;
  }
}

@media (max-width: 768px) {
  .form-content {
    padding: 28px 20px;
  }

  .meal-card-glass {
    min-height: 260px;
  }

  .meal-card-content {
    padding: 20px 16px;
  }

  .meal-card-title {
    font-size: 1.1rem;
  }

  .meal-plan-container {
    min-height: 50vh;
  }

  .meal-plan-empty {
    min-height: 50vh;
  }

  .meal-date-section {
    margin-bottom: 2rem;
  }

  .empty-state {
    padding: 30px 20px;
  }

  .empty-state p {
    font-size: 1rem;
  }
  
  .meal-planner-hero h1 {
    font-size: 2rem !important;
  }
  
  .meal-planner-hero p {
    font-size: 1rem !important;
  }
  
  .breadcrumb-section {
    padding: 15px 0;
  }
  
  .meal-planner-section {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  
  .meal-form-glass-card h3 {
    font-size: 1.3rem;
  }
  
  .meal-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .meal-plan-container {
    min-height: 60vh;
  }

  .meal-plan-empty {
    min-height: 60vh;
  }

  .empty-state {
    padding: 25px 15px;
  }

  .empty-state p {
    font-size: 0.95rem;
  }
  
  .meal-planner-hero {
    padding: 30px 0 !important;
  }
  
  .col-lg-8, .col-md-10, .col-sm-12 {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
