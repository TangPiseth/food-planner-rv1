<template>
  <main class="home-page">
    <section class="home-hero">
      <div class="home-container hero-grid">
        <div class="hero-copy" data-aos="fade-up">
          <span class="section-kicker">Meal planning made simple</span>
          <h1>Plan better meals with less effort.</h1>
          <p>
            EatsBuddy brings recipes, weekly planning, and grocery lists into one clean workspace so every meal feels easier.
          </p>

          <div class="hero-actions">
            <router-link to="/recipes" class="primary-btn">
              Explore Recipes
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
            <router-link to="/meal-planner" class="secondary-btn">
              Start Planning
            </router-link>
          </div>

          <div class="hero-proof">
            <div v-for="stat in abouts" :key="stat.title" class="proof-item">
              <strong>{{ stat.title }}</strong>
              <span>{{ stat.description }}</span>
            </div>
          </div>
        </div>

        <div class="hero-visual" data-aos="zoom-in">
          <img src="../assets/img/Food-1.png" alt="Fresh meal on a table" />
          <div class="hero-floating-card hero-rating-card">
            <i class="fa-solid fa-star"></i>
            <div>
              <strong>4.8/5</strong>
              <span>User rating</span>
            </div>
          </div>
          <div class="hero-floating-card hero-plan-card">
            <i class="fa-solid fa-calendar-check"></i>
            <div>
              <strong>Weekly plans</strong>
              <span>Ready in minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="services-section section-shell">
      <div class="home-container">
        <div class="section-heading">
          <span class="section-kicker">Services</span>
          <h2>Everything you need for a smarter kitchen.</h2>
          <p>Move from inspiration to shopping with tools that stay clear, fast, and easy to use.</p>
        </div>

        <div class="services-grid">
          <article v-for="item in items" :key="item.title" class="service-card">
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
    </section>

    <section class="story-section">
      <div class="home-container story-card">
        <div class="story-copy">
          <span class="section-kicker">Eat well, live better</span>
          <h2>Spend less time deciding and more time enjoying food.</h2>
          <p>
            Build a routine that supports your schedule. Discover recipes, organize your week, and turn meal ideas into a grocery list without extra steps.
          </p>
        </div>

        <div class="story-stats">
          <div v-for="stat in abouts" :key="stat.description" class="story-stat">
            <strong>{{ stat.title }}</strong>
            <span>{{ stat.description }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="why-section section-shell">
      <div class="home-container why-grid">
        <div class="why-image-card" data-aos="fade-right">
          <img src="../assets/img/WCU-2.png" alt="Meal planning illustration" />
        </div>

        <div class="why-content" data-aos="fade-left">
          <span class="section-kicker">Why choose EatsBuddy</span>
          <h2>Designed for real daily cooking.</h2>
          <p class="why-intro">Clear workflows, strong organization, and practical features help you stay consistent without overthinking dinner.</p>

          <div class="feature-list">
            <article v-for="feature in features" :key="feature.title" class="feature-item">
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
    </section>

    <section class="testimonial-section">
      <div class="home-container testimonial-card" data-aos="fade-up">
        <div class="testimonial-copy">
          <span class="section-kicker">Customer testimonials</span>
          <h2>People use EatsBuddy to make meals feel manageable.</h2>
          <p>"A clean way to plan food for the week, save time, and keep grocery trips focused."</p>
        </div>

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
    </section>

    <section class="newsletter-section section-shell">
      <div class="home-container newsletter-card">
        <div class="newsletter-copy">
          <span class="section-kicker">Newsletter</span>
          <h2>Get fresh meal ideas in your inbox.</h2>
          <p>Subscribe for recipe inspiration, planning tips, and smarter grocery ideas.</p>
        </div>

        <form class="newsletter-form" @submit.prevent>
          <label for="newsletter-email" class="visually-hidden">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Your email address" />
          <button type="submit">Subscribe</button>
        </form>
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
  overflow-x: hidden;
}

.home-container {
  width: min(100% - 40px, 1180px);
  margin: 0 auto;
}

.section-shell {
  padding: 96px 0;
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

.home-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  background:
    radial-gradient(circle at top left, rgba(22, 101, 52, 0.12), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8faf8 100%);
  border-bottom: 1px solid #e5e7eb;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 0.82fr);
  gap: clamp(48px, 7vw, 92px);
  align-items: center;
}

.hero-copy {
  text-align: left;
}

.hero-copy h1,
.section-heading h2,
.story-copy h2,
.why-content h2,
.testimonial-copy h2,
.newsletter-copy h2 {
  margin: 0;
  color: #0f172a;
  font-weight: 900;
  letter-spacing: -0.06em;
  line-height: 0.98;
}

.hero-copy h1 {
  max-width: 760px;
  font-size: clamp(3rem, 7vw, 6.7rem);
}

.hero-copy p {
  max-width: 660px;
  margin: 26px 0 0;
  color: #4b5563;
  font-size: 18px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
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

.hero-proof {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  max-width: 640px;
  margin-top: 44px;
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
  min-height: 620px;
  border-radius: 42px;
}

.hero-visual img {
  width: 100%;
  height: 620px;
  object-fit: cover;
  border-radius: 42px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
}

.hero-floating-card {
  position: absolute;
  display: flex;
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
  right: -24px;
}

.hero-plan-card {
  left: -28px;
  bottom: 40px;
}

.section-heading {
  max-width: 780px;
  margin: 0 auto 52px;
  text-align: center;
}

.section-heading h2,
.story-copy h2,
.why-content h2,
.testimonial-copy h2,
.newsletter-copy h2 {
  font-size: clamp(2.1rem, 4vw, 4rem);
}

.section-heading p,
.story-copy p,
.why-intro,
.testimonial-copy p,
.newsletter-copy p {
  margin: 18px 0 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.75;
}

.services-section,
.why-section,
.newsletter-section {
  background: #ffffff;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.service-card {
  min-height: 390px;
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

.story-section {
  padding: 86px 0;
  background: #f8faf8;
}

.story-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 40px;
  align-items: center;
  padding: clamp(28px, 5vw, 56px);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 38px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.09);
}

.story-stats {
  display: grid;
  gap: 14px;
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

.why-grid {
  display: grid;
  grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1fr);
  gap: clamp(40px, 6vw, 72px);
  align-items: center;
}

.why-image-card {
  display: grid;
  place-items: center;
  min-height: 520px;
  padding: 32px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 36px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
}

.why-image-card img {
  width: 100%;
  max-height: 440px;
  object-fit: contain;
}

.why-content {
  text-align: left;
}

.feature-list {
  display: grid;
  gap: 16px;
  margin-top: 30px;
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

.testimonial-section {
  padding: 86px 0;
  background: #f8faf8;
}

.testimonial-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 34px;
  align-items: center;
  padding: clamp(28px, 5vw, 56px);
  background:
    radial-gradient(circle at top right, rgba(22, 101, 52, 0.12), transparent 32%),
    #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 38px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.09);
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

.newsletter-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);
  gap: 34px;
  align-items: center;
  padding: clamp(28px, 5vw, 54px);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 38px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.09);
}

.newsletter-form {
  display: flex;
  gap: 12px;
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

@media (min-width: 1441px) {
  .home-container {
    width: min(100% - 80px, 1360px);
  }

  .hero-copy h1 {
    font-size: 7.2rem;
  }

  .hero-visual,
  .hero-visual img {
    min-height: 680px;
  }

  .section-shell {
    padding: 120px 0;
  }
}

@media (min-width: 1025px) and (max-width: 1440px) {
  .home-container {
    width: min(100% - 64px, 1180px);
  }

  .home-hero {
    padding-top: 118px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .home-container {
    width: min(100% - 48px, 900px);
  }

  .home-hero {
    min-height: auto;
    padding: 116px 0 72px;
  }

  .hero-grid,
  .story-card,
  .why-grid,
  .testimonial-card,
  .newsletter-card {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    text-align: center;
  }

  .hero-copy p,
  .hero-proof {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    min-height: auto;
    max-width: 720px;
    margin: 0 auto;
  }

  .hero-visual img {
    height: 520px;
  }

  .services-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .service-card:last-child {
    grid-column: 1 / -1;
  }

  .why-image-card {
    min-height: 420px;
  }
}

@media (max-width: 640px) {
  .home-container {
    width: min(100% - 32px, 100%);
  }

  .section-shell,
  .story-section,
  .testimonial-section {
    padding: 64px 0;
  }

  .home-hero {
    min-height: auto;
    padding: 104px 0 56px;
  }

  .hero-grid,
  .story-card,
  .why-grid,
  .testimonial-card,
  .newsletter-card,
  .services-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy,
  .section-heading,
  .story-copy,
  .why-content,
  .testimonial-copy,
  .newsletter-copy {
    text-align: center;
  }

  .hero-copy h1 {
    font-size: clamp(2.55rem, 16vw, 4rem);
  }

  .hero-copy p,
  .section-heading p,
  .story-copy p,
  .why-intro,
  .testimonial-copy p,
  .newsletter-copy p {
    font-size: 15px;
    line-height: 1.7;
  }

  .hero-actions {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  .hero-proof {
    grid-template-columns: 1fr;
    margin-top: 30px;
  }

  .hero-visual {
    min-height: auto;
  }

  .hero-visual img {
    height: 360px;
    border-radius: 28px;
  }

  .hero-floating-card {
    position: static;
    margin-top: 12px;
    justify-content: center;
  }

  .section-heading {
    margin-bottom: 34px;
  }

  .service-card {
    min-height: auto;
    align-items: center;
    text-align: center;
    padding: 24px;
    border-radius: 24px;
  }

  .story-card,
  .testimonial-card,
  .newsletter-card {
    padding: 24px;
    border-radius: 28px;
  }

  .story-stat {
    flex-direction: column;
    text-align: center;
  }

  .story-stat span {
    text-align: center;
  }

  .why-image-card {
    min-height: 300px;
    padding: 20px;
    border-radius: 28px;
  }

  .feature-item {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .rating-panel {
    padding: 22px;
  }

  .newsletter-form {
    flex-direction: column;
    border-radius: 24px;
  }

  .newsletter-form input,
  .newsletter-form button {
    width: 100%;
  }
}
</style>
