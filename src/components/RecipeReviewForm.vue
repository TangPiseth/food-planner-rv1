<template>
    <div class="review-form-compact" data-aos="fade-up">
      <div v-if="showAlert" class="alert alert-success mb-3" role="alert">
        <i class="fa-solid fa-check-circle me-2"></i>Thank you for your review!
      </div>
      
      <h4 class="fw-bold mb-1">Leave a Review</h4>
      <p class="text-muted small mb-3">Required fields are marked *</p>
  
      <form @submit.prevent="handleSubmit">
        <div class="row g-2 mb-3">
          <div class="col-md-6">
            <input 
              type="text" 
              class="form-control form-control-sm" 
              :class="{ 'is-invalid': errors.name }"
              v-model="formData.name"
              placeholder="Name *" 
            />
            <div class="invalid-feedback" v-if="errors.name">
              {{ errors.name }}
            </div>
          </div>
          <div class="col-md-6">
            <input 
              type="email" 
              class="form-control form-control-sm"
              :class="{ 'is-invalid': errors.email }"
              v-model="formData.email"
              placeholder="Email *" 
            />
            <div class="invalid-feedback" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>
        </div>
  
        <div class="mb-3">
          <label class="fw-600 d-block mb-2 small">Your Rating *</label>
          <select 
            class="form-select form-select-sm"
            :class="{ 'is-invalid': errors.rating }"
            v-model="formData.rating"
          >
            <option value="0">Select a rating</option>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Very Good</option>
            <option value="3">⭐⭐⭐ Good</option>
            <option value="2">⭐⭐ Fair</option>
            <option value="1">⭐ Poor</option>
          </select>
          <div class="invalid-feedback" v-if="errors.rating">
            {{ errors.rating }}
          </div>
        </div>
  
        <div class="mb-3">
          <textarea 
            class="form-control form-control-sm"
            :class="{ 'is-invalid': errors.review }"
            v-model="formData.review"
            rows="4"
            placeholder="Your Review *"
          ></textarea>
          <div class="invalid-feedback" v-if="errors.review">
            {{ errors.review }}
          </div>
        </div>
  
        <div class="form-check mb-3 text-start">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="saveInfo"
            v-model="formData.saveInfo"
          />
          <label class="form-check-label" style="font-size: 13px;" for="saveInfo">
            Save my info for next time
          </label>
        </div>
  
        <button type="submit" class="btn btn-success btn-sm px-4">
          <i class="fa-solid fa-paper-plane me-2"></i>Post Review
        </button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RecipeReviewForm',
    props: {
      recipeId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        formData: {
          name: '',
          email: '',
          review: '',
          rating: 0,
          saveInfo: false
        },
        showAlert: false,
        errors: {}
      }
    },
    methods: {
      validateForm() {
        const errors = {};
        
        if (!this.formData.name.trim()) {
          errors.name = 'Name is required';
        }
        
        if (!this.formData.email.trim()) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(this.formData.email)) {
          errors.email = 'Please enter a valid email address';
        }
        
        if (!this.formData.review.trim()) {
          errors.review = 'Review is required';
        }
        
        if (this.formData.rating === 0) {
          errors.rating = 'Please select a rating';
        }
        
        this.errors = errors;
        return Object.keys(errors).length === 0;
      },
      
      handleSubmit() {
        if (this.validateForm()) {
          // Create review object
          const reviewData = {
            id: Date.now(), // Temporary ID
            name: this.formData.name,
            rating: parseInt(this.formData.rating),
            comment: this.formData.review,
            date: new Date().toISOString().split('T')[0],
            recipeId: this.recipeId
          };
          
          // Emit the review to parent
          this.$emit('review-submitted', reviewData);
          
          // Show success message
          this.showAlert = true;
          
          // Reset form
          const saveInfoValue = this.formData.saveInfo;
          this.formData = {
            name: saveInfoValue ? this.formData.name : '',
            email: saveInfoValue ? this.formData.email : '',
            review: '',
            rating: 0,
            saveInfo: saveInfoValue
          };
          
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .review-form-compact {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    padding: 24px;
    border-radius: 16px;
    border: 1px solid rgba(46, 125, 50, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .review-form-compact h4 {
    color: #2e7d32;
    font-size: 1.25rem;
  }

  .form-control,
  .form-select {
    background-color: white;
    border: 1px solid rgba(46, 125, 50, 0.2);
    font-size: 0.9rem;
  }

  .form-control:focus,
  .form-select:focus {
    border-color: #2e7d32;
    box-shadow: 0 0 0 0.2rem rgba(46, 125, 50, 0.15);
  }

  .btn-success {
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
    border: none;
    font-weight: 600;
    border-radius: 8px;
  }

  .btn-success:hover {
    background: linear-gradient(135deg, #1b5e20 0%, #0d3817 100%);
    transform: translateY(-1px);
  }

  .alert-success {
    padding: 12px 16px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  </style>