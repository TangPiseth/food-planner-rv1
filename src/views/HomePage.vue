<template>
  <div class="container-fluid text-center EG-Default p-0 bg-light">
    <!-- hero banner -->
    <section class="bg-light">
      <div class="headmast position-relative d-flex align-items-center justify-content-center text-white vh-100">
        <img src="../assets/img/Food-1.png" class="position-absolute w-100 h-100" alt="" style="/* opacity: 0.6; */">
        <div class="banner-txt position-relative z-3 text-center col-lg-8 col-md-10 col-sm-12 px-3" data-aos="flip-down"
          data-aos-duration="1300">
          <h2 class="display-4 py-3 fw-bolder fs-1" style="text-shadow: #000 1px 0 10px;">Welcome to</h2>
          <hr class="text-white mx-auto" style="width: 50%;">
          <h1 class="display-2 pb-3 fw-bold pt-3" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);">EatsBuddy</h1>
          <hr class="text-white mx-auto" style="width: 50%;">
          <p class="fs-5 mt-4" style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);">“Simplify your meals, amplify your
            life.”</p>
          
          <!-- Scroll Down Indicator -->
          <div class="scroll-indicator mt-5">
            <div class="mouse">
              <div class="mouse-wheel"></div>
            </div>
            <p class="scroll-text mt-3">Scroll Down</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services We Offer Section -->
    <section class="services-section py-5">
      <svg style="display: none">
        <filter id="glass-distortion-services">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="3" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div class="container">
        <div class="text-center mb-5">
          <h1 class="fw-bold display-5 text-black">Services We Offer</h1>
          <p class="text-muted lead">Explore our diverse range of services designed to make <br> your culinary experience
            seamless and enjoyable.</p>
        </div>
        
        <div class="row g-4 justify-content-center">
          <div v-for="(item, index) in items" :key="index" class="col-lg-4 col-md-6 col-sm-12">
            <div class="service-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              
              <div class="service-content">
                <div class="service-icon-wrapper">
                  <img :src="require(`@/assets/img/${item.imgSrc}`)" :alt="item.title" class="service-icon">
                </div>
                <h2 class="service-title">{{ item.title }}</h2>
                <p class="service-text">{{ item.text }}</p>
                <router-link :to="item.destinationpage">
                  <button class="service-btn" type="button">{{ item.text2 }}</button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="fixed-bg-section text-white">
      <div class="container d-flex align-items-center justify-content-start h-100">
        <div class="content col-lg-6">
          <h2 class="display-5 fw-bold">Eat <span style="color: #17B97A;">Well</span>, Live <span
              style="color: #17B97A;">Better</span></h2>
          <p class="lead mt-3">
            <i class="fa-solid fa-bacon"></i><i class="fa-solid fa-bacon"></i><i class="fa-solid fa-bacon"></i>
          </p>
          <p class="lead mt-3">
            At EatsBuddy, we believe in making every meal smarter and every day simpler. Plan your meals and groceries
            effortlessly with our tools.
          </p>
          <div class="row mt-3">
            <div v-for="(att1, index) in abouts" :key="index" class="col-4 mb-4">
              <div class="card-body">
                <h3 class="card-title fw-bold fs-1" style="color: #17B97A;">{{ att1.title }}</h3>
                <p class="card-text">{{ att1.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-us py-5">
      <svg style="display: none">
        <filter id="glass-distortion-wcu">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="4" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div class="container">
        <div class="row align-items-center g-5">
          <!-- Left Side: Glass Image Card -->
          <div class="col-lg-5 col-md-6 col-sm-12">
            <div class="wcu-glass-image-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <img src="../assets/img/WCU-2.png" alt="Why Choose Us" class="wcu-image">
            </div>
          </div>

          <!-- Right Side: Text Content with Feature Cards -->
          <div class="col-lg-7 col-md-6 col-sm-12">
            <div class="wcu-content">
              <h2 class="wcu-title">Why Choose <span class="wcu-highlight">EatsBuddy</span>?</h2>
              <p class="wcu-subtitle">Discover the features that make meal planning effortless and enjoyable</p>

              <div class="wcu-features">
                <div class="wcu-feature-item">
                  <div class="feature-icon">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div class="feature-content">
                    <h4>Save Time</h4>
                    <p>Save time with seamless meal and grocery planning tools.</p>
                  </div>
                </div>

                <div class="wcu-feature-item">
                  <div class="feature-icon">
                    <i class="fa-solid fa-utensils"></i>
                  </div>
                  <div class="feature-content">
                    <h4>Personalized Recipes</h4>
                    <p>Enjoy personalized recipes tailored to your taste and needs.</p>
                  </div>
                </div>

                <div class="wcu-feature-item">
                  <div class="feature-icon">
                    <i class="fa-solid fa-wallet"></i>
                  </div>
                  <div class="feature-content">
                    <h4>Budget Smart</h4>
                    <p>Stay on budget with smart grocery lists and offers.</p>
                  </div>
                </div>

                <div class="wcu-feature-item">
                  <div class="feature-icon">
                    <i class="fa-solid fa-people-group"></i>
                  </div>
                  <div class="feature-content">
                    <h4>Community</h4>
                    <p>Join a thriving community of food lovers and planners.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Rating Section -->
    <section class="customer-rating py-5 text-white text-center">
      <svg style="display: none">
        <filter id="glass-distortion-rating">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="6" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div class="container" data-aos="flip-down" data-aos-duration="1300">
        <!-- Tiny Description -->
        <h2 class="display-5 fw-bold mb-3">Customer Testimonials</h2>
        <p class="fs-5 mb-4">
          "We take pride in delivering exceptional service and experiences to our users. Here's what they think!"
        </p>

        <!-- Star Rating -->
        <div class="d-flex justify-content-center align-items-center mb-4">
          <i class="fa-solid fa-star text-warning fs-3 me-1"></i>
          <i class="fa-solid fa-star text-warning fs-3 me-1"></i>
          <i class="fa-solid fa-star text-warning fs-3 me-1"></i>
          <i class="fa-solid fa-star text-warning fs-3 me-1"></i>
          <i class="fa-solid fa-star-half-alt text-warning fs-3"></i>
        </div>

        <!-- Call to Action -->
        <p class="fs-5 mb-4">
          Rated <span class="fw-bold yellowtxt">4.8/5</span> by thousands of satisfied customers.
        </p>
        <router-link to="/about" class="rating-glass-link">
          <span class="rating-text">Learn More</span>
        </router-link>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section py-5">
      <svg style="display: none">
        <filter id="glass-distortion-newsletter">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="5" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-9 col-lg-10 col-md-11 col-12">
            <div data-aos="flip-down" data-aos-duration="1300">
              <div class="row justify-content-center">
                <div class="col-xl-8 col-lg-9 col-md-10 col-12">
                  <div class="newsletter-content">
                    <h1 class="newsletter-title">Newsletter Updates</h1>
                    <p class="newsletter-subtitle">Enter your email address below to subscribe to our tasty newsletter</p>
                    
                    <div class="newsletter-input-group">
                      <div class="newsletter-input-wrapper">
                        <input type="email" class="newsletter-input" placeholder="Your email address"
                          aria-label="Your email address" aria-describedby="Email">
                      </div>
                      <button class="newsletter-btn" type="button" id="Email">
                        <span>Subscribe</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      items: [
        {
          imgSrc: 'Recipe-1.png',
          title: 'Recipes',
          text: 'Explore diverse recipes for every occasion, from quick dinners to gourmet meals',
          text2: 'View Recipes',
          destinationpage: '/recipes'
        },
        {
          imgSrc: 'MPlan-1.png',
          title: 'Meal Planner',
          text: 'Organize weekly menus and ensure balanced meals with our intuitive meal planner',
          text2: 'Create a Plan',
          destinationpage: '/meal-planner'
        },
        {
          imgSrc: 'Groc-1.png',
          title: 'Grocery List',
          text: 'Create smart grocery lists, add ingredients, and streamline your shopping experience',
          text2: 'Create a List',
          destinationpage: '/grocery-list'
        }
      ],
      abouts: [
        {
          title: '1.2K+',
          description: 'Members Active'
        },
        {
          title: '18K+',
          description: 'Happy Clients'
        },
        {
          title: '15+',
          description: 'Award Winning'
        }
      ],
      offers: [
        {
          imgSrc: 'Promo-1.png',
          title: '50% Off Meal Plans',
          description: 'Sign up today and enjoy half-price on all meal plans for your first month.',
          cta: 'Claim Offer'
        },
        {
          imgSrc: 'Promo-2.png',
          title: 'Free Recipe Book',
          description: 'Sign up today to also get a free recipe book delivered to your doorstep.',
          cta: 'Claim Offer'
        },
        {
          imgSrc: 'Promo-3.png',
          title: 'Grocery List Rewards',
          description: 'Earn points and get discounts on your favorite groceries with our rewards program.',
          cta: 'Learn More'
        }
      ]
    };
  }
};
</script>

<style>
.yellowtxt {
  color: #FFA33D;
}

.greengoods {
  color: #17B97A;
}

/* Fixed Background Section */
.fixed-bg-section {
  height: 60vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../assets/img/Food-2.jpg');
  /* Replace with your background image */
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  display: flex;
  align-items: center;
}

.fixed-bg-section .content {
  padding: 20px;
}

.fixed-bg-section h2 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.fixed-bg-section p {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
}

/* Fixed Background Section - Responsive */
@media (max-width: 768px) {
  .fixed-bg-section {
    height: auto;
    min-height: auto;
    background-attachment: scroll;
    padding: 50px 0;
  }
  
  .fixed-bg-section .content {
    padding: 20px;
    text-align: center;
  }
  
  .fixed-bg-section h2 {
    font-size: 1.8rem !important;
  }
  
  .fixed-bg-section p.lead {
    font-size: 1rem !important;
  }
  
  .fixed-bg-section .row .col-4 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 25px;
  }
  
  .fixed-bg-section .card-title {
    font-size: 2rem !important;
  }
  
  .fixed-bg-section .card-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .fixed-bg-section {
    padding: 40px 0;
  }
  
  .fixed-bg-section h2 {
    font-size: 1.5rem !important;
  }
  
  .fixed-bg-section .card-title {
    font-size: 1.8rem !important;
  }
}

/* Headmast Section Image Fade */
.headmast img {
  filter: brightness(80%);
}

/* Hero Banner - Responsive */
@media (max-width: 768px) {
  .headmast {
    height: auto !important;
    min-height: 100vh !important;
    padding: 60px 0 40px;
  }
  
  .banner-txt {
    padding: 0 20px !important;
  }
  
  .banner-txt h2 {
    font-size: 1.3rem !important;
    padding: 10px 0 !important;
  }
  
  .banner-txt h1 {
    font-size: 2.8rem !important;
    line-height: 1.2;
  }
  
  .banner-txt p {
    font-size: 1.1rem !important;
    line-height: 1.6;
    padding: 0 10px;
  }
  
  .banner-txt hr {
    width: 70% !important;
    margin: 15px auto;
  }
  
  .scroll-indicator {
    margin-top: 30px !important;
  }
}

@media (max-width: 480px) {
  .headmast {
    min-height: 100vh !important;
    padding: 50px 0 30px;
  }
  
  .banner-txt h2 {
    font-size: 1.1rem !important;
  }
  
  .banner-txt h1 {
    font-size: 2.2rem !important;
  }
  
  .banner-txt p {
    font-size: 1rem !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .banner-txt h2 {
    font-size: 2rem !important;
  }
  
  .banner-txt h1 {
    font-size: 3rem !important;
  }
}

/* Special Offers */
.card img {
  height: 200px;
  object-fit: contain;
}

.why-choose-us {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
  overflow: hidden;
}

.why-choose-us::before {
  content: '';
  position: absolute;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(46, 125, 50, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  top: -150px;
  left: -150px;
  filter: blur(80px);
  pointer-events: none;
}

.why-choose-us::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(23, 185, 122, 0.04) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -100px;
  right: -100px;
  filter: blur(60px);
  pointer-events: none;
}

.why-choose-us .container {
  position: relative;
  z-index: 1;
}

/* Glass Image Card */
.wcu-glass-image-card {
  --bg-color: rgba(255, 255, 255, 0.5);
  --highlight: rgba(255, 255, 255, 0.85);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  height: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.wcu-glass-image-card .glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-wcu) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.wcu-glass-image-card .glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
}

.wcu-glass-image-card .glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 2px 2px 4px var(--highlight),
              inset -1px -1px 2px rgba(0, 0, 0, 0.08);
  z-index: 3;
  pointer-events: none;
}

.wcu-glass-image-card .wcu-image {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 20px;
}

.wcu-glass-image-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(46, 125, 50, 0.15),
              inset 0 1px 2px rgba(255, 255, 255, 0.7),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
}

/* Why Choose Us Content */
.wcu-content {
  padding: 0 20px;
}

.wcu-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.wcu-highlight {
  color: #2e7d32;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.wcu-subtitle {
  font-size: 1.1rem;
  color: #4a4a4a;
  margin-bottom: 32px;
  line-height: 1.6;
}

/* Features Grid */
.wcu-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wcu-feature-item {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06),
              inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

.wcu-feature-item:hover {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(46, 125, 50, 0.3);
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.12),
              inset 0 1px 1px rgba(255, 255, 255, 0.6);
}

.feature-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.15) 0%, rgba(46, 125, 50, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e7d32;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.wcu-feature-item:hover .feature-icon {
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.25) 0%, rgba(46, 125, 50, 0.15) 100%);
  transform: scale(1.1);
}

.feature-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
}

.feature-content h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.feature-content p {
  font-size: 0.9rem;
  color: #4a4a4a;
  line-height: 1.5;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 992px) {
  .wcu-title {
    font-size: 2rem;
  }

  .wcu-glass-image-card {
    height: 350px;
  }

  .wcu-features {
    gap: 16px;
  }

  .wcu-feature-item {
    padding: 16px;
    gap: 16px;
  }

  .feature-icon {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 768px) {
  .wcu-content {
    padding: 0;
    text-align: center;
  }

  .wcu-title {
    font-size: 1.8rem;
  }

  .wcu-subtitle {
    font-size: 1rem;
  }

  .wcu-glass-image-card {
    height: 280px;
    margin-bottom: 30px;
  }

  .wcu-feature-item {
    padding: 18px;
    gap: 16px;
  }

  .feature-icon {
    width: 50px;
    height: 50px;
    min-width: 50px;
    font-size: 1.3rem;
  }

  .feature-content h4 {
    font-size: 1.1rem;
  }

  .feature-content p {
    font-size: 0.95rem;
  }
  
  .why-choose-us {
    padding: 50px 0 !important;
  }
}

@media (max-width: 480px) {
  .wcu-title {
    font-size: 1.5rem;
  }

  .wcu-subtitle {
    font-size: 0.95rem;
    margin-bottom: 24px;
  }

  .wcu-glass-image-card {
    height: 240px;
  }

  .wcu-feature-item {
    padding: 16px;
    gap: 14px;
    flex-direction: column;
    text-align: center;
  }

  .feature-icon {
    width: 55px;
    height: 55px;
    min-width: 55px;
    font-size: 1.4rem;
  }

  .feature-content h4 {
    font-size: 1.05rem;
  }

  .feature-content p {
    font-size: 0.9rem;
  }
}

.customer-rating {
  background: url('../assets/img/Food-2.jpg') no-repeat center center fixed;
  background-size: cover;
  background-attachment: fixed;
  padding: 60px 0;
  position: relative;
}

.customer-rating::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  /* Dark overlay */
  z-index: 1;
}

.customer-rating .container {
  position: relative;
  z-index: 2;
}

.customer-rating h2 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.customer-rating .fa-star,
.customer-rating .fa-star-half-alt {
  color: #ffc107;
  /* Star color */
}

/* Customer Rating Responsive */
@media (max-width: 768px) {
  .customer-rating {
    padding: 50px 20px;
    background-attachment: scroll;
  }
  
  .customer-rating h2 {
    font-size: 1.8rem !important;
  }
  
  .customer-rating p.fs-5 {
    font-size: 1rem !important;
    line-height: 1.6;
    padding: 0 10px;
  }
  
  .customer-rating .fa-star,
  .customer-rating .fa-star-half-alt {
    font-size: 1.5rem !important;
  }
  
  .rating-glass-link {
    padding: 14px 32px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .customer-rating {
    padding: 40px 15px;
  }
  
  .customer-rating h2 {
    font-size: 1.5rem !important;
  }
  
  .customer-rating p.fs-5 {
    font-size: 0.95rem !important;
  }
}

/* Rating Glass Link */
.rating-glass-link {
  --bg-color: transparent;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  padding: 12px 36px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(46, 125, 50, 0.3),
              inset 0 1px 2px rgba(255, 255, 255, 0.4),
              inset 0 -1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  isolation: isolate;
}

.rating-glass-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  filter: url(#glass-distortion-rating) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
  pointer-events: none;
}

.rating-glass-link::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
  pointer-events: none;
  box-shadow: inset 2px 2px 4px var(--highlight),
              inset -1px -1px 2px rgba(0, 0, 0, 0.08);
}

.rating-glass-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(46, 125, 50, 0.5),
              inset 0 1px 2px rgba(255, 255, 255, 0.5),
              inset 0 -1px 2px rgba(0, 0, 0, 0.1);
  --bg-color: rgba(46, 125, 50, 0.6);
  color: white;
  text-decoration: none;
}

.rating-glass-link:active {
  transform: translateY(0);
}

.rating-text {
  position: relative;
  z-index: 10;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Services Section */
.services-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
  overflow: hidden;
}

.services-section::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(46, 125, 50, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  top: -100px;
  right: -100px;
  filter: blur(60px);
  pointer-events: none;
}

.services-section::after {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(23, 185, 122, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -150px;
  left: -150px;
  filter: blur(80px);
  pointer-events: none;
}

/* Service Glass Card */
.service-glass-card {
  --bg-color: rgba(255, 255, 255, 0.55);
  --highlight: rgba(255, 255, 255, 0.9);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  height: 100%;
  min-height: 380px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.service-glass-card .glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  filter: url(#glass-distortion-services) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.service-glass-card .glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
}

.service-glass-card .glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 2px 2px 4px var(--highlight),
              inset -1px -1px 2px rgba(0, 0, 0, 0.08);
  z-index: 3;
  pointer-events: none;
}

.service-glass-card .service-content {
  position: relative;
  z-index: 4;
  height: 100%;
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  gap: 16px;
}

.service-glass-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 16px 48px rgba(46, 125, 50, 0.18);
}

.service-icon-wrapper {
  width: 100px;
  height: 100px;
  background: rgba(46, 125, 50, 0.1);
  border: 1.5px solid rgba(46, 125, 50, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5),
              0 2px 8px rgba(46, 125, 50, 0.1);
}

.service-glass-card:hover .service-icon-wrapper {
  background: rgba(46, 125, 50, 0.15);
  border-color: rgba(46, 125, 50, 0.3);
  transform: scale(1.08);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.6),
              0 4px 12px rgba(46, 125, 50, 0.2);
}

.service-icon {
  width: 70px;
  height: 70px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.service-glass-card:hover .service-icon {
  filter: drop-shadow(0 4px 12px rgba(46, 125, 50, 0.3));
}

.service-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.service-text {
  font-size: 0.9rem;
  color: #4a4a4a;
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
}

.service-btn {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border: none;
  padding: 10px 28px;
  border-radius: 18px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  letter-spacing: 0.3px;
  margin-top: 8px;
}

.service-btn:hover {
  background: linear-gradient(135deg, #1b5e20 0%, #0d3817 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 125, 50, 0.4);
}

.service-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 1199px) {
  .service-glass-card {
    min-height: 360px;
  }

  .service-glass-card .service-content {
    padding: 30px 24px;
    gap: 12px;
  }

  .service-icon-wrapper {
    width: 90px;
    height: 90px;
    margin-bottom: 12px;
  }

  .service-icon {
    width: 60px;
    height: 60px;
  }

  .service-title {
    font-size: 1.2rem;
  }

  .service-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .service-glass-card {
    min-height: 320px;
  }

  .service-glass-card .service-content {
    padding: 28px 24px;
    gap: 12px;
  }

  .service-icon-wrapper {
    width: 90px;
    height: 90px;
    margin-bottom: 12px;
  }

  .service-icon {
    width: 60px;
    height: 60px;
  }

  .service-title {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }

  .service-text {
    font-size: 0.95rem;
    margin-bottom: 14px;
    line-height: 1.6;
  }

  .service-btn {
    padding: 12px 32px;
    font-size: 1rem;
  }
  
  .services-section h1 {
    font-size: 1.8rem !important;
  }
  
  .services-section p.lead {
    font-size: 1rem !important;
  }
  
  .services-section p.lead br {
    display: none;
  }
}

@media (max-width: 480px) {
  .service-glass-card {
    min-height: 300px;
  }

  .service-glass-card .service-content {
    padding: 24px 20px;
  }

  .service-icon-wrapper {
    width: 80px;
    height: 80px;
  }

  .service-icon {
    width: 55px;
    height: 55px;
  }

  .service-title {
    font-size: 1.2rem;
  }

  .service-text {
    font-size: 0.9rem;
  }

  .service-btn {
    padding: 10px 28px;
    font-size: 0.95rem;
  }
  
  .services-section h1 {
    font-size: 1.5rem !important;
  }
  
  .services-section .mb-5 {
    margin-bottom: 2rem !important;
  }
}

/* Newsletter Section */
.newsletter-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  position: relative;
  overflow: hidden;
}

.newsletter-section::before {
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

.newsletter-section::after {
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

.newsletter-section .container {
  position: relative;
  z-index: 1;
}

.newsletter-content {
  text-align: center;
  padding: 40px;
}

.newsletter-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.newsletter-subtitle {
  font-size: 1.1rem;
  color: #4a4a4a;
  margin-bottom: 32px;
  line-height: 1.6;
}

.newsletter-input-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.newsletter-input-wrapper {
  --bg-color: rgba(255, 255, 255, 0.5);
  --highlight: rgba(255, 255, 255, 0.85);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  flex: 1;
  min-width: 240px;
  max-width: 350px;
  height: 52px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.newsletter-input-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-newsletter) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
  pointer-events: none;
}

.newsletter-input-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
  pointer-events: none;
}

.newsletter-input {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  padding: 0 20px;
  font-size: 1rem;
  color: #1a1a1a;
  outline: none;
  font-weight: 500;
}

.newsletter-input::placeholder {
  color: #4a4a4a;
}

.newsletter-input:focus {
  outline: none;
}

.newsletter-btn {
  --bg-color: rgba(46, 125, 50, 0.6);
  --highlight: rgba(255, 255, 255, 0.9);
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  padding: 12px 36px;
  height: 52px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(46, 125, 50, 0.2),
              inset 0 1px 2px rgba(255, 255, 255, 0.3),
              inset 0 -1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}

.newsletter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-newsletter) saturate(130%) brightness(1.15) contrast(1.05);
  z-index: 1;
  pointer-events: none;
}

.newsletter-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  z-index: 2;
  pointer-events: none;
}

.newsletter-btn span {
  position: relative;
  z-index: 4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.newsletter-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(46, 125, 50, 0.3),
              inset 0 1px 2px rgba(255, 255, 255, 0.4),
              inset 0 -1px 2px rgba(0, 0, 0, 0.1);
  --bg-color: rgba(46, 125, 50, 0.75);
}

.newsletter-btn:active {
  transform: translateY(0);
}

/* Responsive Design for Newsletter */
@media (max-width: 768px) {
  .newsletter-section {
    padding: 50px 0;
  }
  
  .newsletter-content {
    padding: 24px 20px;
  }

  .newsletter-title {
    font-size: 1.8rem;
  }

  .newsletter-subtitle {
    font-size: 1rem;
    margin-bottom: 24px;
  }

  .newsletter-input-group {
    flex-direction: column;
    gap: 16px;
  }

  .newsletter-input-wrapper {
    max-width: 100%;
    flex-basis: 100%;
    height: 54px;
  }
  
  .newsletter-input {
    font-size: 1rem;
  }

  .newsletter-btn {
    width: 100%;
    height: 54px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .newsletter-section {
    padding: 40px 0;
  }
  
  .newsletter-content {
    padding: 20px 15px;
  }

  .newsletter-title {
    font-size: 1.5rem;
  }

  .newsletter-subtitle {
    font-size: 0.95rem;
  }
}

/* Scroll Down Indicator */
.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1s ease-in-out 1.5s both;
}

.mouse {
  width: 26px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  position: relative;
  display: flex;
  justify-content: center;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.mouse-wheel {
  width: 4px;
  height: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  margin-top: 8px;
  animation: scroll 1.5s infinite;
}

.scroll-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  margin-top: 1rem;
}

@keyframes scroll {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(12px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .mouse {
    width: 24px;
    height: 38px;
  }
  
  .scroll-text {
    font-size: 0.8rem;
    letter-spacing: 1.5px;
  }
  
  .scroll-indicator {
    margin-top: 25px !important;
  }
}

@media (max-width: 480px) {
  .mouse {
    width: 22px;
    height: 34px;
  }
  
  .mouse-wheel {
    width: 3px;
    height: 6px;
    margin-top: 6px;
  }
  
  .scroll-text {
    font-size: 0.75rem;
  }
}
</style>
