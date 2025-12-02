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

      <!-- Mobile Menu Toggler -->
      <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" aria-expanded="false"
        aria-label="Toggle navigation">
        Menu
        <i class="fas fa-bars"></i>
      </button>

      <!-- Offcanvas Menu (Mobile) -->
      <!-- <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 id="offcanvasRightLabel">Menu</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav ms-auto fs-5">
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
            <li class="nav-item mx-lg-2 dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Others
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/faq" class="dropdown-item">FAQ</router-link>
                </li>
                <li>
                  <router-link to="/contact" class="dropdown-item">Contact</router-link>
                </li>
                <li>
                  <router-link to="/about" class="dropdown-item">About Us</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div> -->

      <!-- Desktop Menu Glass Bubble -->
      <div class="menu-glass-bubble d-none d-xl-flex">
        <div class="glass-filter"></div>
        <div class="glass-overlay"></div>
        <div class="glass-specular"></div>
        
        <ul class="navbar-nav ms-auto fs-5 position-relative">
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
          <!-- <li class="nav-item mx-lg-2 dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              Others
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link to="/faq" class="dropdown-item">FAQ</router-link>
              </li>
              <li>
                <router-link to="/contact" class="dropdown-item">Contact</router-link>
              </li>
              <li>
                <router-link to="/about" class="dropdown-item">About Us</router-link>
              </li>
            </ul>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import * as bootstrap from 'bootstrap'

export default {
  name: "Navbar",
  mounted() {
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

    // Collapse responsive navbar on link click
    const navbarToggler = document.body.querySelector(".navbar-toggler");
    const responsiveNavItems = [].slice.call(
      document.querySelectorAll(".offcanvas-body .nav-link")
    );

    responsiveNavItems.forEach((responsiveNavItem) =>
      responsiveNavItem.addEventListener("click", () => {
        if (window.getComputedStyle(navbarToggler).display !== "none") {
          const offcanvasMenu = document.querySelector("#offcanvasRight");
          const bootstrapOffcanvas =
            bootstrap.Offcanvas.getInstance(offcanvasMenu);
          bootstrapOffcanvas.hide();
        }
      })
    );
  },
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
  padding: 8px 20px;
  border-radius: 24px;
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
    font-size: 1.3rem;
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
  border-radius: 28px;
  overflow: hidden;
  padding: 8px 24px;
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
    gap: 8px;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(46, 125, 50, 0.12);
  }
}

/* Nav Links Styling */
.menu-glass-bubble .nav-link {
  color: #1a1a1a !important;
  font-weight: 500;
  padding: 8px 16px !important;
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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

/* Dropdown Toggle Visibility */
.menu-glass-bubble .dropdown-toggle {
  color: #1a1a1a !important;
  
  &::after {
    color: #2e7d32;
    margin-left: 6px;
  }

  &:hover {
    color: #2e7d32 !important;
  }

  &.show {
    color: #2e7d32 !important;
  }
}

/* Dropdown Menu Styling */
.menu-glass-bubble .dropdown-menu {
  display: none;
  position: absolute;
  z-index: 1010;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 251, 0.95) 100%);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin-top: 12px;
  padding: 12px 8px;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

.menu-glass-bubble .nav-item.dropdown:hover .dropdown-menu,
.menu-glass-bubble .dropdown-menu.show {
  display: block;
}

.menu-glass-bubble .dropdown-item {
  color: #1a1a1a;
  padding: 10px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba(46, 125, 50, 0.12);
    color: #2e7d32;
    transform: translateX(4px);
  }

  &.active {
    background: rgba(46, 125, 50, 0.18);
    color: #2e7d32;
  }
}

/* Mobile Menu Toggler */
.navbar-toggler {
  color: #1a1a1a;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(46, 125, 50, 0.25);
  }
}

/* Offcanvas Menu (Mobile) */
.offcanvas {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  backdrop-filter: blur(4px);
}

.offcanvas-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px 24px;
}

.offcanvas-header h5 {
  color: #1a1a1a;
  font-weight: 700;
}

.offcanvas-body .nav-link {
  color: #1a1a1a !important;
  padding: 12px 16px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin: 6px 0;

  &:hover {
    background: rgba(46, 125, 50, 0.1);
    color: #2e7d32 !important;
    transform: translateX(4px);
  }

  &.router-link-active {
    background: rgba(46, 125, 50, 0.15);
    color: #2e7d32 !important;
  }
}

.offcanvas-body .dropdown-menu {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(46, 125, 50, 0.1);
  border-radius: 12px;
  padding: 8px;
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
}

@media (max-width: 576px) {
  #mainNav {
    background: transparent !important;
  }

  .logo-glass-bubble {
    padding: 6px 14px;

    .navbar-brand {
      font-size: 1rem;
    }
  }

  .navbar-toggler {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
}
</style>