<template>
  <div class="EG-Default meal-planner-page overflow-hidden">
    <!-- SVG Filters -->
    <svg style="display: none">
      <filter id="glass-distortion-calendar">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="12" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="55" />
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
      <div class="container text-center py-4 py-md-5 px-3 px-md-4">
        <h1 class="fw-bold display-4 mb-3 text-wrap" data-aos="fade-down" style="color: #1a1a1a;">Plan Your Meals</h1>
        <p class="lead text-muted mb-0 text-wrap" data-aos="fade-up">Organize your week intuitively. Select a date to add or print your meals!</p>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="meal-planner-section py-4 py-md-5">
      <div class="container px-3 px-md-4">
        <div class="calendar-glass-card" data-aos="zoom-in">
          <div class="glass-filter"></div>
          <div class="glass-overlay"></div>
          <div class="glass-specular"></div>

          <div class="calendar-content">
            <div class="calendar-header d-flex justify-content-between align-items-center mb-4">
              <button class="nav-btn" @click="prevMonth">&lt;</button>
              <div class="month-year-picker">
                <button class="month-year-btn" @click="openMonthYearPicker('month')">{{ monthName }}</button>
                <button class="month-year-btn year" @click="openMonthYearPicker('year')">{{ currentYear }}</button>
              </div>
              <button class="nav-btn" @click="nextMonth">&gt;</button>
            </div>

            <div class="calendar-grid">
              <div class="weekday fw-bold text-muted" v-for="day in weekdays" :key="day">{{ day }}</div>
              <div 
                v-for="(date, index) in blankDays" 
                :key="'blank-' + index" 
                class="calendar-day blank"
              ></div>
              <div 
                v-for="day in daysInMonth" 
                :key="day" 
                class="calendar-day active-day"
                @click="openDayModal(day)"
                :class="{ 'has-meals': hasMeals(day), 'today': isToday(day) }"
              >
                <span class="day-number">{{ day }}</span>
                <div class="meal-indicators" v-if="hasMeals(day)">
                  <span class="indicator" v-for="meal in getMealsForDay(day).slice(0, 3)" :key="meal._id"></span>
                  <span v-if="getMealsForDay(day).length > 3" class="more-indicator">+</span>
                </div>
              </div>
            </div>
            
            <div class="print-actions mt-4 text-center">
              <button class="generic-btn print-multi-btn" @click="openMultiPrintModal" :disabled="meals.length === 0">
                Print Multi-Day Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Month/Year Picker Modal -->
    <div class="modal-overlay" v-if="showMonthYearModal" @click.self="closeMonthYearPicker">
      <div class="glass-modal text-center" data-aos="zoom-in" style="max-width: 520px;">
        <button class="close-btn" @click="closeMonthYearPicker">&times;</button>
        <h3 class="fw-bold mb-2" style="color: #2e7d32;">Jump to a Date</h3>
        <p class="text-muted mb-4">Pick your month and year to jump instantly.</p>

        <div class="picker-grid">
          <div class="picker-field">
            <label class="form-label text-dark fw-bold text-start w-100">Month</label>
            <select class="form-select glass-select" v-model.number="tempMonth">
              <option v-for="(label, index) in monthOptions" :key="label" :value="index">{{ label }}</option>
            </select>
          </div>
          <div class="picker-field">
            <label class="form-label text-dark fw-bold text-start w-100">Year</label>
            <select class="form-select glass-select" v-model.number="tempYear">
              <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </div>

        <div class="d-flex gap-2 mt-4">
          <button class="generic-btn print-btn w-50" @click="closeMonthYearPicker">Cancel</button>
          <button class="generic-btn add-btn w-50" @click="applyMonthYear">Apply</button>
        </div>
      </div>
    </div>

    <!-- Day Detail & Add Modal -->
    <div class="modal-overlay" v-if="selectedDate" @click.self="closeDayModal">
      <div class="glass-modal align-items-start" data-aos="zoom-in">
        <button class="close-btn" @click="closeDayModal">&times;</button>
        <h3 class="fw-bold mb-4" style="color: #2e7d32;">{{ formattedSelectedDate }}</h3>
        
        <div class="row">
          <!-- View/Print Area -->
          <div class="col-md-6 mb-4 mb-md-0 modal-section border-right-glass">
            <h5 class="fw-bold mb-3 text-dark">Meals Planned</h5>
            <div v-if="selectedDayMeals.length > 0" class="meal-list-scroll">
              <div v-for="(meal, idx) in selectedDayMeals" :key="idx" class="meal-item glass-input mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex flex-column align-items-start text-start">
                    <span class="badge bg-success mb-1">{{ meal.time }}</span>
                    <h6 class="mb-0 fw-bold">{{ meal.name }}</h6>
                  </div>
                  <button class="btn btn-sm btn-danger rounded-circle p-1 lh-1" @click="removeMeal(meal._id)" title="Remove">
                    <i class="fa-solid fa-times" style="font-size: 12px; width: 14px; height: 14px;"></i>
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-muted fst-italic">No meals planned.</p>
            <button class="generic-btn print-btn mt-3 w-100" @click="printDay" :disabled="selectedDayMeals.length === 0">
              <i class="fa-solid fa-print me-2"></i> Print Day PDF
            </button>
          </div>

          <!-- Add Area -->
          <div class="col-md-6 modal-section pl-md-4">
            <h5 class="fw-bold mb-3 text-dark">Add to Plan</h5>
            <form @submit.prevent="addMeal">
              <div class="mb-3">
                <input type="text" v-model="newMeal.name" class="form-control glass-input" placeholder="Meal name (e.g. Pasta)" required />
              </div>
              <div class="mb-3">
                <select v-model="newMeal.time" class="form-select glass-select" required>
                  <option disabled value="">Select time</option>
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snack</option>
                </select>
              </div>
              <button type="submit" class="generic-btn add-btn w-100">Add Meal</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Multi-day Print Modal -->
    <div class="modal-overlay" v-if="showMultiPrintModal" @click.self="closeMultiPrintModal">
      <div class="glass-modal text-center" data-aos="zoom-in" style="max-width: 500px;">
        <button class="close-btn" @click="closeMultiPrintModal">&times;</button>
        <h3 class="fw-bold mb-4" style="color: #2e7d32;">Print Multi-Day Plan</h3>
        <p class="text-muted mb-4">Select the span of days to include in your meal plan printout. (Max 3 days)</p>
        
        <div class="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4">
          <div class="flex-fill">
            <label class="form-label text-dark fw-bold text-start w-100 fs-sm">Start Date</label>
            <input type="date" v-model="printStartDate" class="form-control glass-input" />
          </div>
          <div class="flex-fill">
            <label class="form-label text-dark fw-bold text-start w-100 fs-sm">End Date</label>
            <input type="date" v-model="printEndDate" class="form-control glass-input" :min="printStartDate" :max="maxEndDate" />
          </div>
        </div>

        <button class="generic-btn print-multi-btn w-100" @click="executeMultiPrint" :disabled="!printStartDate || !printEndDate">
          <i class="fa-solid fa-file-pdf me-2"></i> Download Plan
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AOS from "aos";
import "aos/dist/aos.css";
import { getMealPlans, createMealPlan, deleteMealPlan } from '@/services/mealPlanService';
import jsPDF from 'jspdf';

export default {
  name: "MealPlanner",
  data() {
    return {
      newMeal: {
        name: "",
        time: "",
      },
      meals: [],
      loading: false,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      monthOptions: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      selectedDate: null,
      showMonthYearModal: false,
      tempMonth: new Date().getMonth(),
      tempYear: new Date().getFullYear(),
      showMultiPrintModal: false,
      printStartDate: '',
      printEndDate: ''
    };
  },
  computed: {
    monthName() {
      return this.monthOptions[this.currentMonth];
    },
    yearOptions() {
      const startYear = this.currentYear - 10;
      return Array.from({ length: 21 }, (_, index) => startYear + index);
    },
    daysInMonth() {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    },
    blankDays() {
      return new Date(this.currentYear, this.currentMonth, 1).getDay();
    },
    selectedDayMeals() {
      return this.getMealsForDay(this.selectedDate);
    },
    formattedSelectedDate() {
      if(!this.selectedDate) return '';
      return new Date(this.currentYear, this.currentMonth, this.selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    },
    maxEndDate() {
      if (!this.printStartDate) return '';
      const start = new Date(this.printStartDate);
      start.setDate(start.getDate() + 2); // Max 3 days span
      return start.toISOString().split('T')[0];
    }
  },
  methods: {
    openMonthYearPicker() {
      this.tempMonth = this.currentMonth;
      this.tempYear = this.currentYear;
      this.showMonthYearModal = true;
    },
    closeMonthYearPicker() {
      this.showMonthYearModal = false;
    },
    applyMonthYear() {
      this.currentMonth = this.tempMonth;
      this.currentYear = this.tempYear;
      this.showMonthYearModal = false;
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    isToday(day) {
      const today = new Date();
      return day === today.getDate() && 
             this.currentMonth === today.getMonth() && 
             this.currentYear === today.getFullYear();
    },
    _formatDate(day) {
      // YYYY-MM-DD
      const date = new Date(this.currentYear, this.currentMonth, day);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().split('T')[0];
    },
    hasMeals(day) {
      const dStr = this._formatDate(day);
      return this.meals.some(m => m.date === dStr);
    },
    getMealsForDay(day) {
      if (!day) return [];
      const dStr = this._formatDate(day);
      return this.meals.filter(m => m.date === dStr);
    },
    openDayModal(day) {
      this.selectedDate = day;
      this.newMeal.name = '';
      this.newMeal.time = '';
    },
    closeDayModal() {
      this.selectedDate = null;
    },
    async addMeal() {
      if (this.newMeal.name && this.newMeal.time && this.selectedDate) {
        try {
          const payload = {
            ...this.newMeal,
            date: this._formatDate(this.selectedDate)
          };
          const mealPlan = await createMealPlan(payload);
          this.meals.push(mealPlan);
          this.newMeal.name = '';
          this.newMeal.time = '';
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
    async removeMeal(id) {
      try {
        await deleteMealPlan(id);
        this.meals = this.meals.filter(m => m._id !== id);
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
          this.meals = [];
        }
      } finally {
        this.loading = false;
      }
    },
    
    // Core PDF Generation Methods
    printDay() {
      if (!this.selectedDate) return;
      const doc = new jsPDF();
      const dateStr = this.formattedSelectedDate;
      const mealsToPrint = this.selectedDayMeals;
      
      this._buildPDFLayout(doc, 'Meal Plan - ' + dateStr, [
        { dateStr, meals: mealsToPrint }
      ]);
      doc.save(`MealPlan_${this._formatDate(this.selectedDate)}.pdf`);
    },
    openMultiPrintModal() {
      this.showMultiPrintModal = true;
      this.printStartDate = '';
      this.printEndDate = '';
    },
    closeMultiPrintModal() {
      this.showMultiPrintModal = false;
    },
    executeMultiPrint() {
      if(!this.printStartDate || !this.printEndDate) return;
      
      const startD = new Date(this.printStartDate);
      const endD = new Date(this.printEndDate);
      // Ensure timezones don't skew dates
      startD.setMinutes(startD.getMinutes() - startD.getTimezoneOffset());
      endD.setMinutes(endD.getMinutes() - endD.getTimezoneOffset());

      const diffTime = Math.abs(endD - startD);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 2) { // 0, 1, or 2 = max 3 days duration
        alert('You can only print a maximum of 3 consecutive days.');
        return;
      }
      
      let dayData = [];
      for(let d = 0; d <= diffDays; d++) {
        const iterD = new Date(startD);
        iterD.setDate(startD.getDate() + d);
        const iso = iterD.toISOString().split('T')[0];
        const m = this.meals.filter(item => item.date === iso);
        const fStr = iterD.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        
        dayData.push({ dateStr: fStr, meals: m });
      }

      const doc = new jsPDF();
      this._buildPDFLayout(doc, 'Multi-Day Meal Plan', dayData);
      doc.save(`MultiDay_MealPlan_${this.printStartDate}_to_${this.printEndDate}.pdf`);
      this.closeMultiPrintModal();
    },
    _buildPDFLayout(doc, title, daysData) {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const headerHeight = 42;
      const footerHeight = 18;
      const contentTop = margin + headerHeight + 10;
      const contentBottom = pageHeight - footerHeight - 16;
      const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const renderHeader = () => {
        doc.setFillColor(46, 125, 50);
        doc.rect(0, 0, pageWidth, headerHeight, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('EatsBuddy', margin, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Meal Plan', margin, 28);

        const generatedLabel = `Generated ${generatedDate}`;
        doc.setFontSize(9);
        doc.text(generatedLabel, pageWidth - margin - doc.getTextWidth(generatedLabel), 18);
        doc.text(title, pageWidth - margin - doc.getTextWidth(title), 29);
      };

      const renderFooter = (pageNumber) => {
        const footerY = pageHeight - 12;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

        doc.setFontSize(8.5);
        doc.setTextColor(120, 120, 120);
        doc.text('Generated by EatsBuddy - Smart Food Planner', margin, footerY);
        doc.text(`Page ${pageNumber}`, pageWidth - margin - 18, footerY);
      };

      renderHeader();
      let yPos = contentTop;
      let pageNumber = 1;

      daysData.forEach(day => {
        if (yPos > contentBottom - 20) {
          renderFooter(pageNumber);
          doc.addPage();
          pageNumber++;
          renderHeader();
          yPos = contentTop;
        }
        
        doc.setTextColor(17, 24, 39);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(day.dateStr, margin, yPos);
        yPos += 4;
        
        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.4);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
        
        if (day.meals.length === 0) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(11);
          doc.setTextColor(120, 120, 120);
          doc.text("No meals planned.", margin + 5, yPos);
          yPos += 14;
        } else {
          day.meals.forEach(m => {
            const rowHeight = 14;
            if (yPos + rowHeight > contentBottom) {
              renderFooter(pageNumber);
              doc.addPage();
              pageNumber++;
              renderHeader();
              yPos = contentTop;
            }

            // Rounded rectangle for meal
            doc.setFillColor(249, 250, 251);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(margin, yPos - 4, pageWidth - margin * 2, 11, 3, 3, 'FD');

            // Time badge-like indicator
            doc.setFillColor(46, 125, 50);
            doc.roundedRect(margin + 4, yPos - 2, 22, 6, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            let mTime = m.time;
            if(mTime.length > 5) mTime = mTime.substring(0,4) + '.';
            doc.text(mTime, margin + 5, yPos + 2.2);

            // Meal name
            doc.setTextColor(31, 41, 55);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            doc.text(`${m.name}`, margin + 30, yPos + 2.2);

            yPos += 12;
          });
          yPos += 8;
        }
      });
      
      renderFooter(pageNumber);
    }
  },
  watch: {
    printStartDate(newVal) {
      if (this.printEndDate && newVal > this.printEndDate) {
        this.printEndDate = newVal;
      }
    }
  },
  mounted() {
    AOS.init({ duration: 1000 });
    this.loadMealPlans();
  }
};
</script>

<style scoped>
/* Core Page Overrides for Premium Aesthetic */
.meal-planner-page {
  padding-top: clamp(90px, 12vw, 120px);
  overflow-x: hidden;
}

.breadcrumb-section {
  background: #ffffff;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.breadcrumb .breadcrumb-item a {
  color: #2e7d32;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.meal-planner-hero {
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.meal-planner-hero h1 {
  max-width: 760px;
  margin: 0 auto;
  color: #0f172a;
  font-size: clamp(2.8rem, 6vw, 5.2rem);
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.95;
}

.meal-planner-hero p {
  max-width: 610px;
  margin: 24px auto 0;
  color: #4b5563;
  font-size: 17px;
  line-height: 1.75;
}

.meal-planner-section {
  background: #ffffff;
  
}

/* Glass Calendar Layout */
.calendar-glass-card {
  --bg-color: rgba(255, 255, 255, 0.65);
  --highlight: rgba(255, 255, 255, 0.95);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08),
              inset 0 1px 2px rgba(255, 255, 255, 0.7),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
  max-width: 900px;
  margin: 0 auto;
}

.calendar-glass-card .glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(12px);
  filter: url(#glass-distortion-calendar) saturate(110%);
  z-index: 1;
}

.calendar-glass-card .glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
}

.calendar-glass-card .glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 2px 2px 5px var(--highlight),
              inset -1px -1px 2px rgba(0, 0, 0, 0.06);
  z-index: 3;
  pointer-events: none;
}

.calendar-content {
  position: relative;
  z-index: 4;
  padding: 30px;
}

/* Calendar Header */
.calendar-header {
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding-bottom: 20px;
}

.month-year-picker {
  display: flex;
  align-items: center;
  gap: 10px;
}

.month-year-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(46, 125, 50, 0.25);
  color: #2e7d32;
  font-weight: 700;
  font-size: 1.25rem;
  border-radius: 14px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.month-year-btn.year {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(46, 125, 50, 0.25);
  color: #2e7d32;
  font-weight: 700;
  font-size: 1.25rem;
  border-radius: 14px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.month-year-btn:hover {
  background: #f4f9f5;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(46, 125, 50, 0.12);
}

.nav-btn {
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  font-size: 1.2rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s;
}
.nav-btn:hover {
  background: #f1f5f2;
}

/* Calendar Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  text-align: center;
}

.weekday {
  padding: 10px 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #6c757d;
}

.calendar-day {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.8),
              0 2px 6px rgba(0,0,0,0.02);
  border-radius: 12px;
  aspect-ratio: 1; /* Squarish appearance */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-day.blank {
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: default;
}

.calendar-day.active-day:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  border-color: #2e7d32;
}

.calendar-day.today .day-number {
  background: #2e7d32;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.day-number {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.9rem;
}

.meal-indicators {
  display: flex;
  justify-content: center;
  margin-top: auto;
  margin-bottom: 8px;
  gap: 3px;
  flex-wrap: wrap;
  width: 100%;
}

.indicator {
  width: 6px;
  height: 6px;
  background-color: #2e7d32;
  border-radius: 50%;
}
.more-indicator {
  font-size: 0.6rem;
  color: #2e7d32;
  font-weight: bold;
  line-height: 1;
}

/* Modals styling (White Premium Liquid Glass Theme) */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.glass-modal {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1),
              inset 0 2px 4px rgba(255, 255, 255, 1);
  border-radius: 24px;
  padding: 30px;
  width: 100%;
  max-width: 800px;
  position: relative;
}

.picker-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.picker-field {
  text-align: left;
}

@media (max-width: 576px) {
  .month-year-picker {
    flex-direction: column;
    gap: 6px;
  }

  .month-year-btn {
    width: 100%;
  }

  .picker-grid {
    grid-template-columns: 1fr;
  }

  .calendar-content {
    padding: 16px 12px;
  }

  .calendar-grid {
    gap: 4px;
  }

  .weekday {
    font-size: 0.72rem;
    padding: 6px 0;
  }

  .day-number {
    font-size: 0.78rem;
  }

  .glass-modal {
    padding: 22px 18px;
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 25px;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  color: #1a1a1a;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.3s;
  line-height: 1;
}
.close-btn:hover { opacity: 1; }

.border-right-glass {
  border-right: 1px solid rgba(0,0,0,0.08);
}
@media (max-width: 767px) {
  .border-right-glass {
    border-right: none;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    padding-bottom: 20px;
  }
  .pl-md-4 { padding-left: 15px; padding-top: 20px; }
}
.pl-md-4 { padding-left: 30px; }

.meal-list-scroll {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Glass Input specific overrides */
.glass-input, .glass-select {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0,0,0,0.1);
  color: #1a1a1a;
  border-radius: 12px;
  padding: 10px 14px;
  transition: all 0.3s;
}
.glass-input:focus, .glass-select:focus {
  background: rgba(255, 255, 255, 0.9);
  border-color: #2e7d32;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.15);
  outline: none;
}

.fs-sm { font-size: 0.85rem; }

/* Buttons */
.generic-btn {
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  letter-spacing: 0.3px;
}

.add-btn {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
}
.add-btn:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d3817 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.35);
}

.print-btn, .print-multi-btn {
  background: white;
  border: 1px solid rgba(46, 125, 50, 0.4);
  color: #2e7d32;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}
.print-btn:hover:not(:disabled), .print-multi-btn:hover:not(:disabled) {
  background: #f4f9f5;
  border-color: #2e7d32;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(46, 125, 50, 0.1);
}
.print-btn:disabled, .print-multi-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
