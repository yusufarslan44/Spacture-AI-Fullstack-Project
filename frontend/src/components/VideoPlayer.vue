<template>
  <div class="player-container animate-in">
    <div class="player-grid">
      <!-- Main Player Column -->
      <div class="main-column">
        <div class="video-card group">
          <video
            v-if="videoUrl"
            :src="videoUrl"
            controls
            class="video-element"
          ></video>

          <!-- Overlay Gradient -->
          <div class="video-overlay group-hover:opacity-100"></div>
        </div>

        <div class="video-info-card">
          <div class="video-info-content">
            <h2 class="video-title">
              {{ video.originalName }}
            </h2>
            <p class="video-filename">
              {{ video.filename }}
            </p>
          </div>
          <div class="video-badges">
            <span class="badge badge-primary">Video</span>
            <!-- Future 'Processed' or 'Ready' badge -->
          </div>
        </div>
      </div>

      <!-- Metadata Sidebar -->
      <div class="sidebar-column">
        <div class="metadata-card">
          <h3 class="metadata-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon-lg text-purple"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            File Metadata
          </h3>

          <div class="metadata-list">
            <!-- Duration -->
            <div class="metadata-item group">
              <div class="metadata-icon-box bg-purple-soft group-hover:bg-purple-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="metadata-text">
                <span class="metadata-label">Duration</span>
                <span class="metadata-value">{{ formatDuration(video.metadata?.duration) }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Resolution -->
            <div class="metadata-item group">
              <div class="metadata-icon-box bg-cyan-soft group-hover:bg-cyan-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </div>
              <div class="metadata-text">
                <span class="metadata-label">Resolution</span>
                <span class="metadata-value">{{ video.metadata?.width }} x {{ video.metadata?.height }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Frame Rate -->
            <div class="metadata-item group">
              <div class="metadata-icon-box bg-green-soft group-hover:bg-green-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div class="metadata-text">
                <span class="metadata-label">Frame Rate</span>
                <span class="metadata-value">{{ Math.round(video.metadata?.frameRate || 0) }} FPS</span>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Codec -->
            <div class="metadata-item group">
              <div class="metadata-icon-box bg-pink-soft group-hover:bg-pink-hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <div class="metadata-text">
                <span class="metadata-label">Codec</span>
                <span class="metadata-value">{{ video.metadata?.codec }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
});

const videoUrl = computed(() => {
  if (!props.video || !props.video.filename) return "";
  return `http://localhost:3000/uploads/${props.video.filename}`;
});

const formatDuration = (seconds) => {
  if (!seconds) return "N/A";
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};
</script>

<style scoped>
/* Main Container & Grid */
.player-container {
  width: 100%;
}

.player-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1280px) {
  .player-grid {
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
}

/* Columns */
.main-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Video Card */
.video-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background-color: black;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (min-width: 768px) {
  .video-card {
    border-radius: 1.25rem;
  }
}

.video-element {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.video-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Video Info Card */
.video-info-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  background-color: rgba(30, 41, 59, 0.5);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .video-info-card {
    flex-direction: row;
    align-items: center;
    padding: 1.25rem;
  }
}

.video-info-content {
  flex: 1;
  min-width: 0;
}

.video-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.025em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

@media (min-width: 768px) {
  .video-title {
    font-size: 1.25rem;
  }
}

.video-filename {
  font-size: 0.875rem;
  color: #94a3b8;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Badges */
.video-badges {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.badge {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  white-space: nowrap;
}

.badge-primary {
  background-color: rgba(6, 182, 212, 0.1);
  color: #22d3ee;
  border-color: rgba(6, 182, 212, 0.2);
}

/* Metadata Card */
.metadata-card {
  background-color: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.25rem;
  backdrop-filter: blur(4px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .metadata-card {
    border-radius: 1.25rem;
    padding: 1.5rem;
  }
}

.metadata-title {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .metadata-title {
    font-size: 1.125rem;
  }
}

.metadata-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.metadata-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (min-width: 768px) {
  .metadata-item {
    gap: 1rem;
  }
}

.metadata-icon-box {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .metadata-icon-box {
    padding: 0.625rem;
  }
}

.metadata-text {
  flex: 1;
  min-width: 0;
}

.metadata-label {
  display: block;
  color: #64748b;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 0.125rem;
}

.metadata-value {
  display: block;
  color: #e2e8f0;
  font-family: monospace;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .metadata-value {
    font-size: 1rem;
  }
}

.divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 0.5rem 0;
}

/* Icons */
.icon-lg {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 768px) {
  .icon-lg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.icon-md {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 768px) {
  .icon-md {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* Colors */
.text-purple { color: #a855f7; }
.bg-purple-soft { background-color: rgba(51, 65, 85, 0.3); color: #c084fc; }
.bg-purple-hover { background-color: rgba(168, 85, 247, 0.2); }

.bg-cyan-soft { background-color: rgba(51, 65, 85, 0.3); color: #22d3ee; }
.bg-cyan-hover { background-color: rgba(6, 182, 212, 0.2); }

.bg-green-soft { background-color: rgba(51, 65, 85, 0.3); color: #4ade80; }
.bg-green-hover { background-color: rgba(34, 197, 94, 0.2); }

.bg-pink-soft { background-color: rgba(51, 65, 85, 0.3); color: #f472b6; }
.bg-pink-hover { background-color: rgba(236, 72, 153, 0.2); }

.animate-in {
  animation: slideIn 0.4s ease-out forwards;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
