<template>
    <div class="EG-Default faq-page-liquid">
        <!-- SVG Filter for Glass Distortion -->
        <svg style="display: none">
            <filter id="glass-distortion">
                <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
            </filter>
        </svg>

        <!-- Hero Section with Gradient -->
        <div class="faq-hero-section">
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-xl-7 col-lg-8 col-md-10 col-12">
                        <div class="text-center" data-aos="fade-up" data-aos-duration="1300">
                            <nav>
                                <ol class="breadcrumb justify-content-center">
                                    <li class="breadcrumb-item"><router-link to="../home-page"
                                            class="nav-link text-success">Home</router-link></li>
                                    <li class="breadcrumb-item link-secondary active" aria-current="page">FAQ</li>
                                </ol>
                            </nav>
                            <h1 class="fw-bold pb-3 display-1 hero-title">Got Questions?</h1>
                            <p class="hero-subtitle">At EatsBuddy, we're here to simplify your cooking experience with
                                our Recipe Viewer, Meal Planner, and Grocery List Creation service. Find answers below.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ Content with Authentic Liquid Glass Style -->
        <div class="faq-content-section">
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-xl-8 col-lg-9 col-md-11 col-12">
                        <div class="mb-5 text-center">
                            <h2 class="fw-bold pb-2 section-title">Check Our FAQs Below</h2>
                            <p class="section-subtitle">Feel free to reach out for any inquiries or support</p>
                        </div>

                        <!-- Glass FAQ List -->
                        <div class="glass-faq-list">
                            <!-- FAQ Item 1 -->
                            <div class="glass-faq-item">
                                <input type="checkbox" :id="`faq-toggle-1`" class="faq-toggle">
                                <label :for="`faq-toggle-1`" class="faq-header">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <span class="faq-icon">📚</span>
                                        <span class="faq-question">How do I use the Recipe Viewer?</span>
                                        <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </label>
                                <div class="faq-content">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <p>To use the Recipe Viewer, simply browse through our collection of recipes, click on a recipe you like, and follow the step-by-step instructions provided.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- FAQ Item 2 -->
                            <div class="glass-faq-item">
                                <input type="checkbox" :id="`faq-toggle-2`" class="faq-toggle">
                                <label :for="`faq-toggle-2`" class="faq-header">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <span class="faq-icon">📅</span>
                                        <span class="faq-question">How can I create a meal plan?</span>
                                        <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </label>
                                <div class="faq-content">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <p>Creating a meal plan is easy! Go to the Meal Planner section, select your desired recipes, and organize them into a weekly meal plan.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- FAQ Item 3 -->
                            <div class="glass-faq-item">
                                <input type="checkbox" :id="`faq-toggle-3`" class="faq-toggle">
                                <label :for="`faq-toggle-3`" class="faq-header">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <span class="faq-icon">🛒</span>
                                        <span class="faq-question">How do I generate a grocery list?</span>
                                        <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </label>
                                <div class="faq-content">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <p>To generate a grocery list, use our Grocery List Creation service. Add items manually or based on your selected recipes, and get a complete, organized list for shopping.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- FAQ Item 4 -->
                            <div class="glass-faq-item">
                                <input type="checkbox" :id="`faq-toggle-4`" class="faq-toggle">
                                <label :for="`faq-toggle-4`" class="faq-header">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <span class="faq-icon">📱</span>
                                        <span class="faq-question">Is EatsBuddy available on mobile devices?</span>
                                        <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </label>
                                <div class="faq-content">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <p>Yes, EatsBuddy is fully responsive and can be accessed on both desktop and mobile devices for your convenience.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- FAQ Item 5 -->
                            <div class="glass-faq-item">
                                <input type="checkbox" :id="`faq-toggle-5`" class="faq-toggle">
                                <label :for="`faq-toggle-5`" class="faq-header">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <span class="faq-icon">💬</span>
                                        <span class="faq-question">How can I contact customer support?</span>
                                        <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </label>
                                <div class="faq-content">
                                    <div class="glass-filter"></div>
                                    <div class="glass-overlay"></div>
                                    <div class="glass-specular"></div>
                                    <div class="glass-content">
                                        <p>You can reach our customer support via email at support@eatsbuddy.com or call us at +855-080-586-824.</p>
                                    </div>
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
  name: 'FaqPage',
}
</script>

<style scoped>
/* ===== Authentic Liquid Glass FAQ Page Styles ===== */

/* Background with Light Gradient */
.faq-page-liquid {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
}

/* Hero Section */
.faq-hero-section {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    padding: 60px 0;
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

/* Content Section */
.faq-content-section {
    position: relative;
    z-index: 1;
    padding: 60px 0;
}

.section-title {
    color: #1a1a1a;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.section-subtitle {
    color: #4a4a4a;
    font-size: 1rem;
    font-weight: 400;
}

/* ===== Glass FAQ List Container ===== */
.glass-faq-list {
    --bg-color: rgba(255, 255, 255, 0.6);
    --highlight: rgba(255, 255, 255, 0.9);
    --text: #1a1a1a;
    
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

/* ===== Glass FAQ Item ===== */
.glass-faq-item {
    position: relative;
}

/* Hide checkbox but keep it accessible */
.faq-toggle {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

/* ===== FAQ Header (Glass Button) ===== */
.faq-header {
    position: relative;
    display: block;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
}

.glass-filter,
.glass-overlay,
.glass-specular {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}

.glass-filter {
    z-index: 1;
    backdrop-filter: blur(4px);
    filter: url(#glass-distortion) saturate(120%) brightness(1.15);
}

.glass-overlay {
    z-index: 2;
    background: var(--bg-color);
}

.glass-specular {
    z-index: 3;
    box-shadow: inset 1px 1px 1px var(--highlight);
}

.glass-content {
    position: relative;
    z-index: 4;
    padding: 16px;
    color: var(--text);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
}

.faq-header .glass-content {
    justify-content: space-between;
    align-items: center;
}

/* ===== FAQ Icon and Question ===== */
.faq-icon {
    display: inline-block;
    font-size: 1.3rem;
    min-width: 30px;
    text-align: center;
}

.faq-question {
    flex: 1;
    font-weight: 600;
    font-size: 1.05rem;
    text-align: left;
}

/* ===== FAQ Arrow ===== */
.faq-arrow {
    width: 20px;
    height: 20px;
    min-width: 20px;
    transition: transform 0.3s ease;
    stroke-width: 2.5;
}

/* ===== FAQ Content (Answer) ===== */
.faq-content {
    position: relative;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease;
    border-radius: 12px;
    margin-top: 8px;
}

.faq-content .glass-content {
    padding: 0 16px;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.faq-content p {
    margin: 0;
    color: var(--text);
    line-height: 1.6;
}

/* ===== FAQ Toggle States ===== */
.faq-toggle:checked ~ .faq-header .faq-arrow {
    transform: rotate(180deg);
}

.faq-toggle:checked ~ .faq-content {
    max-height: 300px;
}

.faq-toggle:checked ~ .faq-content .glass-content {
    padding: 16px;
    opacity: 1;
    transform: translateY(0);
}

/* ===== Hover Effects ===== */
.faq-header:hover .glass-overlay {
    background: rgba(255, 255, 255, 0.3);
}

/* ===== Breadcrumb Styling ===== */
.breadcrumb {
    background-color: transparent !important;
    margin-bottom: 1.5rem;
}

.breadcrumb-item {
    color: #4a4a4a !important;
}

.breadcrumb-item.active {
    color: #2e7d32 !important;
    font-weight: 500;
}

.breadcrumb-item > .nav-link {
    color: #2e7d32 !important;
    text-decoration: none;
    transition: all 0.3s ease;
}

.breadcrumb-item > .nav-link:hover {
    text-decoration: underline;
    filter: brightness(0.9);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.2rem !important;
    }

    .hero-subtitle {
        font-size: 0.95rem;
    }

    .faq-question {
        font-size: 0.95rem;
    }

    .faq-icon {
        font-size: 1.1rem;
    }

    .section-title {
        font-size: 1.5rem;
    }
}

@media (max-width: 576px) {
    .hero-title {
        font-size: 1.8rem !important;
    }

    .faq-header {
        border-radius: 10px;
    }

    .glass-content {
        padding: 12px;
    }

    .faq-question {
        font-size: 0.9rem;
    }

    .faq-icon {
        min-width: 25px;
        font-size: 1rem;
    }

    .faq-arrow {
        width: 18px;
        height: 18px;
    }
}
</style>
