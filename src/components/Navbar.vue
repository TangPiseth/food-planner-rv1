<template>
  <nav class="navbar navbar-expand-lg EG-Default navbar-light fixed-top" id="mainNav">
    <svg style="display: none">
      <filter id="glass-distortion-navbar">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="1" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
    </svg>

    <div class="container px-3 px-sm-4 px-lg-5">
      <!-- Logo Glass Bubble -->
      <div class="logo-glass-bubble">
        <div class="glass-filter"></div>
        <div class="glass-overlay"></div>
        <div class="glass-specular"></div>
        <a class="navbar-brand fs-4 fw-bold" href="#">EatsBuddy</a>
      </div>

      <!-- Mobile Menu Toggler (only visible on screens smaller than lg) -->
      <button class="navbar-toggler navbar-toggler-right d-lg-none" type="button"
        aria-controls="navbarContent" :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
        @click="toggleMobileMenu"
        aria-label="Toggle navigation">
        <span>Menu</span>
        <i class="fas fa-bars"></i>
      </button>

      <!-- Mobile Collapse Menu -->
      <div class="collapse navbar-collapse z-3" :class="{ show: mobileMenuOpen }" id="navbarContent">
        <div class="mobile-menu-glass-bubble">
          <div class="glass-filter"></div>
          <div class="glass-overlay"></div>
          <div class="glass-specular"></div>

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
              <router-link to="/image-scanner" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-camera-retro me-2"></i>AI Image Scanner
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
            <li v-if="currentUser?.role === 'admin'" class="nav-item">
              <router-link to="/admin" class="nav-link" @click="closeOffcanvas">
                <i class="fas fa-user-shield me-2"></i>Admin Dashboard
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
          </ul>
        </div>
      </div>

      <!-- Desktop Menu Glass Bubble -->
      <div class="menu-glass-bubble d-none d-lg-flex">
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
            <router-link to="/image-scanner" class="nav-link">AI Scanner</router-link>
          </li>
          <li class="nav-item mx-lg-2">
            <router-link to="/meal-planner" class="nav-link">Meal Planner</router-link>
          </li>
          <li class="nav-item mx-lg-2">
            <router-link to="/grocery-list" class="nav-link">Grocery List</router-link>
          </li>
          <li v-if="currentUser?.role === 'admin'" class="nav-item mx-lg-2">
            <router-link to="/admin" class="nav-link">Admin Dashboard</router-link>
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
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { getCurrentUser, isAuthenticated } from '@/services/authService'

export default {
  name: "Navbar",
  data() {
    return {
      currentUser: null,
      authCheckInterval: null,
      mobileMenuOpen: false
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
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeOffcanvas() {
      this.mobileMenuOpen = false
    },
  }
};
</script>

<style lang="scss">
/* Default navbar */
#mainNav {
  transition: all 0.3s ease-in-out;
  background: transparent;
  backdrop-filter: none;
  border-bottom: none;
  padding: 18px 0;
}

#mainNav .container {
  position: relative;
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

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
    align-items: center;
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
  margin-left: 0.18rem !important;
  margin-right: 0.18rem !important;
}

.menu-glass-bubble .nav-link {
  color: #1a1a1a !important;
  font-weight: 500;
  padding: 7px 10px !important;
  border-radius: 14px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-size: clamp(0.8rem, 0.92vw, 0.95rem);
  white-space: nowrap;

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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.56);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.62rem 0.95rem;
  border-radius: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  
  &:hover {
    background: rgba(255, 255, 255, 0.78);
    border-color: rgba(46, 125, 50, 0.22);
    transform: translateY(-2px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 8px 28px rgba(46, 125, 50, 0.14);
  }

  &:focus-visible {
    outline: 2px solid rgba(46, 125, 50, 0.45);
    outline-offset: 3px;
  }
  
  i {
    color: #2e7d32;
  }
}

/* Mobile Collapse Menu */
#navbarContent {
  position: absolute;
  top: calc(100% + 10px);
  left: 16px;
  right: 16px;
  z-index: 1050;
  height: auto !important;
  overflow: visible !important;
}

#navbarContent.collapsing {
  display: block !important;
  height: auto !important;
  overflow: visible !important;
  transition: none;
}

#navbarContent.show {
  display: block;
  height: auto !important;
  overflow: visible !important;
}

.mobile-menu-glass-bubble {
  --bg-color: rgba(255, 255, 255, 0.78);
  --highlight: rgba(255, 255, 255, 0.94);
  position: relative;
  width: 100%;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.66);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(46, 125, 50, 0.1), transparent 36%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 248, 0.92) 100%);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(18px);

  .glass-filter,
  .glass-overlay,
  .glass-specular {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
  }

  .glass-filter {
    z-index: 1;
    backdrop-filter: blur(8px);
    filter: url(#glass-distortion-navbar) saturate(120%) brightness(1.12);
  }

  .glass-overlay {
    z-index: 2;
    background: var(--bg-color);
  }

  .glass-specular {
    z-index: 3;
    box-shadow: inset 1px 1px 1px var(--highlight);
  }

  .navbar-nav {
    position: relative;
    z-index: 4;
    width: 100%;
  }

  .nav-item {
    width: 100%;
    margin-bottom: 8px;
  }

  .nav-link {
    color: #1a1a1a !important;
    padding: 14px 16px;
    font-weight: 700;
    border-radius: 18px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.58);
    border: 1px solid rgba(255, 255, 255, 0.68);
    min-height: 54px;
    letter-spacing: -0.2px;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);

    i {
      color: #2e7d32;
      width: 34px;
      font-size: 1.25rem;
    }

    &:hover {
      background: rgba(220, 252, 231, 0.72);
      color: #2e7d32 !important;
      transform: translateX(4px);
      border-color: rgba(46, 125, 50, 0.16);
    }

    &.router-link-active {
      background: linear-gradient(135deg, rgba(46, 125, 50, 0.15) 0%, rgba(46, 125, 50, 0.08) 100%);
      color: #2e7d32 !important;
      border-color: rgba(46, 125, 50, 0.2);
      font-weight: 700;
      
      i {
        color: #1b5e20;
      }
    }
  }

  hr {
    position: relative;
    z-index: 4;
    border-color: rgba(46, 125, 50, 0.15);
    opacity: 1;
    margin: 18px 0;
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
@media (max-width: 991.98px) {
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
    display: inline-flex;
  }
}

/* Desktop - keep transparent */
@media (min-width: 992px) {
  #mainNav {
    background: transparent !important;
    backdrop-filter: none !important;
  }
  
  #mainNav.navbar-shrink {
    background: transparent !important;
  }

  .menu-glass-bubble {
    max-width: calc(100vw - 230px);
  }

  .menu-glass-bubble .navbar-nav {
    flex-wrap: nowrap;
  }
}

@media (max-width: 768px) {
  #mainNav {
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(12px);
    padding: 14px 0;
    -webkit-backdrop-filter: blur(12px);
  }
  
  .logo-glass-bubble {
    padding: 10px 18px;

    .navbar-brand {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
  }
  
  .navbar-toggler {
    padding: 0.68rem 1.05rem;
    font-size: 1rem;
    min-height: 50px;
    border-radius: 14px;
  }
}

@media (max-width: 576px) {
  #mainNav {
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 12px 0;
  }

  .logo-glass-bubble {
    padding: 10px 18px;

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  .navbar-toggler {
    padding: 0.72rem 1.1rem;
    font-size: 1rem;
    min-height: 52px;
    font-weight: 700;
    
    i {
      font-size: 1.15rem;
    }
  }
  
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 480px) {
  #mainNav {
    padding: 10px 0;
  }

  .logo-glass-bubble {
    padding: 10px 16px;
    border-radius: 16px;

    .navbar-brand {
      font-size: 1.45rem;
    }
  }

  .navbar-toggler {
    padding: 0.72rem 1.05rem;
    font-size: 0.98rem;
    min-height: 50px;
    border-radius: 16px;
    
    i {
      font-size: 1.12rem;
    }
  }
  .mobile-menu-glass-bubble {
    padding: 14px;
    border-radius: 22px;
  }

  .mobile-menu-glass-bubble .nav-link {
    font-size: 1rem;
    padding: 14px 16px;
    min-height: 54px;
    border-radius: 16px;
    
    i {
      width: 36px;
      font-size: 1.25rem;
    }
  }
  
  .mobile-menu-glass-bubble hr {
    margin: 20px 0;
  }
  
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
}

/* Ensure desktop glass menu is visible on lg and above */
@media (min-width: 992px) {
  .navbar-toggler {
    display: none !important;
  }
  
  .menu-glass-bubble {
    display: flex !important;
  }
  #navbarContent {
    display: none !important;
  }
}
</style>