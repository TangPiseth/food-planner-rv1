<template>
    <footer class="text-center EG-Default text-lg-start glass-footer">
        <!-- SVG Filter for Glass Distortion -->
        <svg style="display: none">
            <filter id="glass-distortion-footer">
                <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
            </filter>
        </svg>

        <!-- Section: Social media -->
        <section class="social-media-section d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
            <!-- Left -->
            <div class="me-5 d-none d-lg-block social-text">
                <span>Get connected with us <br> on our social media networks:</span>
            </div>
            <!-- Left -->

            <!-- Right -->
            <div class="social-icons-container">
                <a href="" class="social-glass-bubble" title="Facebook">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="icon-wrapper">
                        <i class="fab fa-facebook-f"></i>
                    </div>
                </a>
                <a href="" class="social-glass-bubble" title="Twitter">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="icon-wrapper">
                        <i class="fab fa-twitter"></i>
                    </div>
                </a>
                <a href="" class="social-glass-bubble" title="Google">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="icon-wrapper">
                        <i class="fab fa-google"></i>
                    </div>
                </a>
                <a href="" class="social-glass-bubble" title="Instagram">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="icon-wrapper">
                        <i class="fab fa-instagram"></i>
                    </div>
                </a>
                <a href="" class="social-glass-bubble" title="LinkedIn">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="icon-wrapper">
                        <i class="fab fa-linkedin"></i>
                    </div>
                </a>
                <a href="" class="social-glass-bubble" title="GitHub">
                    <div class="glass-filter"></div>
                    <div class="glass-overlay"></div>
                    <div class="glass-specular"></div>
                    <div class="icon-wrapper">
                        <i class="fab fa-github"></i>
                    </div>
                </a>
            </div>
            <!-- Right -->
        </section>
        <!-- Section: Social media -->

        <!-- Section: Links  -->
        <section class="footer-links-section">
            <div class="container text-center text-md-start mt-5">
                <!-- Grid row -->
                <div class="row mt-3">
                    <!-- Grid column -->
                    <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                        <!-- Content -->
                        <h6 class="text-uppercase fw-bold mb-4">
                            <i class="fas fa-gem me-3"></i>EatsBuddy
                        </h6>
                        <p>
                            Simplify your meals and grocery shopping effortlessly. Explore recipes, plan meals, and
                            manage grocery lists, all in one place.
                        </p>
                    </div>
                    <!-- Grid column -->

                    <!-- Grid column -->
                    <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 class="text-uppercase fw-bold mb-4">
                            Trending Recipes
                        </h6>
                        <p v-for="recipe in trendingRecipes" :key="recipe.id">
                            <router-link :to="'/recipes/' + recipe.id" class="text-reset nav-link">
                                {{ recipe.title }}
                                <i v-if="recipe.isNew" class="fa-solid fa-fire" style="color: #ed840c;"></i>
                            </router-link>
                        </p>
                    </div>
                    <!-- Grid column -->

                    <!-- Grid column -->
                    <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                        <!-- Links -->
                        <h6 class="text-uppercase fw-bold mb-4">
                            Useful links
                        </h6>
                        <p>
                            <router-link to="/faq" class="nav-link">FAQ</router-link>
                        </p>
                        <p>
                            <router-link to="/contact" class="nav-link">Contact Us</router-link>
                        </p>
                        <p>
                            <router-link to="/about" class="nav-link">About Us</router-link>
                        </p>
                        <p>
                            <router-link to="/terms" class="nav-link">Terms</router-link>
                        </p>
                    </div>
                    <!-- Grid column -->

                    <!-- Grid column -->
                    <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                        <!-- Links -->
                        <h6 class="text-uppercase fw-bold mb-4">Contact</h6>
                        <p><i class="fas fa-home me-3"></i> Phnom Penh 120201, Cambodia</p>
                        <p>
                            <i class="fas fa-envelope me-3"></i>
                            info@eatsbuddy.com
                        </p>
                        <p><i class="fas fa-phone me-3"></i> +855 080 586 824</p>
                        <p><i class="fas fa-print me-3"></i> +855 088 822 8279</p>
                    </div>
                    <!-- Grid column -->
                </div>
                <!-- Grid row -->
            </div>
        </section>
        <!-- Section: Links  -->

        <!-- Copyright -->
        <div class="copyright-section">
            © 2025 EatsBuddy. All Rights Reserved.
        </div>
        <!-- Copyright -->
    </footer>
</template>

<script>
import { getTrendingRecipes } from '@/services/recipeService';

export default {
  name: "Footer",
  data() {
    return {
      trendingRecipes: []
    };
  },
  created() {
    // Get trending recipes when component is created
    this.trendingRecipes = getTrendingRecipes(4).map(recipe => ({
      ...recipe,
      isNew: this.isNewRecipe(recipe.date) // Add logic to check if recipe is new
    }));
  },
  methods: {
    isNewRecipe(date) {
      // Consider a recipe "new" if it's less than 30 days old
      const recipeDate = new Date(date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recipeDate > thirtyDaysAgo;
    }
  }
};
</script>

<style>
/* ===== Liquid Glass Footer Styles ===== */

.glass-footer {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    color: #1a1a1a;
    position: relative;
}

/* Social Media Section */
.social-media-section {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.social-text {
    color: #4a4a4a;
    font-weight: 500;
}

/* Social Icons Container */
.social-icons-container {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
}

/* Social Glass Bubble */
.social-glass-bubble {
    --bg-color: rgba(255, 255, 255, 0.6);
    --highlight: rgba(255, 255, 255, 0.9);
    --text: #2e7d32;
    
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-glass-bubble .glass-filter,
.social-glass-bubble .glass-overlay,
.social-glass-bubble .glass-specular {
    position: absolute;
    inset: 0;
    border-radius: 50%;
}

.social-glass-bubble .glass-filter {
    z-index: 1;
    backdrop-filter: blur(4px);
    filter: url(#glass-distortion-footer) saturate(120%) brightness(1.15);
}

.social-glass-bubble .glass-overlay {
    z-index: 2;
    background: var(--bg-color);
}

.social-glass-bubble .glass-specular {
    z-index: 3;
    box-shadow: inset 1px 1px 2px var(--highlight);
}

.social-glass-bubble .icon-wrapper {
    position: relative;
    z-index: 4;
    font-size: 1.5rem;
    color: var(--text);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.social-glass-bubble:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.15);
}

.social-glass-bubble:hover .glass-overlay {
    background: rgba(255, 255, 255, 0.75);
}

.social-glass-bubble:hover .icon-wrapper {
    color: #1e7e34;
    transform: scale(1.15);
}

/* Footer Links Section */
.footer-links-section {
    background: transparent;
    color: #1a1a1a;
}

.footer-links-section h6 {
    color: #1a1a1a;
}

.footer-links-section p {
    color: #4a4a4a;
}

.footer-links-section .nav-link {
    color: #2e7d32 !important;
    transition: all 0.3s ease;
}

.footer-links-section .nav-link:hover {
    color: #1e7e34 !important;
    text-decoration: underline;
}

/* Copyright Section */
.copyright-section {
    color: white;
    text-align: center;
    padding: 1rem;
    background-color: #2e7d32;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
    .social-icons-container {
        justify-content: center;
    }

    .social-glass-bubble {
        width: 45px;
        height: 45px;
    }

    .social-glass-bubble .icon-wrapper {
        font-size: 1.2rem;
    }

    .social-text {
        display: none;
    }
}

/* Original styles kept for compatibility */
.greengoods {
    color: #17B97A;
}

.greenbgs {
    background-color: #17B97A;
}

footer ul {
    padding: 0;
    list-style: none;
}

footer ul li {
    margin-bottom: 5px;
}

footer ul li a:hover {
    text-decoration: underline;
}
</style>