<template>
  <div class="profile-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="profile-card">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="profile-avatar mb-3">
                  <i class="fas fa-user-circle"></i>
                </div>
                <h2 class="fw-bold text-dark">My Profile</h2>
                <p class="text-muted">{{ currentUser?.email }}</p>
                <p class="fw-semibold">Username: {{ currentUser?.username }}</p>
              </div>

              <!-- Update Username Section -->
              <div class="profile-section mb-4">
                <h4 class="section-title">
                  <i class="fas fa-user me-2"></i>Update Username
                </h4>
                <form @submit.prevent="handleUpdateUsername">
                  <div class="mb-3">
                    <label for="newUsername" class="form-label">New Username</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        id="newUsername"
                        v-model="newUsername"
                        :placeholder="currentUser?.username || 'Enter new username'"
                        minlength="3"
                      />
                    </div>
                  </div>

                  <div v-if="usernameError" class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>{{ usernameError }}
                  </div>

                  <div v-if="usernameSuccess" class="alert alert-success" role="alert">
                    <i class="fas fa-check-circle me-2"></i>{{ usernameSuccess }}
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="usernameLoading || !newUsername"
                  >
                    <span v-if="usernameLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ usernameLoading ? 'Updating...' : 'Update Username' }}
                  </button>
                </form>
              </div>

              <!-- Update Password Section -->
              <div class="profile-section">
                <h4 class="section-title">
                  <i class="fas fa-lock me-2"></i>Change Password
                </h4>
                <form @submit.prevent="handleUpdatePassword">
                  <div class="mb-3">
                    <label for="currentPassword" class="form-label">Current Password</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-lock"></i>
                      </span>
                      <input
                        :type="showCurrentPassword ? 'text' : 'password'"
                        class="form-control"
                        id="currentPassword"
                        v-model="currentPassword"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showCurrentPassword = !showCurrentPassword"
                      >
                        <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="newPassword" class="form-label">New Password</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-key"></i>
                      </span>
                      <input
                        :type="showNewPassword ? 'text' : 'password'"
                        class="form-control"
                        id="newPassword"
                        v-model="newPassword"
                        placeholder="Enter new password"
                        required
                        minlength="6"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showNewPassword = !showNewPassword"
                      >
                        <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <small class="text-muted">Password must be at least 6 characters</small>
                  </div>

                  <div class="mb-3">
                    <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="fas fa-key"></i>
                      </span>
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="form-control"
                        id="confirmNewPassword"
                        v-model="confirmNewPassword"
                        placeholder="Confirm new password"
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

                  <div v-if="passwordError" class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>{{ passwordError }}
                  </div>

                  <div v-if="passwordSuccess" class="alert alert-success" role="alert">
                    <i class="fas fa-check-circle me-2"></i>{{ passwordSuccess }}
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="passwordLoading"
                  >
                    <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ passwordLoading ? 'Updating...' : 'Change Password' }}
                  </button>
                </form>
              </div>

              <!-- Back Button -->
              <div class="text-center mt-4">
                <router-link to="/home-page" class="btn btn-outline-secondary">
                  <i class="fas fa-arrow-left me-2"></i>Back to Home
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, isAuthenticated, updateUsername, updateUserPassword } from '@/services/authService'

export default {
  name: 'ProfilePage',
  data() {
    return {
      currentUser: null,
      newUsername: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      usernameLoading: false,
      passwordLoading: false,
      usernameError: '',
      usernameSuccess: '',
      passwordError: '',
      passwordSuccess: ''
    }
  },
  async mounted() {
    if (!isAuthenticated()) {
      this.$router.push('/login')
      return
    }

    this.currentUser = await getCurrentUser()
    if (!this.currentUser) {
      this.$router.push('/login')
    }
  },
  methods: {
    async handleUpdateUsername() {
      this.usernameLoading = true
      this.usernameError = ''
      this.usernameSuccess = ''

      if (this.newUsername.length < 3) {
        this.usernameError = 'Username must be at least 3 characters'
        this.usernameLoading = false
        return
      }

      const result = await updateUsername(this.newUsername)

      if (result.success) {
        this.usernameSuccess = 'Username updated successfully!'
        this.newUsername = ''
        // Refresh current user data
        this.currentUser = await getCurrentUser()
      } else {
        this.usernameError = result.error || 'Failed to update username'
      }

      this.usernameLoading = false
    },

    async handleUpdatePassword() {
      this.passwordLoading = true
      this.passwordError = ''
      this.passwordSuccess = ''

      if (this.newPassword !== this.confirmNewPassword) {
        this.passwordError = 'New passwords do not match'
        this.passwordLoading = false
        return
      }

      if (this.newPassword.length < 6) {
        this.passwordError = 'Password must be at least 6 characters'
        this.passwordLoading = false
        return
      }

      const result = await updateUserPassword(this.currentPassword, this.newPassword)

      if (result.success) {
        this.passwordSuccess = 'Password changed successfully!'
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmNewPassword = ''
      } else {
        this.passwordError = result.error || 'Failed to change password'
      }

      this.passwordLoading = false
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-top: 80px;
  display: flex;
  align-items: center;
}

.profile-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.profile-avatar {
  font-size: 5rem;
  color: #2e7d32;
}

.profile-section {
  padding: 2rem;
  background: rgba(46, 125, 50, 0.03);
  border-radius: 15px;
  border: 1px solid rgba(46, 125, 50, 0.1);
}

.section-title {
  color: #1a1a1a;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
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
  border-color: #6c757d;
  color: #6c757d;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6c757d;
    border-color: #6c757d;
    color: white;
    transform: translateY(-2px);
  }
}

.input-group .btn-outline-secondary {
  border-color: #dee2e6;
  color: #6c757d;
  padding: 0.75rem 1rem;
  
  &:hover {
    background: rgba(46, 125, 50, 0.1);
    border-color: #2e7d32;
    color: #2e7d32;
  }
}

.alert {
  border-radius: 10px;
  border: none;
}
/* Responsive Styles */
@media (max-width: 768px) {
  .profile-page {
    padding-top: 60px;
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .profile-card {
    border-radius: 15px;
  }
  
  .profile-card .card-body {
    padding: 2rem 1.5rem !important;
  }
  
  .profile-card h2 {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .form-control {
    padding: 0.65rem 0.9rem;
    font-size: 0.9rem;
  }
  
  .input-group-text {
    padding: 0.65rem 0.9rem;
  }
  
  .btn-primary, .btn-danger {
    padding: 0.65rem 1.25rem;
    font-size: 0.95rem;
  }
  
  .col-lg-8 {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .profile-card .card-body {
    padding: 1.5rem 1rem !important;
  }
  
  .profile-card h2 {
    font-size: 1.3rem;
  }
  
  .profile-avatar i {
    font-size: 4rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .profile-page {
    padding-top: 70px;
  }
  
  .col-lg-8 {
    flex: 0 0 75%;
    max-width: 75%;
  }
}
</style>
