<!-- RecipePage.vue -->
<template>
  <div class="EG-Default" style="margin-top: 80px;">
    <!-- SVG Filters -->
    <svg style="display: none">
      <filter id="glass-distortion-recipe-controls">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="7" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
      <filter id="glass-distortion-recipe-card">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="8" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
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
                  <li class="breadcrumb-item link-secondary active" aria-current="page">RECIPES</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="recipe-hero-section">
      <div class="container hero" data-aos="fade-up">
        <h1>Choose from thousands of recipes</h1>
        <p>Explore our diverse collection of delicious recipes crafted with passion and care.</p>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="recipe-content-section py-5">
      <div class="container mt-4">
        <div class="row">
          <!-- Recipe Cards Section -->
          <main class="col-lg-9 m-auto" data-aos="fade-left">
            <RecipeList />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Filters from '@/components/recipes/Filters.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  components: {
    Filters,
    RecipeList,
  },
  mounted() {
    AOS.init();
  },
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  color: #1a1a1a;
}

/* Breadcrumb Section */
.breadcrumb-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.breadcrumb-section .breadcrumb {
  background: transparent;
  padding: 0;
  margin: 0;
}

.breadcrumb-section .breadcrumb-item a {
  color: #2e7d32;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-section .breadcrumb-item a:hover {
  color: #1b5e20;
}

/* Hero Section */
.recipe-hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
  overflow: hidden;
  padding: 10px 0;
}

.recipe-hero-section::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(46, 125, 50, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  filter: blur(80px);
  pointer-events: none;
}

.recipe-hero-section::after {
  content: '';
  position: absolute;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(23, 185, 122, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -100px;
  left: -100px;
  filter: blur(60px);
  pointer-events: none;
}

.hero {
  position: relative;
  z-index: 1;
  background: url('../assets/img/Food-1.png') no-repeat center center/cover;
  color: white;
  text-align: center;
  padding: 60px 20px;
  border-radius: 28px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.hero p {
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.95;
}

/* Content Section */
.recipe-content-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
}

/* Pagination */
.pagination {
  justify-content: center;
  margin-top: 40px;
}

.page-link {
  color: #2e7d32;
  border-color: rgba(46, 125, 50, 0.3);
  border-radius: 8px;
  margin: 0 4px;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #2e7d32;
  color: white;
  border-color: #2e7d32;
}

.page-item.active .page-link {
  background-color: #2e7d32;
  border-color: #2e7d32;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .hero {
    padding: 40px 20px;
  }
  
  .breadcrumb-section {
    padding: 15px 0;
  }
  
  .recipe-hero-section {
    padding: 20px 0;
  }
  
  .recipe-content-section {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
  
  .col-lg-9 {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .pagination {
    margin-top: 25px;
  }
  
  .page-link {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
  
  .hero {
    padding: 50px 20px;
  }
}
</style>
