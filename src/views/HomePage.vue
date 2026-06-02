<template>
  <main class="home-page overflow-hidden">
    <!-- HERO -->
    <section class="home-hero py-5" style="margin-top: 70px;">
      <div class="container">
        <div class="row align-items-center g-4 g-lg-5">
          <div class="col-12 col-lg-6 hero-copy text-center text-lg-start" data-aos="fade-up">
            <span class="section-kicker">Meal planning made simple</span>
            <h1 class="hero-title fw-bold lh-1 text-wrap mb-0">Plan better meals with less effort.</h1>
            <p class="hero-lead text-wrap mt-3 mb-0">
              EatsBuddy brings recipes, weekly planning, and grocery lists into one clean workspace so every meal feels easier.
            </p>

            <div class="hero-actions d-flex flex-column flex-sm-row flex-wrap justify-content-center justify-content-lg-start gap-2 gap-sm-3 mt-4">
              <router-link to="/recipes" class="primary-btn">
                Explore Recipes
                <i class="fa-solid fa-arrow-right"></i>
              </router-link>
              <router-link to="/meal-planner" class="secondary-btn">
                Start Planning
              </router-link>
            </div>

            <div class="row hero-proof g-2 g-sm-3 mt-3 mt-sm-4">
              <div v-for="stat in abouts" :key="stat.title" class="col-12 col-sm-4">
                <div class="proof-item h-100">
                  <strong>{{ stat.title }}</strong>
                  <span>{{ stat.description }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6 hero-visual" data-aos="zoom-in">
            <img src="../assets/img/Food-1.png" class="img-fluid" alt="Fresh meal on a table" />
            <div class="hero-floating-card hero-rating-card d-none d-md-flex">
              <i class="fa-solid fa-star"></i>
              <div>
                <strong>4.8/5</strong>
                <span>User rating</span>
              </div>
            </div>
            <div class="hero-floating-card hero-plan-card d-none d-md-flex">
              <i class="fa-solid fa-calendar-check"></i>
              <div>
                <strong>Weekly plans</strong>
                <span>Ready in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="services-section section-shell">
      <div class="container">
        <div class="section-heading text-center mx-auto mb-4 mb-md-5">
          <span class="section-kicker">Services</span>
          <h2 class="section-title fw-bold text-wrap">Everything you need for a smarter kitchen.</h2>
          <p class="section-sub text-wrap mt-3 mb-0">Move from inspiration to shopping with tools that stay clear, fast, and easy to use.</p>
        </div>

        <div class="row g-3 g-md-4">
          <div v-for="item in items" :key="item.title" class="col-12 col-sm-6 col-xl-4">
            <article class="service-card h-100">
              <div class="service-icon">
                <img :src="require(`@/assets/img/${item.imgSrc}`)" :alt="item.title" />
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
              <router-link :to="item.destinationpage" class="card-link">
                {{ item.text2 }}
                <i class="fa-solid fa-arrow-right"></i>
              </router-link>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- STORY -->
    <section class="story-section py-5">
      <div class="container">
        <div class="story-card p-3 p-sm-4 p-xxl-5">
          <div class="row align-items-center g-4 g-lg-5">
            <div class="col-12 col-lg-7 story-copy text-center text-lg-start">
              <span class="section-kicker">Eat well, live better</span>
              <h2 class="section-title fw-bold text-wrap">Spend less time deciding and more time enjoying food.</h2>
              <p class="section-sub text-wrap mt-3 mb-0">
                Build a routine that supports your schedule. Discover recipes, organize your week, and turn meal ideas into a grocery list without extra steps.
              </p>
            </div>

            <div class="col-12 col-lg-5">
              <div class="d-grid gap-3 story-stats">
                <div v-for="stat in abouts" :key="stat.description" class="story-stat">
                  <strong>{{ stat.title }}</strong>
                  <span>{{ stat.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY -->
    <section class="why-section section-shell">
      <div class="container">
        <div class="row align-items-center g-4 g-lg-5">
          <div class="col-12 col-lg-5" data-aos="fade-right">
            <div class="why-image-card">
              <img src="../assets/img/WCU-2.png" class="img-fluid" alt="Meal planning illustration" />
            </div>
          </div>

          <div class="col-12 col-lg-7 why-content text-center text-lg-start" data-aos="fade-left">
            <span class="section-kicker">Why choose EatsBuddy</span>
            <h2 class="section-title fw-bold text-wrap">Designed for real daily cooking.</h2>
            <p class="why-intro section-sub text-wrap mt-3 mb-0">Clear workflows, strong organization, and practical features help you stay consistent without overthinking dinner.</p>

            <div class="row g-3 mt-3 mt-md-4">
              <div v-for="feature in features" :key="feature.title" class="col-12 col-md-6">
                <article class="feature-item h-100">
                  <div class="feature-icon">
                    <i :class="feature.icon"></i>
                  </div>
                  <div>
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.text }}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIAL -->
    <section class="testimonial-section py-5">
      <div class="container">
        <div class="testimonial-card p-3 p-sm-4 p-xxl-5" data-aos="fade-up">
          <div class="row align-items-center g-4 g-lg-5">
            <div class="col-12 col-lg-7 testimonial-copy text-center text-lg-start">
              <span class="section-kicker">Customer testimonials</span>
              <h2 class="section-title fw-bold text-wrap">People use EatsBuddy to make meals feel manageable.</h2>
              <p class="section-sub text-wrap mt-3 mb-0">"A clean way to plan food for the week, save time, and keep grocery trips focused."</p>
            </div>

            <div class="col-12 col-lg-5">
              <div class="rating-panel">
                <div class="stars" aria-label="4.8 out of 5 stars">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star-half-alt"></i>
                </div>
                <strong>4.8/5</strong>
                <span>Rated by satisfied planners</span>
                <router-link to="/about" class="secondary-btn dark-btn">Learn More</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter-section section-shell">
      <div class="container">
        <div class="newsletter-card p-3 p-sm-4 p-xxl-5">
          <div class="row align-items-center g-4 g-lg-5">
            <div class="col-12 col-lg-6 newsletter-copy text-center text-lg-start">
              <span class="section-kicker">Newsletter</span>
              <h2 class="section-title fw-bold text-wrap">Get fresh meal ideas in your inbox.</h2>
              <p class="section-sub text-wrap mt-3 mb-0">Subscribe for recipe inspiration, planning tips, and smarter grocery ideas.</p>
            </div>

            <div class="col-12 col-lg-6">
              <form class="newsletter-form d-flex flex-column flex-sm-row gap-2" @submit.prevent>
                <label for="newsletter-email" class="visually-hidden">Email address</label>
                <input id="newsletter-email" type="email" placeholder="Your email address" />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
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
          text: 'Explore diverse recipes for every occasion, from quick dinners to gourmet meals.',
          text2: 'View Recipes',
          destinationpage: '/recipes'
        },
        {
          imgSrc: 'MPlan-1.png',
          title: 'Meal Planner',
          text: 'Organize weekly menus and ensure balanced meals with an intuitive planner.',
          text2: 'Create a Plan',
          destinationpage: '/meal-planner'
        },
        {
          imgSrc: 'Groc-1.png',
          title: 'Grocery List',
          text: 'Create smart grocery lists, add ingredients, and streamline your shopping.',
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
      features: [
        {
          icon: 'fa-solid fa-clock',
          title: 'Save Time',
          text: 'Plan meals and grocery tasks in fewer steps.'
        },
        {
          icon: 'fa-solid fa-utensils',
          title: 'Personalized Recipes',
          text: 'Find meal ideas that fit your taste and routine.'
        },
        {
          icon: 'fa-solid fa-wallet',
          title: 'Budget Smart',
          text: 'Shop with focused lists and reduce wasted purchases.'
        },
        {
          icon: 'fa-solid fa-people-group',
          title: 'Community',
          text: 'Share reviews and discover meals from other food lovers.'
        }
      ]
    };
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  color: #111827;
  background: #ffffff;
  font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Fluid vertical rhythm scales across all requested breakpoints */
.section-shell {
  padding-top: clamp(56px, 8vw, 120px);
  padding-bottom: clamp(56px, 8vw, 120px);
}

.section-kicker {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 14px;
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

/* HERO */
.home-hero {
  padding-top: clamp(104px, 12vw, 120px);
  padding-bottom: clamp(56px, 8vw, 80px);
  background:
    radial-gradient(circle at top left, rgba(22, 101, 52, 0.12), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8faf8 100%);
  border-bottom: 1px solid #e5e7eb;
}

.hero-title {
  color: #0f172a;
  letter-spacing: -0.05em;
  line-height: 0.98;
  font-size: clamp(2.55rem, 6vw, 6.7rem);
}

.hero-lead {
  color: #4b5563;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.8;
}

.primary-btn,
.secondary-btn,
.card-link,
.newsletter-form button {
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 900;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.primary-btn {
  padding: 0 24px;
  color: #ffffff;
  background: #166534;
  border: 1px solid #166534;
  box-shadow: 0 16px 34px rgba(22, 101, 52, 0.26);
}

.secondary-btn {
  padding: 0 22px;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.primary-btn:hover,
.secondary-btn:hover,
.card-link:hover,
.newsletter-form button:hover {
  transform: translateY(-2px);
}

.primary-btn:hover {
  color: #ffffff;
  background: #14532d;
  box-shadow: 0 20px 40px rgba(22, 101, 52, 0.3);
}

.secondary-btn:hover {
  color: #14532d;
  border-color: #166534;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

/* Make CTA buttons full width only when stacked on mobile */
@media (max-width: 575.98px) {
  .hero-actions .primary-btn,
  .hero-actions .secondary-btn {
    width: 100%;
  }
}

.proof-item {
  padding: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.proof-item strong,
.story-stat strong,
.rating-panel strong {
  display: block;
  color: #14532d;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
}

.proof-item span,
.story-stat span,
.rating-panel span {
  display: block;
  margin-top: 7px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 800;
}

.hero-visual {
  position: relative;
}

.hero-visual img {
  width: 100%;
  height: clamp(320px, 45vw, 620px);
  object-fit: cover;
  border-radius: 42px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
}

.hero-floating-card {
  position: absolute;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(12px);
}

.hero-floating-card i {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: #166534;
  background: #dcfce7;
  border-radius: 14px;
}

.hero-floating-card strong {
  display: block;
  color: #111827;
  font-size: 14px;
  font-weight: 900;
}

.hero-floating-card span {
  color: #6b7280;
  font-size: 12px;
  font-weight: 800;
}

.hero-rating-card {
  top: 24px;
  right: -12px;
}

.hero-plan-card {
  left: -12px;
  bottom: 40px;
}

/* SECTION HEADINGS / TYPOGRAPHY */
.section-heading {
  max-width: 780px;
}

.section-title {
  color: #0f172a;
  letter-spacing: -0.04em;
  line-height: 1.02;
  font-size: clamp(1.9rem, 4vw, 4rem);
}

.section-sub {
  color: #4b5563;
  font-size: clamp(15px, 1.2vw, 16px);
  line-height: 1.75;
}

/* SERVICES */
.services-section,
.why-section,
.newsletter-section {
  background: #ffffff;
}

.service-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  text-align: left;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  box-shadow: 0 20px 54px rgba(15, 23, 42, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.service-card:hover,
.feature-item:hover {
  border-color: #bbf7d0;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.12);
  transform: translateY(-6px);
}

.service-icon {
  width: 82px;
  height: 82px;
  display: grid;
  place-items: center;
  margin-bottom: 24px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 24px;
}

.service-icon img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.service-card h3,
.feature-item h3 {
  margin: 0;
  color: #111827;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.service-card p,
.feature-item p {
  flex: 1;
  margin: 14px 0 24px;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.7;
}

.card-link {
  margin-top: auto;
  padding: 0 18px;
  color: #14532d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.card-link:hover {
  color: #ffffff;
  background: #166534;
  border-color: #166534;
}

/* STORY */
.story-section {
  background: #f8faf8;
}

.story-card,
.testimonial-card,
.newsletter-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 38px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.09);
}

.story-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
}

.story-stat span {
  margin-top: 0;
  text-align: right;
}

/* WHY */
.why-image-card {
  display: grid;
  place-items: center;
  padding: clamp(20px, 3vw, 32px);
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 36px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
}

.why-image-card img {
  max-height: 440px;
  object-fit: contain;
}

.feature-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  color: #166534;
  background: #dcfce7;
  border-radius: 18px;
  font-size: 22px;
}

.feature-item p {
  margin: 8px 0 0;
}

/* TESTIMONIAL */
.testimonial-section {
  background: #f8faf8;
}

.testimonial-card {
  background:
    radial-gradient(circle at top right, rgba(22, 101, 52, 0.12), transparent 32%),
    #ffffff;
}

.rating-panel {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 28px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.stars {
  display: flex;
  gap: 6px;
  color: #f59e0b;
  font-size: 24px;
}

.rating-panel strong {
  font-size: 48px;
}

.dark-btn {
  margin-top: 8px;
}

/* NEWSLETTER */
.newsletter-form {
  padding: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
}

.newsletter-form input {
  flex: 1;
  min-width: 0;
  height: 52px;
  padding: 0 18px;
  color: #111827;
  background: transparent;
  border: 0;
  outline: none;
  font-size: 15px;
  font-weight: 700;
}

.newsletter-form button {
  min-width: 140px;
  padding: 0 22px;
  color: #ffffff;
  background: #166534;
  border: 1px solid #166534;
  cursor: pointer;
}

.newsletter-form button:hover {
  background: #14532d;
  box-shadow: 0 14px 28px rgba(22, 101, 52, 0.22);
}

/* Round corners when the newsletter input/button stack on mobile */
@media (max-width: 575.98px) {
  .newsletter-form {
    border-radius: 24px;
  }

  .newsletter-form input,
  .newsletter-form button {
    width: 100%;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile niceties for stacked cards */
@media (max-width: 575.98px) {
  .service-card {
    align-items: center;
    text-align: center;
  }

  .story-stat {
    flex-direction: column;
    text-align: center;
  }

  .story-stat span {
    text-align: center;
  }

  .feature-item {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
}
</style>
