<template>
  <div class="terms-page" data-aos="fade-up">
    <!-- SVG Filters -->
    <svg style="display: none">
      <filter id="glass-distortion-terms-hero">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="21" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
      <filter id="glass-distortion-terms-content">
        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" seed="22" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
      </filter>
    </svg>

    <!-- Hero Section -->
    <div class="terms-hero-section">
      <div class="hero-gradient-bg"></div>
      <div class="container">
        <button @click="goBack" class="back-btn">
          <i class="fa-solid fa-chevron-left"></i> Back
        </button>
        <div class="hero-content">
          <h1 class="hero-title">Terms & Conditions</h1>
          <p class="hero-subtitle">Please read these terms carefully before using our service</p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="terms-content-section">
      <div class="container">
        <!-- Table of Contents -->
        <div class="toc-glass-card" data-aos="fade-up">
          <div class="glass-filter"></div>
          <div class="glass-overlay"></div>
          <div class="glass-specular"></div>
          <div class="toc-content">
            <h2 class="toc-title">Table of Contents</h2>
            <nav class="toc-nav">
              <a href="#section1" class="toc-link" @click="scrollToSection">1. Introduction</a>
              <a href="#section2" class="toc-link" @click="scrollToSection">2. User Responsibilities</a>
              <a href="#section3" class="toc-link" @click="scrollToSection">3. Acceptable Use</a>
              <a href="#section4" class="toc-link" @click="scrollToSection">4. Intellectual Property</a>
              <a href="#section5" class="toc-link" @click="scrollToSection">5. Limitation of Liability</a>
              <a href="#section6" class="toc-link" @click="scrollToSection">6. Disclaimers</a>
              <a href="#section7" class="toc-link" @click="scrollToSection">7. Changes to Terms</a>
              <a href="#section8" class="toc-link" @click="scrollToSection">8. Contact Us</a>
            </nav>
          </div>
        </div>

        <!-- Terms Sections -->
        <div class="terms-sections">
          <!-- Section 1 -->
          <div class="terms-section" id="section1" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">1</span> Introduction
                </h2>
                <p class="section-text">
                  Welcome to FoodPlanner. These Terms and Conditions ("Terms") govern your use of our website, mobile application, and services (collectively, the "Service"). By accessing and using the Service, you accept and agree to be bound by these Terms. If you do not agree to comply with all of the Terms, please do not use the Service.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="terms-section" id="section2" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">2</span> User Responsibilities
                </h2>
                <p class="section-text">
                  You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized uses of your account or any other breaches of security.
                </p>
                <div class="highlight-box">
                  <i class="fa-solid fa-shield"></i>
                  <p>Keep your login credentials secure and never share your password with anyone.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3 -->
          <div class="terms-section" id="section3" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">3</span> Acceptable Use
                </h2>
                <p class="section-text">
                  You agree not to use the Service in any way that violates any applicable law, regulation, or these Terms. Prohibited behavior includes:
                </p>
                <ul class="terms-list">
                  <li>Harassing or causing distress or inconvenience to any person</li>
                  <li>Obscene or offensive statements or behavior</li>
                  <li>Disrupting normal conversation within our Service</li>
                  <li>Transmitting obscene or offensive content</li>
                  <li>Disrupting the normal flow of dialogue within our Service</li>
                  <li class="easter-egg" title="Built with love by Year 4 legends 🎓">Using the Service to share memes in #general with your homies while procrastinating on your final year project</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Section 4 -->
          <div class="terms-section" id="section4" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">4</span> Intellectual Property
                </h2>
                <p class="section-text">
                  All content included in or made available through the Service, such as text, graphics, logos, images, and software, is the property of FoodPlanner or our content suppliers and is protected by international copyright laws. You may not reproduce, distribute, transmit, modify, or create derivative works based on the content without our prior written permission.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 5 -->
          <div class="terms-section" id="section5" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">5</span> Limitation of Liability
                </h2>
                <p class="section-text">
                  In no event shall FoodPlanner, its directors, employees, or agents be liable to you for any damages arising from your use of the Service or from any content, information, or communications contained therein. We are not liable for indirect, incidental, special, consequential, or punitive damages.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 6 -->
          <div class="terms-section" id="section6" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">6</span> Disclaimers
                </h2>
                <p class="section-text">
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. FOODPLANNER MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, REGARDING THE SERVICE. WE DISCLAIM ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 7 -->
          <div class="terms-section" id="section7" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">7</span> Changes to Terms
                </h2>
                <p class="section-text">
                  FoodPlanner reserves the right to change or modify these Terms at any time. If we make material changes to these Terms, we will notify you by updating the date of these Terms and requiring you to accept the changes. Your continued use of the Service following the posting of revised Terms means you accept the changes.
                </p>
              </div>
            </div>
          </div>

          <!-- Section 8 -->
          <div class="terms-section" id="section8" data-aos="fade-up">
            <div class="section-glass-card">
              <div class="glass-filter"></div>
              <div class="glass-overlay"></div>
              <div class="glass-specular"></div>
              <div class="section-content">
                <h2 class="section-title">
                  <span class="section-number">8</span> Contact Us
                </h2>
                <p class="section-text">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div class="contact-info align-items-center">
                  <div class="contact-item">
                    <i class="fa-solid fa-envelope"></i>
                    <a href="mailto:legal@eatsbuddy.com">legal@eatsbuddy.com</a>
                  </div>
                  <div class="contact-item">
                    <i class="fa-solid fa-phone"></i>
                    <a href="tel:+855080586824">(+855) 080-586-824</a>
                  </div>
                  <div class="contact-item">
                    <i class="fa-solid fa-map-pin"></i>
                    <span>Phnom Penh 120201, Cambodia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acceptance Section -->
        <div class="acceptance-glass-card" data-aos="fade-up">
          <div class="glass-filter"></div>
          <div class="glass-overlay"></div>
          <div class="glass-specular"></div>
          <div class="acceptance-content">
            <h3 class="acceptance-title">
              <i class="fa-solid fa-check-circle"></i> Acknowledgement
            </h3>
            <p class="acceptance-text">
              By using this Service, you acknowledge that you have read these Terms and Conditions and agree to be bound by them. If you do not agree to these Terms, please do not use the Service.
            </p>
            <div class="acceptance-footer">
              <p class="last-updated">Last updated: November 22, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsPage',
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    scrollToSection(e) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      if (href) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
  },
};
</script>

<style scoped>
/* Base Styles */
.terms-page {
  padding-top: 80px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
}

/* Hero Section */
.terms-hero-section {
  position: relative;
  padding: 80px 20px;
  overflow: hidden;
  margin-bottom: 60px;
}

.hero-gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  z-index: -1;
}

.terms-hero-section .container {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.back-btn {
  padding: 8px 16px;
  background: rgba(46, 125, 50, 0.15);
  color: #2e7d32;
  border: 1px solid rgba(46, 125, 50, 0.3);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 32px;
}

.back-btn:hover {
  background: rgba(46, 125, 50, 0.25);
  transform: translateY(-2px);
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 16px;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 18px;
  color: #4a4a4a;
  margin: 0;
  line-height: 1.6;
}

/* Content Section */
.terms-content-section {
  padding: 40px 0 80px;
}

.terms-content-section .container {
  max-width: 900px;
}

/* Table of Contents */
.toc-glass-card {
  --bg-color: rgba(255, 255, 255, 0.55);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 60px;
}

.glass-filter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(5px);
  filter: url(#glass-distortion-terms-content) saturate(130%) brightness(1.2) contrast(1.05);
  z-index: 1;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-color);
  z-index: 2;
}

.glass-specular {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.75),
              inset -1px -1px 2px rgba(0, 0, 0, 0.05);
  z-index: 3;
}

.toc-content {
  position: relative;
  z-index: 4;
  padding: 32px;
}

.toc-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px;
}

.toc-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.toc-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(46, 125, 50, 0.08);
  color: #2e7d32;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid rgba(46, 125, 50, 0.1);
}

.toc-link:hover {
  background: rgba(46, 125, 50, 0.15);
  border-color: rgba(46, 125, 50, 0.2);
  transform: translateX(4px);
}

/* Terms Sections */
.terms-sections {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 60px;
}

.terms-section {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-glass-card {
  --bg-color: rgba(255, 255, 255, 0.55);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.section-glass-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  transform: translateY(-4px);
}

.section-content {
  position: relative;
  z-index: 4;
  padding: 32px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
}

.section-text {
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.8;
  margin: 0 0 16px;
}

.terms-list {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.terms-list li {
  padding: 10px 0 10px 28px;
  position: relative;
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.6;
}

.terms-list li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #2e7d32;
  font-weight: bold;
  font-size: 16px;
}

.terms-list li.easter-egg {
  font-style: italic;
  color: #666;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
}

.terms-list li.easter-egg:hover {
  opacity: 1;
  color: #2e7d32;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(46, 125, 50, 0.2);
}

.terms-list li.easter-egg:before {
  content: '🎓';
  font-size: 14px;
}

/* Highlight Box */
.highlight-box {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(46, 125, 50, 0.08);
  border-radius: 12px;
  border-left: 4px solid #2e7d32;
  margin-top: 16px;
}

.highlight-box i {
  color: #2e7d32;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.highlight-box p {
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.6;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #1a1a1a;
}

.contact-item i {
  color: #2e7d32;
  font-size: 18px;
}

.contact-item a {
  color: #2e7d32;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.contact-item a:hover {
  text-decoration: underline;
}

/* Acceptance Section */
.acceptance-glass-card {
  --bg-color: rgba(46, 125, 50, 0.08);
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
              inset 1px 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(46, 125, 50, 0.2);
  animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.acceptance-content {
  position: relative;
  z-index: 4;
  padding: 40px;
  text-align: center;
}

.acceptance-title {
  font-size: 20px;
  font-weight: 700;
  color: #2e7d32;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.acceptance-title i {
  font-size: 24px;
}

.acceptance-text {
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.8;
  margin: 0 0 24px;
}

.acceptance-footer {
  padding-top: 20px;
  border-top: 1px solid rgba(46, 125, 50, 0.1);
}

.last-updated {
  font-size: 13px;
  color: #999;
  margin: 0;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 42px;
  }

  .section-content {
    padding: 24px;
  }

  .toc-nav {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .terms-hero-section {
    padding: 50px 15px;
    margin-bottom: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .section-content {
    padding: 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .toc-content {
    padding: 24px;
  }

  .toc-title {
    font-size: 20px;
  }

  .acceptance-content {
    padding: 24px;
  }
}

@media (max-width: 576px) {
  .terms-page {
    padding-top: 60px;
  }

  .terms-hero-section {
    padding: 40px 12px;
    margin-bottom: 30px;
  }

  .hero-title {
    font-size: 24px;
    margin-bottom: 12px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .back-btn {
    padding: 6px 12px;
    font-size: 13px;
    margin-bottom: 20px;
  }

  .section-content {
    padding: 16px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .section-text {
    font-size: 14px;
  }

  .terms-list li {
    padding: 8px 0 8px 24px;
    font-size: 14px;
  }

  .toc-content {
    padding: 16px;
  }

  .toc-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .toc-nav {
    gap: 12px;
  }

  .toc-link {
    padding: 10px 12px;
    font-size: 13px;
  }

  .contact-item {
    font-size: 14px;
  }

  .acceptance-content {
    padding: 20px;
  }

  .acceptance-title {
    font-size: 18px;
  }

  .acceptance-text {
    font-size: 14px;
  }
}
/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .hero-subtitle {
    font-size: 0.95rem;
  }
  
  .terms-hero-section {
    padding: 40px 0;
  }
  
  .hero-content {
    padding: 20px;
  }
  
  .back-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
  
  .toc-title {
    font-size: 1.3rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .section-text {
    font-size: 0.95rem;
  }
  
  .terms-content-section {
    padding: 30px 0;
  }
  
  .highlight-box {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 1.5rem !important;
  }
  
  .terms-hero-section {
    padding: 30px 0;
  }
  
  .section-number {
    font-size: 1.5rem;
  }
  
  .toc-link {
    font-size: 0.9rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem !important;
  }
}
</style>
