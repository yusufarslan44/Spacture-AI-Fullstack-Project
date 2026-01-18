<template>
  <main>
    <!-- Upload Section -->
    <transition name="slide-up" mode="out-in">
      <section v-if="!store.currentVideo" key="upload">
        <VideoUpload />
      </section>

      <!-- Player Section -->
      <section v-else key="player" class="player-section">
        <div class="player-header">
          <div class="player-text-content">
            <h2 class="player-title">
              <span class="title-indicator"></span>
              Input Video
            </h2>
            <p class="player-subtitle">Review metadata and generate clips</p>
          </div>

          <div class="relative group/back">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover/back:opacity-60 transition-all duration-500"
            ></div>
            <button @click="store.clearCurrentVideo()" class="upload-new-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="button-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span class="button-text">Upload New</span>
            </button>
          </div>
        </div>

        <div class="video-player-container">
          <VideoPlayer :video="store.currentVideo" />
        </div>
      </section>
    </transition>
  </main>
</template>

<script setup>
import { useVideoStore } from "../stores/video";
import VideoUpload from "../components/VideoUpload.vue";
import VideoPlayer from "../components/VideoPlayer.vue";

const store = useVideoStore();
</script>

<style scoped>
/* Main Content */
main {
  position: relative;
  z-index: 10;
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Upload Section - Full Screen */
main section[key="upload"] {
  width: 100%;
  flex: 1 1 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
}

/* Player Section - Wide Layout */
.player-section {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.player-text-content {
  flex: 1 1 auto;
  min-width: 200px;
}

@media (min-width: 768px) {
  .player-section {
    padding: 2rem 1rem;
  }

  .player-header {
    align-items: center;
    flex-wrap: nowrap;
  }
}

/* Player Section Styles */
.player-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .player-title {
    font-size: 1.875rem;
  }
}

.title-indicator {
  display: block;
  width: 0.375rem;
  height: 2rem;
  background: linear-gradient(to bottom, #22d3ee, #a855f7, #ec4899);
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(34, 211, 238, 0.5);
}

@media (min-width: 768px) {
  .title-indicator {
    height: 2.5rem;
  }
}

.player-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-left: 1.25rem;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .player-subtitle {
    font-size: 1rem;
  }
}

/* Upload New Button */
.upload-new-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.upload-new-button:hover {
  background-color: rgba(51, 65, 85, 0.8);
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 20px 25px -5px rgba(34, 211, 238, 0.2);
}

@media (min-width: 768px) {
  .upload-new-button {
    padding: 0.75rem 1.75rem;
  }
}

.button-icon {
  width: 1rem;
  height: 1rem;
  color: #22d3ee;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-new-button:hover .button-icon {
  color: #67e8f9;
  transform: translateX(-0.25rem);
}

@media (min-width: 768px) {
  .button-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.button-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
  transition: color 0.3s ease;
}

.upload-new-button:hover .button-text {
  color: white;
}

@media (min-width: 768px) {
  .button-text {
    font-size: 1rem;
  }
}

/* Video Player Container */
.video-player-container {
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .video-player-container {
    padding: 0.75rem;
  }
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  main section[key="upload"] {
    padding: 4rem 1rem;
  }

  main section[key="upload"] > div:first-child {
    margin-bottom: 3rem;
  }

  main section[key="player"] {
    padding: 2rem 1rem;
  }

  main section[key="player"] > div:first-child {
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: nowrap;
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
