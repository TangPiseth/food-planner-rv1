<template>
  <div class="recipe-page">
    <section class="recipe-page-hero">
      <div class="container">
        <nav class="recipe-breadcrumb" aria-label="breadcrumb">
          <router-link to="/">Home</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <span>Recipes</span>
        </nav>

        <div class="hero-grid" data-aos="fade-up">
          <div class="hero-copy">
            <h1>Find your next favorite meal.</h1>
            <p>
              From quick weeknight dinners to weekend feasts — discover thousands of recipes by cuisine, category, or ingredient. Your next delicious idea is just a search away.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="recipe-content-section">
      <div class="container">
        <RecipeList />
      </div>
    </section>
  </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import RecipeList from '@/components/recipes/RecipeList.vue';

export default {
  name: 'RecipePage',
  components: {
    RecipeList,
  },
  mounted() {
    AOS.init();
  },
};
</script>

<style scoped>
.recipe-page {
  min-height: 100vh;
  padding-top: 80px;
  color: #111827;
  background: #ffffff;
  font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.recipe-page .container {
  max-width: 1180px;
}

.recipe-page-hero {
  padding: 34px 0 58px;
  background:
    radial-gradient(circle at top left, rgba(22, 101, 52, 0.11), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8faf8 100%);
  border-bottom: 1px solid #e5e7eb;
}

.recipe-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 800;
}

.recipe-breadcrumb a {
  color: #14532d;
  text-decoration: none;
}

.recipe-breadcrumb i {
  color: #9ca3af;
  font-size: 10px;
}

.hero-grid {
  display: flex;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-kicker {
  display: inline-flex;
  margin-bottom: 18px;
  padding: 8px 14px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-copy {
  text-align: center;
}

.hero-copy h1 {
  max-width: 820px;
  margin: 0 auto;
  color: #0f172a;
  font-size: clamp(2.8rem, 6vw, 5.4rem);
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.95;
}

.hero-copy p {
  max-width: 620px;
  margin: 24px auto 0;
  color: #4b5563;
  font-size: 17px;
  line-height: 1.75;
}

.hero-stats {
  display: grid;
  gap: 12px;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
}

.hero-stats div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
}

.hero-stats strong {
  color: #14532d;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.hero-stats span {
  color: #374151;
  font-size: 13px;
  font-weight: 900;
  text-align: right;
}

.recipe-content-section {
  padding: 54px 0 76px;
  background: #ffffff;
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    max-width: 520px;
  }
}

@media (max-width: 576px) {
  .recipe-page {
    padding-top: 70px;
  }

  .recipe-page-hero {
    padding: 26px 0 42px;
  }

  .hero-copy h1 {
    font-size: clamp(2.3rem, 15vw, 3.6rem);
  }

  .hero-copy p {
    font-size: 15px;
  }

  .hero-stats {
    border-radius: 24px;
  }
}
</style>