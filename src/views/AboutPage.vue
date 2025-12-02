<template>
    <div class="EG-Default about-page-glass">
        <!-- SVG Filter for Glass Distortion -->
        <svg style="display: none">
            <filter id="glass-distortion-about">
                <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
            </filter>
        </svg>

        <!-- Hero Section -->
        <div class="breadcrumb-section py-5">
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-xl-7 col-lg-8 col-md-10 col-12">
                        <div class="text-center" data-aos="fade-up" data-aos-duration="1300">
                            <nav>
                                <ol class="breadcrumb justify-content-center">
                                    <li class="breadcrumb-item"><router-link to="../home-page"
                                            class="breadcrumb-link">Home</router-link></li>
                                    <li class="breadcrumb-item link-secondary active" aria-current="page">ABOUT</li>
                                </ol>
                            </nav>
                            <h1 class="fw-bold pb-2 display-1 hero-title">About Us</h1>
                            <p class="hero-subtitle">At EatsBuddy, we're here to simplify your cooking experience with
                                our Recipe Viewer, Meal Planner, and Grocery List Creation service. Join us in making
                                meal preparation easy and enjoyable!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Story Section -->
        <div class="story-section py-5">
            <div class="container py-5">
                <div class="row align-items-center g-5 g-md-5 text-start">
                    <div class="col-lg-6 col-12" data-aos="fade-right" data-aos-duration="1300">
                        <h6 class="story-badge">OUR STORY</h6>
                        <h1 class="fw-bold py-3 display-4 story-title">Cooking Up Convenience and Joy, One Meal at a
                            Time.</h1>
                        <p class="story-text lead">EatsBuddy was born from a love for food and a desire to make meal planning and
                            preparation effortless for everyone. What began as a small project to help friends and
                            family organize their cooking has grown into a comprehensive platform loved by food
                            enthusiasts everywhere.</p>
                        <p class="story-text">We at EatsBuddy believes everyone should enjoy creating and savoring delicious meals. We
                            provide
                            curated recipes, personalized meal plans, and simple grocery lists to simplify your kitchen
                            experience. Our commitment is to empower you to easily create memorable meals, fostering
                            innovation and expanding our offerings.
                        </p>
                    </div>
                    <div class="col-lg-6 col-12">
                        <div class="glass-image-card">
                            <div class="glass-filter"></div>
                            <div class="glass-overlay"></div>
                            <div class="glass-specular"></div>
                            <img src="https://wiodiet.com/cdn/shop/articles/meal-planning-and-preparation-tips-tips-for-planning-and-preparing-healthy-meals-262604.jpg?v=1707782959" alt="our-store" class="glass-image"
                                data-aos="fade-left" data-aos-duration="1300">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chefs Section -->
        <div class="chefs-section py-5">
            <div class="container py-5">
                <div class="row justify-content-center mb-5">
                    <div class="col-xl-7 col-lg-8 col-md-10 col-12">
                        <div class="text-center">
                            <h1 class="fw-bold pb-2 chefs-title display-5">Our Qualified Chefs</h1>
                            <p class="chefs-subtitle lead">Meet the minds behind EatsBuddy! Our talented duo blends
                                creativity and expertise to bring you the best in cooking convenience.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row align-items-center justify-content-center g-4" id="chef-container">
                    <div class="col-lg-4 col-md-6 col-12" v-for="chef in chefs" :key="chef.name">
                        <div class="glass-chef-card">
                            <div class="glass-filter"></div>
                            <div class="glass-overlay"></div>
                            <div class="glass-specular"></div>
                            <div class="glass-card-content">
                                <img :src="chef.img" class="chef-image" :alt="chef.name"
                                    data-aos="zoom-in-up" data-aos-duration="1000">
                                <div class="chef-info">
                                    <h5 class="chef-name fw-bold">{{ chef.name }}</h5>
                                    <p class="chef-role">{{ chef.role }}</p>
                                </div>
                                <div class="chef-social">
                                    <a v-for="social in chef.social" :key="social.platform" :href="social.url"
                                        class="social-icon">
                                        <i :class="'ri-' + social.platform + '-fill ri-lg'"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        chefs: [
          {
            name: "Tang Elite",
            role: "Developer & Frontend Designer",
            img: require('@/assets/img/person-e.png'),
            social: [
              { platform: "facebook", url: "#" },
              { platform: "twitter", url: "#" },
              { platform: "linkedin", url: "#" },
            ],
          },
          {
            name: "Tang Piseth",
            role: "Developer & Backend Engineer",
            img: require('@/assets/img/person-p.png'),
            social: [
              { platform: "facebook", url: "#" },
              { platform: "twitter", url: "#" },
              { platform: "linkedin", url: "#" },
            ],
          }
        ],
      };
    },
  };
</script>

<style scoped>
/* ===== Liquid Glass About Page Styles ===== */

.about-page-glass {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
}

/* Decorative Blur Circles */
.about-page-glass::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.08);
    filter: blur(80px);
    z-index: 0;
}

.about-page-glass::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -5%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(33, 150, 243, 0.06);
    filter: blur(80px);
    z-index: 0;
}

/* ===== Breadcrumb Section ===== */
.breadcrumb-section {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 1;
}

.hero-title {
    color: #1a1a1a;
    font-weight: 700;
    font-size: 3.5rem !important;
    margin-bottom: 1rem;
    letter-spacing: -1px;
}

.hero-subtitle {
    color: #4a4a4a;
    font-size: 1.1rem;
    line-height: 1.6;
    font-weight: 400;
}

.breadcrumb {
    background-color: transparent !important;
    margin-bottom: 1.5rem;
}

.breadcrumb-item {
    color: #4a4a4a !important;
}

.breadcrumb-item.active {
    color: #2e7d32 !important;
}

.breadcrumb-link {
    color: #2e7d32 !important;
    text-decoration: none;
    transition: all 0.3s ease;
}

.breadcrumb-link:hover {
    text-decoration: underline;
}

/* ===== Story Section ===== */
.story-section {
    position: relative;
    z-index: 1;
    background: transparent;
}

.story-badge {
    color: #2e7d32;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.85rem;
}

.story-title {
    color: #1a1a1a;
    font-weight: 700;
}

.story-text {
    color: #4a4a4a;
    font-weight: 400;
    line-height: 1.8;
}

/* ===== Glass Image Card ===== */
.glass-image-card {
    --bg-color: rgba(255, 255, 255, 0.5);
    --highlight: rgba(255, 255, 255, 0.9);
    
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transition: all 0.3s ease;
}

.glass-image-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.glass-image-card .glass-filter,
.glass-image-card .glass-overlay,
.glass-image-card .glass-specular {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}

.glass-image-card .glass-filter {
    z-index: 1;
    backdrop-filter: blur(4px);
    filter: url(#glass-distortion-about) saturate(120%) brightness(1.15);
}

.glass-image-card .glass-overlay {
    z-index: 2;
    background: var(--bg-color);
}

.glass-image-card .glass-specular {
    z-index: 3;
    box-shadow: inset 1px 1px 1px var(--highlight);
}

.glass-image {
    position: relative;
    z-index: 4;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* ===== Chefs Section ===== */
.chefs-section {
    position: relative;
    z-index: 1;
    background: transparent;
}

.chefs-title {
    color: #1a1a1a;
    font-weight: 700;
}

.chefs-subtitle {
    color: #4a4a4a;
    font-weight: 400;
}

/* ===== Glass Chef Card ===== */
.glass-chef-card {
    --bg-color: rgba(255, 255, 255, 0.5);
    --highlight: rgba(255, 255, 255, 0.9);
    
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.glass-chef-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.glass-chef-card .glass-filter,
.glass-chef-card .glass-overlay,
.glass-chef-card .glass-specular {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}

.glass-chef-card .glass-filter {
    z-index: 1;
    backdrop-filter: blur(4px);
    filter: url(#glass-distortion-about) saturate(120%) brightness(1.15);
}

.glass-chef-card .glass-overlay {
    z-index: 2;
    background: var(--bg-color);
}

.glass-chef-card .glass-specular {
    z-index: 3;
    box-shadow: inset 1px 1px 1px var(--highlight);
}

.glass-card-content {
    position: relative;
    z-index: 4;
    padding: 2rem 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.chef-image {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    border: 4px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.chef-info {
    margin-bottom: 1rem;
}

.chef-name {
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
}

.chef-role {
    color: #2e7d32;
    font-weight: 600;
    margin: 0;
    font-size: 0.95rem;
}

.chef-social {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.social-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(46, 125, 50, 0.3) 0%, rgba(56, 142, 60, 0.2) 100%);
    border: 1px solid rgba(46, 125, 50, 0.3);
    color: #2e7d32;
    transition: all 0.3s ease;
    text-decoration: none;
}

.social-icon:hover {
    background: linear-gradient(135deg, rgba(46, 125, 50, 0.4) 0%, rgba(56, 142, 60, 0.3) 100%);
    border-color: rgba(46, 125, 50, 0.5);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(46, 125, 50, 0.15);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.2rem !important;
    }

    .story-title {
        font-size: 1.8rem;
    }

    .chefs-title {
        font-size: 1.8rem;
    }

    .chef-image {
        width: 120px;
        height: 120px;
    }
}

@media (max-width: 576px) {
    .hero-title {
        font-size: 1.8rem !important;
    }

    .story-title {
        font-size: 1.5rem;
    }

    .glass-image-card,
    .glass-chef-card {
        border-radius: 16px;
    }

    .glass-card-content {
        padding: 1.5rem 1rem;
    }

    .chef-image {
        width: 100px;
        height: 100px;
    }

    .chef-name {
        font-size: 1.1rem;
    }
}
</style>