<template>
  <div class="register-page overflow-hidden EG-Default">
    <svg class="glass-filter-defs" aria-hidden="true" focusable="false">
      <filter id="glass-distortion-register">
        <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="54" />
      </filter>
    </svg>

    <div class="container auth-container px-3 px-sm-4 py-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-12 d-flex justify-content-center">
          <div class="register-card auth-card w-100 mw-100">
            <div class="glass-filter"></div>
            <div class="glass-overlay"></div>
            <div class="glass-specular"></div>
            <div class="glass-distortion-overlay"></div>

            <div class="card-body auth-card-body p-3 p-sm-4 p-md-5">
              <div class="text-center mb-4">
                <div class="auth-icon mx-auto mb-3">
                  <i class="fas fa-user-plus"></i>
                </div>
                <span class="auth-kicker">Join EatsBuddy</span>
                <h2 class="fw-bold text-wrap register-heading mb-2">Create Account</h2>
                <p class="auth-subtitle text-wrap mb-0">Start planning meals, saving recipes, and building easier grocery lists.</p>
              </div>

              <form class="auth-form" @submit.prevent="handleRegister">
                <!-- Username Field -->
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <div class="input-group auth-input-group">
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
                  <div class="input-group auth-input-group">
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
                  <div class="input-group auth-input-group">
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
                  <small class="password-help">Password must be at least 6 characters</small>
                </div>

                <!-- Confirm Password Field -->
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <div class="input-group auth-input-group">
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
                  class="btn btn-primary auth-submit-btn w-100 mb-3"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Creating Account...' : 'Register' }}
                </button>

                <!-- Login Link -->
                <div class="auth-switch text-center">
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
  position: relative;
  background:
    radial-gradient(circle at 12% 18%, rgba(22, 101, 52, 0.14), transparent 30%),
    radial-gradient(circle at 88% 12%, rgba(59, 130, 246, 0.08), transparent 28%),
    linear-gradient(135deg, #f5f7fa 0%, #eef5ef 100%);
  padding-top: clamp(104px, 12vw, 128px);
  padding-bottom: clamp(32px, 7vw, 64px);
  display: flex;
  align-items: center;
}

.register-page::before,
.register-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.register-page::before {
  top: -180px;
  right: -100px;
  width: 420px;
  height: 420px;
  background: rgba(76, 175, 80, 0.12);
  filter: blur(70px);
}

.register-page::after {
  bottom: -160px;
  left: -110px;
  width: 360px;
  height: 360px;
  background: rgba(33, 150, 243, 0.08);
  filter: blur(75px);
}

.glass-filter-defs {
  position: absolute;
  width: 0;
  height: 0;
}

.auth-container {
  position: relative;
  z-index: 1;
}

.register-heading {
  color: #0f172a;
  font-size: clamp(2rem, 7vw, 2.7rem);
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.auth-card {
  --bg-color: rgba(255, 255, 255, 0.64);
  --highlight: rgba(255, 255, 255, 0.92);
  --text: #111827;

  position: relative;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
}

.register-card {
  max-width: 500px;
}

.glass-filter,
.glass-overlay,
.glass-specular,
.glass-distortion-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.glass-filter {
  z-index: 1;
  backdrop-filter: blur(14px);
  filter: url(#glass-distortion-register) saturate(120%) brightness(1.08);
}

.glass-overlay {
  z-index: 2;
  background:
    linear-gradient(135deg, var(--bg-color) 0%, rgba(255, 255, 255, 0.48) 100%),
    radial-gradient(circle at top left, rgba(187, 247, 208, 0.38), transparent 35%);
}

.glass-specular {
  z-index: 3;
  box-shadow:
    inset 1px 1px 1px var(--highlight),
    inset -1px -1px 1px rgba(255, 255, 255, 0.28);
}

.glass-distortion-overlay {
  z-index: 4;
  background:
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at 82% 76%, rgba(187, 247, 208, 0.16), transparent 30%);
  pointer-events: none;
}

.auth-card-body {
  position: relative;
  z-index: 5;
  padding: clamp(1.35rem, 4.8vw, 3rem) !important;
  color: var(--text);
}

.auth-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  color: #166534;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 22px;
  font-size: 1.5rem;
  box-shadow: 0 14px 34px rgba(22, 101, 52, 0.14);
}

.auth-kicker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  padding: 0.45rem 0.8rem;
  color: #166534;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.auth-subtitle {
  color: #4b5563;
  font-size: clamp(1rem, 2.6vw, 1.08rem);
  line-height: 1.65;
}

.auth-form {
  margin-top: 1.4rem;
}

.form-label {
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
  font-size: clamp(1rem, 2.4vw, 1.05rem);
}

.input-group-text {
  min-width: 52px;
  justify-content: center;
  background: rgba(220, 252, 231, 0.8);
  border: 1px solid rgba(187, 247, 208, 0.9);
  color: #166534;
  font-size: 1.05rem;
}

.form-control {
  min-height: 54px;
  border: 1px solid rgba(209, 213, 219, 0.86);
  padding: 0.85rem 1rem;
  color: #111827;
  background: rgba(255, 255, 255, 0.74);
  font-size: 1rem;
  font-weight: 600;
  backdrop-filter: blur(3px);
}

.form-control::placeholder {
  color: #6b7280;
  font-weight: 500;
}

.form-control:focus {
  border-color: #166534;
  box-shadow: 0 0 0 0.22rem rgba(22, 101, 52, 0.15);
  background: rgba(255, 255, 255, 0.92);
}

.btn-primary {
  min-height: 54px;
  background: #166534;
  border: none;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 900;
  border-radius: 999px;
  box-shadow: 0 16px 34px rgba(22, 101, 52, 0.24);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #14532d;
  box-shadow: 0 20px 42px rgba(22, 101, 52, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline-secondary {
  min-width: 52px;
  border-color: rgba(209, 213, 219, 0.86);
  color: #4b5563;
  background: rgba(255, 255, 255, 0.68);
}

.btn-outline-secondary:hover {
  background: #dcfce7;
  border-color: #166534;
  color: #166534;
}

a {
  color: #166534;
  transition: color 0.3s ease;
}

a:hover {
  color: #14532d;
}

.password-help,
.auth-switch {
  color: #4b5563;
  font-size: clamp(1rem, 2.5vw, 1.05rem);
  line-height: 1.6;
}

.password-help {
  display: block;
  margin-top: 0.45rem;
  font-weight: 600;
}

.alert {
  border-radius: 16px;
  border: none;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
}

.alert-danger {
  background: rgba(254, 226, 226, 0.9);
  color: #991b1b;
}

.alert-success {
  background: rgba(220, 252, 231, 0.9);
  color: #14532d;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .register-page {
    align-items: flex-start;
    padding-top: 96px;
  }

  .auth-card {
    border-radius: 24px;
  }

  .auth-icon {
    width: 58px;
    height: 58px;
    border-radius: 20px;
  }

  .form-control {
    min-height: 54px;
    padding: 0.85rem 0.95rem;
    font-size: 1rem;
  }

  .input-group-text {
    min-width: 50px;
    padding: 0.85rem 0.9rem;
  }

  .btn-primary {
    min-height: 54px;
    padding: 0.85rem 1.25rem;
    font-size: 1rem;
  }

  .password-help {
    font-size: 1rem;
  }
}

@media (max-width: 420px) {
  .auth-card-body {
    padding: 1.2rem !important;
  }

  .register-heading {
    font-size: 2rem;
  }

  .auth-subtitle,
  .auth-switch,
  .password-help,
  .form-label,
  .form-control,
  .alert {
    font-size: 1rem;
  }
}
</style>
