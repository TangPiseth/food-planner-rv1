<template>
  <div class="app-shell EG-Default">
    <!-- Loading Overlay -->
    <div class="loading-overlay" v-if="isLoading">
      <svg style="display: none">
        <filter id="glass-distortion-loading">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="2" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div class="glass-loading-card">
        <div class="glass-filter"></div>
        <div class="glass-overlay"></div>
        <div class="glass-specular"></div>
        <div class="glass-distortion-layer"></div>
        
        <div class="loading-content">
          <div class="spinner-container">
            <i class="fas fa-spinner fa-spin spinner-icon"></i>
          </div>
          <p class="loading-text">Loading...</p>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import 'aos/dist/aos.css';
import AOS from 'aos';

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      isLoading: true
    }
  },
  mounted() {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
    
    // Hide loading after initial page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000); // 1 second delay to ensure everything is loaded
    });
  },
  watch: {
    $route() {
      // Show loading on route change
      this.isLoading = true;
      // Hide loading after a short delay
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(46, 125, 50, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    top: 10%;
    left: 10%;
    filter: blur(60px);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(23, 185, 122, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    bottom: 5%;
    right: 15%;
    filter: blur(80px);
    pointer-events: none;
  }
}

.glass-loading-card {
  position: relative;
  width: 240px;
  height: 240px;
  border-radius: 32px;
  overflow: hidden;
  z-index: 10000;

  .glass-filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(6px);
    filter: url(#glass-distortion-loading) saturate(120%) brightness(1.15);
    z-index: 1;
  }

  .glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.55);
    z-index: 2;
  }

  .glass-specular {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.9), 
                inset -1px -1px 2px rgba(0, 0, 0, 0.05);
    z-index: 3;
    pointer-events: none;
  }

  .glass-distortion-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    animation: floatDistort 8s ease-in-out infinite;
    z-index: 4;
    pointer-events: none;
  }

  .loading-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 5;
    gap: 12px;
  }

  .spinner-container {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner-icon {
    color: #2e7d32;
    font-size: 3rem;
    text-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
    animation: spinRotate 1.2s linear infinite;
  }

  .loading-text {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    letter-spacing: 0.3px;
  }

  .loading-dots {
    display: flex;
    gap: 6px;
    align-items: center;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2e7d32;
      opacity: 0.6;
      animation: dotPulse 1.4s ease-in-out infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
}

@keyframes spinRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes floatDistort {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0, 0);
  }
}

.greengoods {
  color: #2e7d32;
}

#app {
  width: 100%;
  min-height: 100vh;
  font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.app-shell {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

</style>