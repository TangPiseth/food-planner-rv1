<template>
    <div class="EG-Default contact-page-glass">
        <!-- SVG Filter for Glass Distortion -->
        <svg style="display: none">
            <filter id="glass-distortion-contact">
                <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
            </filter>
        </svg>

        <!-- Breadcrumb section -->
        <div class="breadcrumb-section py-5">
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-xl-7 col-lg-8 col-md-10 col-12">
                        <div class="text-center" data-aos="fade-up" data-aos-duration="1300">
                            <nav>
                                <ol class="breadcrumb justify-content-center">
                                    <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">HOME</a></li>
                                    <li class="breadcrumb-item link-secondary active" aria-current="page">CONTACT</li>
                                </ol>
                            </nav>
                            <h1 class="fw-bold pb-2 display-1 hero-title">Contact Us</h1>
                            <p class="hero-subtitle">Reach out to us for any inquiries or support.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Information section -->
        <div class="contact-info-section pt-5">
            <div class="container pt-5">
                <div class="row justify-content-center">
                    <div class="col-lg-4 col-md-6 col-12 d-flex justify-content-center">
                        <div class="glass-card">
                            <div class="glass-filter"></div>
                            <div class="glass-overlay"></div>
                            <div class="glass-specular"></div>
                            <div class="glass-distortion-overlay"></div>
                            <div class="glass-content">
                                <i class="fas fa-location-dot card-icon"></i>
                                <h3>Physical Address</h3>
                                <p>AH1, Phnom Penh 120201</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-12 d-flex justify-content-center">
                        <div class="glass-card">
                            <div class="glass-filter"></div>
                            <div class="glass-overlay"></div>
                            <div class="glass-specular"></div>
                            <div class="glass-distortion-overlay"></div>
                            <div class="glass-content">
                                <i class="fas fa-envelope card-icon"></i>
                                <h3>Email Address</h3>
                                <p>info@eatsbuddy.com</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 col-12 d-flex justify-content-center">
                        <div class="glass-card">
                            <div class="glass-filter"></div>
                            <div class="glass-overlay"></div>
                            <div class="glass-specular"></div>
                            <div class="glass-distortion-overlay"></div>
                            <div class="glass-content">
                                <i class="fas fa-phone card-icon"></i>
                                <h3>Phone Numbers</h3>
                                <p>+855 080 586 824</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="contact-form-section py-5">
            <div class="container py-5">
                <div class="row g-5 align-items-center">
                    <div class="col-lg-6 col-12" data-aos="fade-right" data-aos-duration="1300">
                        <div class="mb-5">
                            <h2 class="fw-bold section-title pb-2">Have any questions?</h2>
                            <p class="section-subtitle">Feel free to contact us for any inquiries or support. We're here to
                                help!</p>
                        </div>
                        <div class="accordion accordion-flush" id="accordionFlushExample">
                            <div class="accordion-item glass-accordion mb-4">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed glass-btn"
                                        type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne"
                                        aria-expanded="false" aria-controls="flush-collapseOne">
                                        🤨 How can I reach customer support?
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body glass-accordion-body">You can reach our customer support via email
                                        at info@eatsbuddy.com or call us at +855 080 586 824.</div>
                                </div>
                            </div>
                            <div class="accordion-item glass-accordion mb-4">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed glass-btn"
                                        type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo"
                                        aria-expanded="false" aria-controls="flush-collapseTwo">
                                        ⏱️ What are your business hours?
                                    </button>
                                </h2>
                                <div id="flush-collapseTwo" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body glass-accordion-body">
                                        Our business hours are Monday to Friday, 9 AM to 6 PM EST.
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item glass-accordion">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed glass-btn"
                                        type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree"
                                        aria-expanded="false" aria-controls="flush-collapseThree">
                                        📍 Where is your office located?
                                    </button>
                                </h2>
                                <div id="flush-collapseThree" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionFlushExample">
                                    <div class="accordion-body glass-accordion-body">
                                        Our office is located at 123 Main Street, Richmond Hill, New York 11419.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-12" data-aos="flip-left" data-aos-duration="1300">
                        <!-- Liquid Glass Contact Form -->
                        <div class="glass-form">
                            <div class="glass-filter"></div>
                            <div class="glass-overlay"></div>
                            <div class="glass-specular"></div>
                            <div class="glass-content">
                                <div class="mb-4">
                                    <h2 class="form-title">Get In Touch</h2>
                                    <p class="form-subtitle">Please fill out the form below and we'll get back to you as soon
                                        as possible.</p>
                                </div>
                                <form class="glass-form-fields" @submit.prevent="handleSubmit">
                                    <div class="form-group">
                                        <input type="text" class="form-control-glass" :class="{ 'is-invalid': errors.name }"
                                            v-model="formData.name" id="name" placeholder="Enter your name">
                                        <div class="invalid-feedback" v-if="errors.name">
                                            {{ errors.name }}
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input type="email" class="form-control-glass" :class="{ 'is-invalid': errors.email }"
                                            v-model="formData.email" id="email" placeholder="name@example.com">
                                        <div class="invalid-feedback" v-if="errors.email">
                                            {{ errors.email }}
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" class="form-control-glass" :class="{ 'is-invalid': errors.subject }"
                                            v-model="formData.subject" id="subject" placeholder="Enter your subject">
                                        <div class="invalid-feedback" v-if="errors.subject">
                                            {{ errors.subject }}
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <textarea class="form-control-glass form-textarea" :class="{ 'is-invalid': errors.message }"
                                            v-model="formData.message" id="message" rows="5"
                                            placeholder="Enter your message"></textarea>
                                        <div class="invalid-feedback" v-if="errors.message">
                                            {{ errors.message }}
                                        </div>
                                    </div>
                                    <button type="submit" class="glass-submit-btn">Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Success Modal -->
        <div class="modal fade" id="successModal" tabindex="-1" ref="successModal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content glass-modal">
                    <div class="modal-header glass-modal-header">
                        <h5 class="modal-title">Message Sent Successfully!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body glass-modal-body">
                        <p>Thank you for contacting us. We will get back to you soon!</p>
                    </div>
                    <div class="modal-footer glass-modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Modal } from 'bootstrap';

export default {
    data() {
        return {
            formData: {
                name: '',
                email: '',
                subject: '',
                message: ''
            },
            errors: {
                name: '',
                email: '',
                subject: '',
                message: ''
            },
            modal: null
        }
    },
    mounted() {
        AOS.init();
        this.modal = new Modal(this.$refs.successModal);
    },
    methods: {
        validateForm() {
            let isValid = true;
            this.errors = {
                name: '',
                email: '',
                subject: '',
                message: ''
            };

            if (!this.formData.name.trim()) {
                this.errors.name = 'Name is required';
                isValid = false;
            }

            if (!this.formData.email.trim()) {
                this.errors.email = 'Email is required';
                isValid = false;
            } else if (!this.validateEmail(this.formData.email)) {
                this.errors.email = 'Please enter a valid email address';
                isValid = false;
            }

            if (!this.formData.subject.trim()) {
                this.errors.subject = 'Subject is required';
                isValid = false;
            }

            if (!this.formData.message.trim()) {
                this.errors.message = 'Message is required';
                isValid = false;
            }

            return isValid;
        },
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        handleSubmit() {
            if (this.validateForm()) {
                // Here you would typically send the data to a server
                console.log('Form submitted:', this.formData);

                // Show success modal
                this.modal.show();

                // Reset form
                this.formData = {
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                };
            }
        }
    }
};
</script>

<style scoped>
/* ===== Liquid Glass Contact Page Styles ===== */

.contact-page-glass {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
}

/* Decorative Blur Circles */
.contact-page-glass::before {
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

.contact-page-glass::after {
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

/* Breadcrumb Section */
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

/* Contact Info Section */
.contact-info-section {
    position: relative;
    z-index: 1;
    background: transparent;
}

/* ===== Glass Card Styles ===== */
.glass-card {
    --bg-color: rgba(255, 255, 255, 0.4);
    --highlight: rgba(255, 255, 255, 0.85);
    --text: #1a1a1a;
    
    position: relative;
    width: 100%;
    max-width: 320px;
    height: 200px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.glass-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
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
    filter: url(#glass-distortion-contact) saturate(120%) brightness(1.15);
}

.glass-distortion-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 80%),
                radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 80%);
    background-size: 300% 300%;
    animation: floatDistort 10s infinite ease-in-out;
    mix-blend-mode: overlay;
    z-index: 2;
    pointer-events: none;
}

@keyframes floatDistort {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 100%; }
    100% { background-position: 0% 0%; }
}

.glass-overlay {
    z-index: 3;
    background: var(--bg-color);
}

.glass-specular {
    z-index: 4;
    box-shadow: inset 1px 1px 1px var(--highlight);
}

.glass-content {
    position: relative;
    z-index: 5;
    padding: 20px;
    color: var(--text);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.card-icon {
    font-size: 2.2rem;
    color: #2e7d32;
    margin-bottom: 10px;
}

.glass-card .glass-content h3 {
    margin: 6px 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
}

.glass-card .glass-content p {
    margin: 0;
    opacity: 0.85;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Contact Form Section */
.contact-form-section {
    position: relative;
    z-index: 1;
}

.section-title {
    color: #1a1a1a;
    font-size: 2rem;
    font-weight: 700;
}

.section-subtitle {
    color: #4a4a4a;
    font-size: 1rem;
}

/* ===== Glass Accordion Styles ===== */
.glass-accordion {
    border: none !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%);
    backdrop-filter: blur(8px);
    border-radius: 15px !important;
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    overflow: hidden;
    transition: all 0.3s ease;
}

.glass-accordion:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 100%);
    border-color: rgba(255, 255, 255, 0.5) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.glass-btn {
    background: transparent !important;
    border: none !important;
    color: #1a1a1a !important;
    padding: 1.2rem !important;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: none !important;
    transition: all 0.3s ease;
}

.glass-btn:not(.collapsed) {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.08) 100%) !important;
    color: #2e7d32 !important;
}

.glass-btn:hover {
    padding-left: 1.5rem !important;
    color: #2e7d32 !important;
}

.glass-btn::after {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%232e7d32' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") !important;
}

.glass-accordion-body {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%);
    color: #4a4a4a;
    padding: 1.2rem !important;
    border: none !important;
    border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* ===== Liquid Glass Form Card ===== */
.glass-form {
    --bg-color: rgba(255, 255, 255, 0.6);
    --highlight: rgba(255, 255, 255, 0.9);
    --text: #1a1a1a;
    --input-bg: rgba(255, 255, 255, 0.5);
    --input-border: rgba(0, 0, 0, 0.1);
    --input-focus: rgba(255, 255, 255, 0.7);
    
    position: relative;
    min-height: 600px;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.glass-form .glass-filter,
.glass-form .glass-overlay,
.glass-form .glass-specular {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}

.glass-form .glass-filter {
    z-index: 1;
    backdrop-filter: blur(4px);
    filter: url(#glass-distortion-contact) saturate(120%) brightness(1.15);
}

.glass-form .glass-overlay {
    z-index: 2;
    background: var(--bg-color);
}

.glass-form .glass-specular {
    z-index: 3;
    box-shadow: inset 1px 1px 1px var(--highlight);
}

.glass-form .glass-content {
    position: relative;
    z-index: 4;
    padding: 2rem;
    color: var(--text);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.glass-card .glass-content {
    position: relative;
    z-index: 5;
    padding: 20px;
    color: var(--text);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.form-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text);
}

.form-subtitle {
    margin: 0;
    color: #4a4a4a;
    font-size: 0.95rem;
    opacity: 0.9;
}

/* ===== Glass Form Fields ===== */
.glass-form-fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
}

.form-group {
    position: relative;
    display: flex;
    flex-direction: column;
}

.form-group i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text);
    opacity: 0.8;
    z-index: 5;
    font-size: 1rem;
}

.form-control-glass {
    width: 100%;
    padding: 12px 15px 12px 45px;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 12px;
    color: var(--text);
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(2px);
}

.form-control-glass::placeholder {
    color: rgba(26, 26, 26, 0.5);
}

.form-control-glass:focus {
    outline: none;
    background: var(--input-focus);
    border-color: rgba(46, 125, 50, 0.3);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.08);
}

.form-textarea {
    resize: none;
    padding-top: 12px !important;
}

.invalid-feedback {
    color: #d32f2f;
    font-size: 0.85rem;
    margin-top: 0.3rem;
    display: block;
}

.form-control-glass.is-invalid {
    border-color: #d32f2f !important;
    background: rgba(211, 47, 47, 0.08);
}

/* ===== Submit Button ===== */
.glass-submit-btn {
    width: 100%;
    padding: 12px 20px;
    background: linear-gradient(135deg, rgba(46, 125, 50, 0.3) 0%, rgba(56, 142, 60, 0.2) 100%);
    border: 1px solid rgba(46, 125, 50, 0.3);
    border-radius: 12px;
    color: #2e7d32;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.glass-submit-btn:hover {
    background: linear-gradient(135deg, rgba(46, 125, 50, 0.4) 0%, rgba(56, 142, 60, 0.3) 100%);
    border-color: rgba(46, 125, 50, 0.5);
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.15);
    transform: translateY(-2px);
}

.glass-submit-btn:active {
    transform: translateY(0);
}

/* ===== Modal Glass Effect ===== */
.glass-modal {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.glass-modal-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background: transparent;
    color: #1a1a1a;
}

.glass-modal-body {
    color: #4a4a4a;
    padding: 1.5rem;
}

.glass-modal-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    background: transparent;
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.2rem !important;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .glass-form {
        min-height: auto;
    }

    .glass-content {
        padding: 1.5rem;
    }

    .form-title {
        font-size: 1.5rem;
    }
    
    .breadcrumb-section {
        padding: 30px 0 !important;
    }
    
    .hero-subtitle {
        font-size: 0.95rem;
    }
    
    .contact-info-section {
        padding-top: 30px !important;
    }
    
    .glass-card {
        margin-bottom: 20px;
    }
    
    .glass-card h3 {
        font-size: 1.1rem;
    }
    
    .glass-card p {
        font-size: 0.9rem;
    }
    
    .contact-form-section {
        padding-top: 30px !important;
        padding-bottom: 30px !important;
    }
    
    .glass-accordion .accordion-button {
        font-size: 0.9rem;
        padding: 12px;
    }
    
    .glass-accordion-body {
        font-size: 0.85rem;
    }
}

@media (max-width: 576px) {
    .hero-title {
        font-size: 1.8rem !important;
    }

    .glass-form {
        border-radius: 16px;
    }

    .glass-content {
        padding: 1.2rem;
    }

    .form-group i {
        font-size: 0.9rem;
    }

    .form-control-glass {
        font-size: 0.9rem;
    }
    
    .breadcrumb-section {
        padding: 20px 0 !important;
    }
    
    .contact-info-section .col-lg-4,
    .contact-info-section .col-md-6 {
        margin-bottom: 15px;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .hero-title {
        font-size: 2.5rem !important;
    }
    
    .section-title {
        font-size: 1.75rem;
    }
}

/* Animations */
.shadow-none {
    box-shadow: none !important;
}

.modal-content {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>