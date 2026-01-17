<template>
  <nav class="navbar navbar-expand-xl EG-Default navbar-light fixed-top" id="mainNav">
    <svg style="display: none">
      <filter id="glass-distortion-navbar">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="1" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
    </svg>

    <div class="container px-4 px-lg-5">
      <!-- Logo Glass Bubble -->
      <div class="logo-glass-bubble">
        <div class="glass-filter"></div>
        <div class="glass-overlay"></div>
        <div class="glass-specular"></div>
        <a class="navbar-brand fs-4 fw-bold" href="#">EatsBuddy</a>
      </div>

      <!-- Mobile Menu Toggler (only visible on screens smaller than xl) -->
      <button class="navbar-toggler navbar-toggler-right d-xl-none" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#mobileOffcanvasMenu" aria-controls="mobileOffcanvasMenu" aria-expanded="false"
        aria-label="Toggle navigation">
        Menu
        <i class="fas fa-bars"></i>
      </button>

      <!-- Mobile Offcanvas Menu -->
      <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileOffcanvasMenu" aria-labelledby="mobileOffcanvasMenuLabel" data-bs-backdrop="true" data-bs-scroll="false">
        <div class="offcanvas-header">
          <h5 id="mobileOffcanvasMenuLabel" class="offcanvas-title">
            <i class="fas fa-utensils me-2"></i>EatsBuddy
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/home-page" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-home me-2"></i>Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/recipes" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-book-open me-2"></i>Recipes
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/meal-planner" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-calendar-alt me-2"></i>Meal Planner
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/grocery-list" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-shopping-cart me-2"></i>Grocery List
              </router-link>
            </li>
            
            <hr class="my-3">
            
            <li class="nav-item">
              <router-link to="/faq" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-question-circle me-2"></i>FAQ
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-envelope me-2"></i>Contact
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-info-circle me-2"></i>About Us
              </router-link>
            </li>
            
            <hr class="my-3">
            
            <!-- Mobile User Authentication Links -->
            <li v-if="!currentUser" class="nav-item">
              <router-link to="/login" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-sign-in-alt me-2"></i>Login
              </router-link>
            </li>
            <li v-if="!currentUser" class="nav-item">
              <router-link to="/register" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-user-plus me-2"></i>Register
              </router-link>
            </li>
            
            <!-- Mobile Logged In User -->
            <li v-if="currentUser" class="nav-item">
              <router-link to="/profile" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-user-circle me-2"></i>{{ currentUser.username }}
              </router-link>
            </li>
            <li v-if="currentUser" class="nav-item">
              <a href="#" @click.prevent="handleLogoutAndClose" class="nav-link">
                <i class="fas fa-sign-out-alt me-2"></i>Logout
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Desktop Menu Glass Bubble -->
      <div class="menu-glass-bubble d-none d-xl-flex">
        <div class="glass-filter"></div>
        <div class="glass-overlay"></div>
        <div class="glass-specular"></div>
        
        <ul class="navbar-nav ms-auto position-relative">
          <li class="nav-item mx-lg-2">
            <router-link to="/home-page" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item mx-lg-2">
            <router-link to="/recipes" class="nav-link">Recipes</router-link>
          </li>
          <li class="nav-item mx-lg-2">
            <router-link to="/meal-planner" class="nav-link">Meal Planner</router-link>
          </li>
          <li class="nav-item mx-lg-2">
            <router-link to="/grocery-list" class="nav-link">Grocery List</router-link>
          </li>
          
          <!-- User Authentication Links -->
          <li v-if="!currentUser" class="nav-item mx-lg-2">
            <router-link to="/login" class="nav-link user-link">
              <i class="fas fa-sign-in-alt me-1"></i>Login
            </router-link>
          </li>
          <li v-if="!currentUser" class="nav-item mx-lg-2">
            <router-link to="/register" class="nav-link user-link">
              <i class="fas fa-user-plus me-1"></i>Register
            </router-link>
          </li>
          
          <!-- Logged In User -->
          <li v-if="currentUser" class="nav-item mx-lg-2">
            <router-link to="/profile" class="nav-link user-info">
              <i class="fas fa-user-circle me-1"></i>{{ currentUser.username }}
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item mx-lg-2">
            <a href="#" @click.prevent="handleLogout" class="nav-link user-link">
              <i class="fas fa-sign-out-alt me-1"></i>Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import * as bootstrap from 'bootstrap'
import { getCurrentUser, logoutUser, isAuthenticated } from '@/services/authService'

export default {
  name: "Navbar",
  data() {
    return {
      currentUser: null,
      authCheckInterval: null
    }
  },
  async mounted() {
    // Check initial auth state
    await this.checkAuthState()

    // Poll for auth state changes every 2 seconds
    this.authCheckInterval = setInterval(async () => {
      await this.checkAuthState()
    }, 2000)

    // Navbar shrink function
    const navbarShrink = () => {
      const navbarCollapsible = document.body.querySelector("#mainNav");
      if (!navbarCollapsible) return;

      if (window.scrollY === 0) {
        navbarCollapsible.classList.remove("navbar-shrink");
      } else {
        navbarCollapsible.classList.add("navbar-shrink");
      }
    };

    // Shrink navbar on page load
    navbarShrink();

    // Shrink navbar when page is scrolled
    document.addEventListener("scroll", navbarShrink);
    
    // Handle offcanvas cleanup on hide
    const offcanvasElement = document.getElementById('mobileOffcanvasMenu')
    if (offcanvasElement) {
      offcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
        // Clean up backdrop and body styles after offcanvas is fully hidden
        const backdrop = document.querySelector('.offcanvas-backdrop')
        if (backdrop) {
          backdrop.remove()
        }
        document.body.classList.remove('modal-open')
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      })
    }
  },
  beforeUnmount() {
    // Clear the interval when component is destroyed
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval)
    }
  },
  methods: {
    async checkAuthState() {
      if (isAuthenticated()) {
        const user = await getCurrentUser()
        this.currentUser = user
      } else {
        this.currentUser = null
      }
    },
    closeOffcanvas() {
      // Close the offcanvas menu when a link is clicked
      const offcanvasElement = document.getElementById('mobileOffcanvasMenu')
      if (offcanvasElement) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement)
        if (offcanvasInstance) {
          offcanvasInstance.hide()
        }
      }
      // The cleanup is now handled by the 'hidden.bs.offcanvas' event listener in mounted()
    },
    async handleLogout() {
      try {
        await logoutUser()
        this.currentUser = null
        this.$router.push('/home-page')
      } catch (error) {
        console.error('Logout error:', error)
        alert('Failed to logout. Please try again.')
      }
    },
    async handleLogoutAndClose() {
      this.closeOffcanvas()
      await this.handleLogout()
    }
  }
};
</script>

<style>
/* Default navbar */
#mainNav {
  transition: all 0.3s ease-in-out;
  background: transparent;
  backdrop-filter: none;
  border-bottom: none;
}

/* Navbar shrink */
.navbar-shrink {
  background: transparent;
  backdrop-filter: blur(4px);
}

/* .navbar-shrink {
  background: linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(232, 236, 241, 0.95) 100%) !important;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
} backup navbar shrink (non LG)*/

/* Logo Glass Bubble */
.logo-glass-bubble {
  --bg-color: rgba(255, 255, 255, 0.45);
  --highlight: rgba(255, 255, 255, 0.85);
  position: relative;
  padding: 6px 14px;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-width: fit-content;
  transition: all 0.3s ease;

  .glass-filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    filter: url(#glass-distortion-navbar) saturate(120%) brightness(1.15);
    z-index: 1;
  }

  .glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-color);
    z-index: 2;
  }

  .glass-specular {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 1px 1px 1px var(--highlight);
    z-index: 3;
    pointer-events: none;
  }

  .navbar-brand {
    position: relative;
    z-index: 4;
    color: #1a1a1a !important;
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(46, 125, 50, 0.15);
  }
}

/* Menu Glass Bubble Container */
.menu-glass-bubble {
  --bg-color: rgba(255, 255, 255, 0.4);
  --highlight: rgba(255, 255, 255, 0.9);
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  padding: 6px 16px;
  margin-left: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  .glass-filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    filter: url(#glass-distortion-navbar) saturate(120%) brightness(1.15);
    z-index: 1;
  }

  .glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-color);
    z-index: 2;
  }

  .glass-specular {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 1px 1px 2px var(--highlight), inset -1px -1px 2px rgba(0, 0, 0, 0.03);
    z-index: 3;
    pointer-events: none;
  }

  .navbar-nav {
    z-index: 4;
    gap: 4px;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(46, 125, 50, 0.12);
  }
}

/* Nav Links Styling */
.menu-glass-bubble .nav-item {
  display: flex;
  align-items: center;
  margin-top: 3px;
}

.menu-glass-bubble .nav-link {
  color: #1a1a1a !important;
  font-weight: 500;
  padding: 6px 12px !important;
  border-radius: 14px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-size: 0.95rem;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(46, 125, 50, 0.15);
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
    z-index: -1;
  }

  &:hover {
    color: #2e7d32 !important;
    background: rgba(46, 125, 50, 0.08);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
    transform: translateY(-2px);

    &::before {
      width: 100px;
      height: 100px;
    }
  }

  &.router-link-active {
    color: #2e7d32 !important;
    background: rgba(46, 125, 50, 0.12);
    box-shadow: inset 0 2px 6px rgba(46, 125, 50, 0.2);
  }
}

/* User Authentication Links */
.menu-glass-bubble .user-link {
  color: #1a1a1a !important;
  font-weight: 600;
  
  i {
    font-size: 0.9rem;
  }
  
  &:hover {
    color: #2e7d32 !important;
  }
}

.menu-glass-bubble .user-info {
  color: #2e7d32 !important;
  font-weight: 600;
  background: rgba(46, 125, 50, 0.08);
  
  i {
    font-size: 1rem;
  }
  
  &:hover {
    background: rgba(46, 125, 50, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
  }
}

/* Mobile Menu Toggler */
.navbar-toggler {
  color: #1a1a1a;
  border: 2px solid rgba(46, 125, 50, 0.2);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  
  &:hover {
    background: rgba(46, 125, 50, 0.1);
    border-color: rgba(46, 125, 50, 0.3);
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(46, 125, 50, 0.25);
  }
  
  i {
    margin-left: 0.5rem;
    color: #2e7d32;
  }
}

/* Mobile Offcanvas Menu */
.offcanvas {
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  width: 320px !important;
  max-width: 85vw !important;
}

/* Offcanvas backdrop styling */
.offcanvas-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  
  &.show {
    opacity: 0.5;
  }
}

/* Hide offcanvas on desktop */
@media (min-width: 1200px) {
  .offcanvas {
    display: none !important;
  }
  
  .offcanvas-backdrop {
    display: none !important;
  }
}

.offcanvas-header {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  border-bottom: none;
  padding: 24px 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 70px;
}

.offcanvas-title {
  color: white !important;
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  
  i {
    font-size: 1.6rem;
  }
}

.offcanvas-header .btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
}

.offcanvas-body {
  padding: 16px;
}

.offcanvas-body .navbar-nav {
  width: 100%;
}

.offcanvas-body .nav-item {
  width: 100%;
  margin-bottom: 4px;
}

.offcanvas-body .nav-link {
  color: #1a1a1a !important;
  padding: 16px 18px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  background: transparent;
  border: 2px solid transparent;
  min-height: 56px;

  i {
    color: #2e7d32;
    width: 28px;
    font-size: 1.3rem;
  }

  &:hover {
    background: rgba(46, 125, 50, 0.08);
    color: #2e7d32 !important;
    transform: translateX(4px);
    border-color: rgba(46, 125, 50, 0.1);
  }

  &.router-link-active {
    background: linear-gradient(135deg, rgba(46, 125, 50, 0.15) 0%, rgba(46, 125, 50, 0.08) 100%);
    color: #2e7d32 !important;
    border-color: rgba(46, 125, 50, 0.2);
    font-weight: 600;
    
    i {
      color: #1b5e20;
    }
  }
}

.offcanvas-body hr {
  border-color: rgba(46, 125, 50, 0.15);
  opacity: 1;
  margin: 12px 0;
}

/* iPhone and small mobile specific */
@media (max-width: 390px) {
  .offcanvas {
    width: 90vw !important;
  }
  
  .offcanvas-title {
    font-size: 1.4rem;
  }
  
  .offcanvas-body .nav-link {
    font-size: 1.05rem;
    padding: 15px 16px;
  }
  
  .navbar-toggler {
    font-size: 1.05rem;
    padding: 0.6rem 1.1rem;
  }
  
  .logo-glass-bubble .navbar-brand {
    font-size: 1.3rem;
  }
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1199px) {
  .navbar {
    padding: 12px 0;
  }

  .logo-glass-bubble {
    padding: 6px 16px;

    .navbar-brand {
      font-size: 1.1rem;
    }
  }
  
  /* Hide desktop glass menu on smaller screens */
  .menu-glass-bubble {
    display: none !important;
  }
  
  /* Show mobile toggler */
  .navbar-toggler {
    display: block;
  }
}

@media (max-width: 991px) {
  .navbar {
    padding: 10px 0;
  }
  
  /* Ensure desktop menu is hidden */
  .menu-glass-bubble {
    display: none !important;
  }
}

/* Desktop - keep transparent */
@media (min-width: 1200px) {
  #mainNav {
    background: transparent !important;
    backdrop-filter: none !important;
  }
  
  #mainNav.navbar-shrink {
    background: transparent !important;
  }
}

@media (max-width: 768px) {
  #mainNav {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(8px);
    padding: 12px 0;
  }
  
  .logo-glass-bubble {
    padding: 8px 16px;

    .navbar-brand {
      font-size: 1.3rem;
    }
  }
  
  .navbar-toggler {
    padding: 0.6rem 1.2rem;
    font-size: 1.1rem;
    min-height: 48px;
    min-width: 90px;
  }
}

@media (max-width: 576px) {
  #mainNav {
    background: rgba(255, 255, 255, 0.98) !important;
    padding: 10px 0;
  }

  .logo-glass-bubble {
    padding: 8px 16px;

    .navbar-brand {
      font-size: 1.4rem;
    }
  }

  .navbar-toggler {
    padding: 0.65rem 1.3rem;
    font-size: 1.15rem;
    min-height: 50px;
    min-width: 95px;
    
    i {
      font-size: 1.2rem;
    }
  }
  
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
}

/* Ensure desktop glass menu is visible on xl and above */
@media (min-width: 1200px) {
  .navbar-toggler {
    display: none !important;
  }
  
  .menu-glass-bubble {
    display: flex !important;
  }
  
  /* Force hide offcanvas and backdrop on desktop */
  .offcanvas,
  .offcanvas-backdrop {
    display: none !important;
    visibility: hidden !important;
  }
}
</style>