<template>
  <div class="scanner-page overflow-hidden">
    <section class="scanner-hero">
      <div class="container px-3 px-md-4">
        <nav class="scanner-breadcrumb" aria-label="breadcrumb">
          <router-link to="/">Home</router-link>
          <i class="fa-solid fa-chevron-right"></i>
          <span>AI Image Scanner</span>
        </nav>

        <div class="scanner-hero-grid">
          <div class="scanner-hero-copy" data-aos="fade-up">
            <span class="scanner-eyebrow">Smart meal recognition</span>
            <h1 class="text-wrap">Scan a meal photo and discover what to cook next.</h1>
            <p class="text-wrap">
              Upload a dish image, preview the scan, and jump straight into matching recipe searches.
            </p>
          </div>

          <div class="scanner-status-card" data-aos="zoom-in">
            <i class="fa-solid fa-camera-retro"></i>
            <strong>{{ result || 'Ready to scan' }}</strong>
            <span>{{ statusText }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="scanner-workspace">
      <div class="container px-3 px-md-4">
        <div class="scanner-panel" data-aos="fade-up">
          <div class="scanner-upload-card">
            <input
              ref="fileInput"
              class="visually-hidden"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
            />

            <button class="upload-dropzone" type="button" @click="$refs.fileInput.click()">
              <span class="upload-icon">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </span>
              <strong>{{ previewUrl ? 'Choose another image' : 'Upload meal image' }}</strong>
              <small>JPG, PNG, or WEBP works best</small>
            </button>

            <div v-if="previewUrl" class="preview-shell">
              <img :src="previewUrl" alt="Uploaded meal preview" />
            </div>

            <button v-if="previewUrl" class="reset-scan-btn" type="button" @click="resetScan">
              <i class="fa-solid fa-rotate-left"></i>
              Reset
            </button>
          </div>

          <div class="scanner-result-card">
            <div v-if="!previewUrl" class="empty-scan-state">
              <i class="fa-solid fa-image"></i>
              <h2>Start with a clear plate photo.</h2>
              <p>Use a bright image with the main dish centered for the cleanest match.</p>
            </div>

            <div v-else-if="isScanning" class="loading-scan-state">
              <div class="scan-spinner" aria-hidden="true"></div>
              <h2>Analyzing image...</h2>
              <p>Checking visual cues, color, texture, and plating details.</p>
            </div>

            <div v-else-if="scanError" class="scan-error-state">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <h2>Scan failed</h2>
              <p>{{ scanError }}</p>
              <button class="scanner-action primary" type="button" @click="$refs.fileInput.click()">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                Try another image
              </button>
            </div>

            <div v-else-if="result" class="scan-complete-state">
              <span class="scanner-eyebrow">Detected meal</span>
              <h2>{{ result }}</h2>
              <p>Search matching recipes by the detected name or by its core ingredients.</p>

              <div class="result-actions">
                <router-link
                  class="scanner-action primary"
                  :to="{ path: '/recipes', query: { query: nameSearchTerm } }"
                >
                  <i class="fa-solid fa-magnifying-glass"></i>
                  Search meal by name
                </router-link>
                <router-link
                  v-if="ingredientSearchTerm"
                  class="scanner-action secondary"
                  :to="{ path: '/recipes', query: { ingredient: ingredientSearchTerm } }"
                >
                  <i class="fa-solid fa-carrot"></i>
                  Search meal by ingredients
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const STORED_IMAGE_KEY = 'latestScannerImage';
const MAX_IMAGE_DIM = 1024;
const JPEG_QUALITY = 0.8;

function compressImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_IMAGE_DIM || height > MAX_IMAGE_DIM) {
        const ratio = Math.min(MAX_IMAGE_DIM / width, MAX_IMAGE_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

export default {
  name: 'ImageScannerPage',
  data() {
    return {
      previewUrl: localStorage.getItem(STORED_IMAGE_KEY) || '',
      isScanning: false,
      result: '',
      scanTimer: null,
      nameSearchTerm: '',
      ingredientSearchTerm: '',
      scanError: ''
    };
  },
  computed: {
    statusText() {
      if (this.isScanning) {
        return 'Scan in progress';
      }

      return this.result ? 'Recipe matches are ready' : 'Upload an image to begin';
    }
  },
  mounted() {
    AOS.init();
  },
  beforeUnmount() {
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
    }
  },
  methods: {
    async scanImage(base64) {
      const { data } = await axios.post('/api/ai/scan-image', { image: base64 });
      return data;
    },
    handleImageUpload(event) {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      this.result = '';
      this.scanError = '';
      this.isScanning = true;

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const compressed = await compressImage(reader.result);
          this.previewUrl = compressed;

          try {
            localStorage.setItem(STORED_IMAGE_KEY, compressed);
          } catch (_error) {
            localStorage.removeItem(STORED_IMAGE_KEY);
          }

          const result = await this.scanImage(compressed);
          this.result = result.dishName || 'Unknown Dish';
          this.nameSearchTerm = result.dishName || '';
          this.ingredientSearchTerm = result.ingredients?.[0] || '';
        } catch (error) {
          this.scanError = error.response?.data?.message || error.message || 'Failed to analyze image';
          this.result = '';
        } finally {
          this.isScanning = false;
        }
      };

      reader.readAsDataURL(file);
    },
    resetScan() {
      if (this.scanTimer) {
        clearTimeout(this.scanTimer);
        this.scanTimer = null;
      }

      this.previewUrl = '';
      this.result = '';
      this.isScanning = false;
      this.scanError = '';
      localStorage.removeItem(STORED_IMAGE_KEY);

      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    }
  }
};
</script>

<style scoped>
.scanner-page {
  min-height: 100vh;
  padding-top: clamp(90px, 12vw, 120px);
  color: #111827;
  background: #ffffff;
  font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

.scanner-page .container {
  max-width: 1180px;
}

.scanner-hero {
  padding: 34px 0 58px;
  background:
    radial-gradient(circle at top left, rgba(22, 101, 52, 0.12), transparent 34%),
    radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.1), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f8faf8 100%);
  border-bottom: 1px solid #e5e7eb;
}

.scanner-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 800;
}

.scanner-breadcrumb a {
  color: #14532d;
  text-decoration: none;
}

.scanner-breadcrumb i {
  color: #9ca3af;
  font-size: 10px;
}

.scanner-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 36px;
  align-items: center;
}

.scanner-hero-copy h1 {
  max-width: 760px;
  margin: 0;
  color: #0f172a;
  font-size: clamp(2.8rem, 6vw, 5.2rem);
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.95;
}

.scanner-hero-copy p {
  max-width: 610px;
  margin: 24px 0 0;
  color: #4b5563;
  font-size: 17px;
  line-height: 1.75;
}

.scanner-eyebrow {
  display: inline-flex;
  margin-bottom: 14px;
  color: #14532d;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.scanner-status-card {
  min-height: 250px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 12px;
  padding: 28px;
  text-align: center;
  background:
    radial-gradient(circle at top, rgba(220, 252, 231, 0.72), transparent 46%),
    rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(187, 247, 208, 0.9);
  border-radius: 34px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);
}

.scanner-status-card i {
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(135deg, #166534, #22c55e);
  border-radius: 22px;
  font-size: 30px;
  box-shadow: 0 18px 34px rgba(22, 101, 52, 0.26);
}

.scanner-status-card strong {
  color: #0f172a;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.scanner-status-card span {
  color: #6b7280;
  font-weight: 800;
}

.scanner-workspace {
  padding: 56px 0 82px;
}

.scanner-panel {
  display: grid;
  grid-template-columns: 430px minmax(0, 1fr);
  gap: 24px;
  align-items: stretch;
}

.scanner-upload-card,
.scanner-result-card {
  padding: 26px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 32px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.09);
}

.scanner-upload-card {
  display: grid;
  gap: 18px;
}

.upload-dropzone {
  min-height: 230px;
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 28px;
  color: #14532d;
  background:
    radial-gradient(circle at top, rgba(220, 252, 231, 0.7), transparent 44%),
    #f9fafb;
  border: 2px dashed #86efac;
  border-radius: 26px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.upload-dropzone:hover {
  transform: translateY(-3px);
  border-color: #166534;
  box-shadow: 0 18px 34px rgba(22, 101, 52, 0.14);
}

.upload-icon {
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: #166534;
  border-radius: 22px;
  font-size: 30px;
}

.upload-dropzone strong {
  color: #0f172a;
  font-size: 20px;
  font-weight: 900;
}

.upload-dropzone small {
  color: #6b7280;
  font-weight: 700;
}

.preview-shell {
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: #f3f4f6;
  border-radius: 26px;
  border: 1px solid #e5e7eb;
}

.preview-shell img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.reset-scan-btn {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 16px;
  font-weight: 900;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.reset-scan-btn:hover {
  transform: translateY(-2px);
  background: #fee2e2;
  box-shadow: 0 14px 28px rgba(153, 27, 27, 0.12);
}

.scanner-result-card {
  min-height: 100%;
  display: grid;
  align-items: center;
}

.empty-scan-state,
.loading-scan-state,
.scan-error-state,
.scan-complete-state {
  max-width: 620px;
  margin: 0 auto;
  text-align: center;
}

.empty-scan-state i {
  color: #166534;
  font-size: 52px;
}

.scan-error-state i {
  color: #991b1b;
  font-size: 52px;
}

.empty-scan-state h2,
.loading-scan-state h2,
.scan-error-state h2,
.scan-complete-state h2 {
  margin: 16px 0 10px;
  color: #0f172a;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 900;
  letter-spacing: -0.06em;
}

.empty-scan-state p,
.loading-scan-state p,
.scan-complete-state p {
  margin: 0 auto;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.75;
}

.scan-spinner {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  border: 8px solid #dcfce7;
  border-top-color: #166534;
  border-radius: 50%;
  animation: scannerSpin 0.9s linear infinite;
}

.result-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
}

.scanner-action {
  min-height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  border-radius: 16px;
  font-weight: 900;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.scanner-action:hover {
  transform: translateY(-2px);
}

.scanner-action.primary {
  color: #ffffff;
  background: #166534;
  border: 1px solid #166534;
  box-shadow: 0 14px 28px rgba(22, 101, 52, 0.22);
}

.scanner-action.primary:hover {
  background: #14532d;
  box-shadow: 0 18px 34px rgba(22, 101, 52, 0.28);
}

.scanner-action.secondary {
  color: #14532d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

@keyframes scannerSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 992px) {
  .scanner-hero-grid,
  .scanner-panel {
    grid-template-columns: 1fr;
  }

  .scanner-hero-copy {
    text-align: center;
  }

  .scanner-hero-copy h1,
  .scanner-hero-copy p {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 576px) {
  .scanner-hero {
    padding: 26px 0 42px;
  }

  .scanner-workspace {
    padding: 36px 0 60px;
  }

  .scanner-upload-card,
  .scanner-result-card {
    padding: 18px;
    border-radius: 24px;
  }

  .scanner-hero-copy h1 {
    font-size: clamp(2.2rem, 14vw, 3.5rem);
  }

  .upload-dropzone {
    min-height: 210px;
  }

  .scanner-action {
    width: 100%;
  }
}
</style>
