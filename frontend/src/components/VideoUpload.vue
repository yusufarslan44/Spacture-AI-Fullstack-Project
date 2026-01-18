<template>
  <div
    class="upload-container group"
    :class="{ 'dragging': dragging }"
    @dragenter.prevent="dragging = true"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="handleDrop"
  >

    <div class="gradient-border">
      <div class="gradient-inner"></div>
    </div>


    <div v-if="dragging || store.uploading" class="background-glow"></div>

    <div class="upload-wrapper center-col">

      <div class="hero-section">
        <h2 class="hero-main-title">Transform Your Video Content</h2>
        <p class="hero-main-description">
          Upload, analyze, and clip your videos with AI-powered precision.
          <br />
          Fast, secure, and intuitive.
        </p>
      </div>


      <div class="upload-card center-col">

        <transition name="fade">
          <div v-if="store.uploading" class="uploading-overlay center-col">
            <div class="loader-container">
              <div class="loader-ring-bg"></div>
              <div class="loader-ring-active"></div>
              <div class="loader-icon center-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
            </div>
            <h3 class="uploading-title">Uploading Video...</h3>
            <p class="uploading-text">Please wait while we process your file.</p>
          </div>
        </transition>


        <div class="idle-content center-col" :class="{ 'dragging-state': dragging }">
          <div class="upload-icon-wrapper">
            <div class="icon-glow"></div>
            <div class="icon-box center-flex group-hover:border-cyan-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon-main group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          </div>

          <h3 class="upload-title">Drag & Drop Video</h3>
          <p class="upload-description">
            Support for <strong>MP4, MOV, AVI, MKV, and more</strong>
            <span>Max file size 500MB</span>
          </p>

          <div class="browse-btn-wrapper group/btn">
            <div class="btn-glow group-hover/btn:opacity-100"></div>
            <button @click="$refs.fileInput.click()" class="upload-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="btn-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Browse Files</span>
            </button>
          </div>
        </div>

        <input
          type="file"
          ref="fileInput"
          class="hidden-input"
          accept="video/*"
          @change="handleFileSelect"
        />
      </div>
    </div>


    <transition name="slide-up">
      <div v-if="store.error" class="error-toast">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="error-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ store.error }}
        <button @click="store.error = null" class="close-btn">&times;</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVideoStore } from "../stores/video";

const store = useVideoStore();
const fileInput = ref(null);
const dragging = ref(false);

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) uploadFile(file);
};

const handleDrop = (event) => {
  dragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) uploadFile(file);
};

const uploadFile = async (file) => {
  try {
    await store.uploadVideo(file);
  } catch (err) {
    // Error is handled in store state
  }
};
</script>

<style scoped>

.upload-container {
  position: relative;
  border-radius: 1.5rem;
  transition: transform 0.5s ease-out;
}

.upload-container.dragging {
  transform: scale(1.02);
}


.gradient-border {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  padding: 2px;
  background: linear-gradient(to right, #334155, #475569, #334155);
  transition: all 0.5s ease;
}

.group:hover .gradient-border {
  background: linear-gradient(to right, #475569, #64748b, #475569);
}

.upload-container.dragging .gradient-border {
  background: linear-gradient(to right, #22d3ee, #a855f7, #ec4899);
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

.gradient-inner {
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.9);
  border-radius: 1.375rem;
  backdrop-filter: blur(24px);
}


.background-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(34, 211, 238, 0.3),
    rgba(168, 85, 247, 0.3),
    rgba(236, 72, 153, 0.3)
  );
  filter: blur(40px);
  border-radius: 1.5rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}


.upload-wrapper {
  position: relative;
  width: 100%;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
}

@media (min-width: 768px) {
  .upload-wrapper {
    gap: 4rem;
    padding: 3rem 2rem;
  }
}


.hero-section {
  text-align: center;
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
}

.hero-main-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #67e8f9 50%, #94a3b8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .hero-main-title {
    font-size: 3.75rem;
  }
}

@media (min-width: 1024px) {
  .hero-main-title {
    font-size: 4.5rem;
  }
}

.hero-main-description {
  font-size: 1rem;
  color: #94a3b8;
  font-weight: 300;
  line-height: 1.6;
  max-width: 36rem;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .hero-main-description {
    font-size: 1.125rem;
  }
}


.upload-card {
  position: relative;
  width: 100%;
  max-width: 56rem;
  padding: 3rem 2rem;
  text-align: center;
}

@media (min-width: 768px) {
  .upload-card {
    padding: 4rem 3rem;
  }
}


.uploading-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.95);
  z-index: 20;
  border-radius: 1.375rem;
}

.loader-container {
  position: relative;
  width: 5rem;
  height: 5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .loader-container {
    width: 6rem;
    height: 6rem;
  }
}

.loader-ring-bg {
  position: absolute;
  inset: 0;
  border: 4px solid #334155;
  border-radius: 9999px;
}

.loader-ring-active {
  position: absolute;
  inset: 0;
  border: 4px solid #06b6d4;
  border-radius: 9999px;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

.loader-icon {
  position: absolute;
  inset: 0;
  color: #06b6d4;
}

.icon-bounce {
  width: 2rem;
  height: 2rem;
  animation: bounce 1s infinite;
}

@media (min-width: 768px) {
  .icon-bounce {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.uploading-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .uploading-title {
    font-size: 1.5rem;
  }
}

.uploading-text {
  color: #94a3b8;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .uploading-text {
    font-size: 1rem;
  }
}


.idle-content {
  position: relative;
  z-index: 10;
  transition: all 0.5s ease-out;
  width: 100%;
}

.idle-content.dragging-state {
  transform: scale(0.95);
  opacity: 0.6;
}

.upload-icon-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  margin: 0 auto 2rem;
  flex-shrink: 0;
}

.upload-icon-wrapper:hover {
  animation: float 3s ease-in-out infinite;
}

@media (min-width: 768px) {
  .upload-icon-wrapper {
    width: 88px;
    height: 88px;
    margin-bottom: 2.5rem;
  }
}


.icon-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom right,
    rgba(6, 182, 212, 0.2),
    rgba(147, 51, 234, 0.2)
  );
  border-radius: 1.5rem;
  filter: blur(24px);
  transition: all 0.5s;
}

.group:hover .icon-glow {
  filter: blur(40px);
}

.icon-box {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #1e293b, #0f172a);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s;
}

.group:hover .icon-box {
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 10px 15px -3px rgba(34, 211, 238, 0.2);
}

.icon-main {
  width: 2.75rem;
  height: 2.75rem;
  color: #22d3ee;
  transition: all 0.5s;
}

.group:hover .icon-main {
  color: #67e8f9;
  transform: scale(1.1);
}

@media (min-width: 768px) {
  .icon-main {
    width: 3.5rem;
    height: 3.5rem;
  }
}


.upload-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .upload-title {
    font-size: 2.25rem;
    margin-bottom: 1.25rem;
  }
}


.upload-description {
  color: #94a3b8;
  font-size: 0.9375rem;
  line-height: 1.5;
  max-width: 24rem;
  margin: 0 auto 2.5rem;
  padding: 0 1rem;
}

.upload-description strong {
  color: #22d3ee;
  font-weight: 600;
}

.upload-description span {
  display: block;
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.875em;
}

@media (min-width: 768px) {
  .upload-description {
    font-size: 1rem;
    max-width: 26rem;
    margin-bottom: 3rem;
  }
}


.browse-btn-wrapper {
  position: relative;
  display: inline-block;
}

.btn-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(to right, #22d3ee, #a855f7, #ec4899);
  border-radius: 1rem;
  filter: blur(16px);
  opacity: 0.4;
  transition: all 0.5s;
}

.upload-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 1rem 2.25rem;
  background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #7c3aed 100%);
  color: white;
  font-size: 0.9375rem;
  font-weight: 700;
  border-radius: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px -5px rgba(139, 92, 246, 0.35);
  backdrop-filter: blur(4px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  white-space: nowrap;
  margin: 0;
}

.upload-button:hover {
  background: linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #8b5cf6 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 20px 40px -8px rgba(139, 92, 246, 0.5);
  border-color: rgba(255, 255, 255, 0.25);
}

.upload-button:active {
  transform: translateY(0) scale(0.98);
}

@media (min-width: 768px) {
  .upload-button {
    padding: 1.125rem 2.75rem;
    font-size: 1rem;
  }
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}


.hidden-input {
  display: none;
}


.error-toast {
  position: absolute;
  bottom: -4rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: max-content;
  max-width: 90%;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #fecaca;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  z-index: 50;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #f87171;
}

.close-btn {
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.close-btn:hover {
  color: white;
}
</style>
