<template>
  <div class="register-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="register-card">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-dark">Create Account</h2>
                <p class="text-muted">Join EatsBuddy today</p>
              </div>

              <form @submit.prevent="handleRegister">
                <!-- Username Field -->
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      v-model="username"
                      placeholder="Choose a username"
                      required
                      minlength="3"
                    />
                  </div>
                </div>

                <!-- Email Field -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <!-- Password Field -->
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      v-model="password"
                      placeholder="Create a password"
                      required
                      minlength="6"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <small class="text-muted">Password must be at least 6 characters</small>
                </div>

                <!-- Confirm Password Field -->
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
                </div>

                <!-- Success Message -->
                <div v-if="successMessage" class="alert alert-success" role="alert">
                  <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
                </div>

                <!-- Register Button -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Creating Account...' : 'Register' }}
                </button>

                <!-- Login Link -->
                <div class="text-center">
                  <p class="mb-0">
                    Already have an account?
                    <router-link to="/login" class="text-decoration-none fw-bold">
                      Login here
                    </router-link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser } from '@/services/authService'

export default {
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''

      // Validation
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match'
        this.loading = false
        return
      }

      if (this.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters'
        this.loading = false
        return
      }

      if (this.username.length < 3) {
        this.errorMessage = 'Username must be at least 3 characters'
        this.loading = false
        return
      }

      const result = await registerUser(this.email, this.password, this.username)

      if (result.success) {
        this.successMessage = 'Registration successful! Redirecting to home...'
        setTimeout(() => {
          this.$router.push('/home-page')
        }, 1500)
      } else {
        this.errorMessage = result.error || 'Registration failed. Please try again.'
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-top: 80px;
  display: flex;
  align-items: center;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.form-label {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.input-group-text {
  background: rgba(46, 125, 50, 0.1);
  border: 1px solid #dee2e6;
  color: #2e7d32;
}

.form-control {
  border: 1px solid #dee2e6;
  padding: 0.75rem 1rem;
  
  &:focus {
    border-color: #2e7d32;
    box-shadow: 0 0 0 0.2rem rgba(46, 125, 50, 0.25);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(46, 125, 50, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-outline-secondary {
  border-color: #dee2e6;
  color: #6c757d;
  
  &:hover {
    background: rgba(46, 125, 50, 0.1);
    border-color: #2e7d32;
    color: #2e7d32;
  }
}

a {
  color: #2e7d32;
  transition: color 0.3s ease;
  
  &:hover {
    color: #1b5e20;
  }
}

.alert {
  border-radius: 10px;
  border: none;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .register-page {
    padding-top: 60px;
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .register-card {
    border-radius: 15px;
  }
  
  .register-card .card-body {
    padding: 2rem 1.5rem !important;
  }
  
  .register-card h2 {
    font-size: 1.5rem;
  }
  
  .register-card p {
    font-size: 0.9rem;
  }
  
  .form-control {
    padding: 0.65rem 0.9rem;
    font-size: 0.9rem;
  }
  
  .input-group-text {
    padding: 0.65rem 0.9rem;
  }
  
  .btn-primary {
    padding: 0.65rem 1.25rem;
    font-size: 0.95rem;
  }
  
  .col-lg-5 {
    max-width: 100%;
  }
  
  .mb-3 small {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .register-card .card-body {
    padding: 1.5rem 1rem !important;
  }
  
  .register-card h2 {
    font-size: 1.3rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .register-page {
    padding-top: 70px;
  }
  
  .col-lg-5 {
    flex: 0 0 60%;
    max-width: 60%;
  }
}
</style>
