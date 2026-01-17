<template>
  <div class="login-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="login-card">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2 class="fw-bold text-dark">Welcome Back</h2>
                <p class="text-muted">Login to your EatsBuddy account</p>
              </div>

              <form @submit.prevent="handleLogin">
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
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
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

                <!-- Login Button -->
                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>

                <!-- Register Link -->
                <div class="text-center">
                  <p class="mb-0">
                    Don't have an account?
                    <router-link to="/register" class="text-decoration-none fw-bold">
                      Register here
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
import { loginUser } from '@/services/authService'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''

      const result = await loginUser(this.email, this.password)

      if (result.success) {
        this.successMessage = 'Login successful! Redirecting...'
        
        // Check if there's a redirect query parameter
        const redirectPath = this.$route.query.redirect || '/home-page'
        
        setTimeout(() => {
          this.$router.push(redirectPath)
        }, 1500)
      } else {
        this.errorMessage = result.error || 'Login failed. Please try again.'
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-top: 80px;
  display: flex;
  align-items: center;
}

.login-card {
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
  .login-page {
    padding-top: 60px;
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .login-card {
    border-radius: 15px;
  }
  
  .login-card .card-body {
    padding: 2rem 1.5rem !important;
  }
  
  .login-card h2 {
    font-size: 1.5rem;
  }
  
  .login-card p {
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
}

@media (max-width: 576px) {
  .login-card .card-body {
    padding: 1.5rem 1rem !important;
  }
  
  .login-card h2 {
    font-size: 1.3rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .login-page {
    padding-top: 70px;
  }
  
  .col-lg-5 {
    flex: 0 0 60%;
    max-width: 60%;
  }
}
</style>
