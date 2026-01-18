<template>
  <div class="clipping-overlay">
    <div class="clip-interface glass-panel">
      <!-- Timeline -->
      <div class="timeline-container">
        <div class="timeline-track" ref="trackRef">
          <div class="timeline-bg"></div>
          <div 
            class="timeline-selection"
            :style="{ left: startPercent + '%', width: (endPercent - startPercent) + '%' }"
          ></div>
          <div 
            class="timeline-handle" 
            :style="{ left: startPercent + '%' }"
            @mousedown.prevent="startDrag('start')"
          >
            <div class="handle-tooltip">{{ formatDuration(clipStart) }}</div>
          </div>
          <div 
            class="timeline-handle" 
            :style="{ left: endPercent + '%' }"
            @mousedown.prevent="startDrag('end')"
          >
            <div class="handle-tooltip">{{ formatDuration(clipEnd) }}</div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="clip-actions">
        <button @click="togglePlay" class="action-btn icon-only">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path v-if="!isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path v-if="isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <div class="time-inputs gap-2 flex items-center">
          <div class="input-group">
            <span class="text-xs text-slate-400 mb-1 block">Start (s)</span>
            <input 
              type="number" 
              v-model.number="clipStart" 
              @change="validateInputs"
              step="0.01"
              min="0"
              :max="clipEnd"
              class="video-input"
            />
          </div>
          <span class="text-slate-500 mt-5">-</span>
          <div class="input-group">
            <span class="text-xs text-slate-400 mb-1 block">End (s)</span>
            <input 
              type="number" 
              v-model.number="clipEnd" 
              @change="validateInputs"
              step="0.01"
              :min="clipStart"
              :max="duration"
              class="video-input"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="$emit('close')" class="action-btn text-slate-400 hover:text-white">
            Cancel
          </button>
          <button @click="generateClip" class="action-btn primary" :disabled="generating">
            {{ generating ? 'Processing...' : 'Save Clip' }}
          </button>
        </div>
      </div>
      
      <div v-if="generatedClip" class="generated-box animate-in mt-4">
        <p class="text-xs text-slate-400 mb-2">Clip Ready!</p>
        <a :href="`${apiBaseUrl}/uploads/clips/${generatedClip.clip.filename}`" download class="download-link glass-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Clip
        </a>
      </div>
      
      <div v-if="clipError" class="text-red-400 text-sm mt-2 text-center">
        {{ clipError }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  videoElement: {
    type: Object, // HTMLVideoElement
    default: null
  }
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const emit = defineEmits(['close', 'clipCreated']);

const clipStart = ref(0);
const clipEnd = ref(5);
const generating = ref(false);
const generatedClip = ref(null);
const clipError = ref(null);
const isPlaying = ref(false);
const isLooping = ref(false);

const trackRef = ref(null);
const draggingHandle = ref(null);

const duration = computed(() => props.video.metadata?.duration || 100);

const startPercent = computed(() => (clipStart.value / duration.value) * 100);
const endPercent = computed(() => (clipEnd.value / duration.value) * 100);

const formatDuration = (seconds) => {
  if (typeof seconds === 'undefined' || seconds === null) return "00:00:00";
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

const validateInputs = () => {
  // Clamp start and round to 2 decimals
  const maxStart = clipEnd.value - 0.01; // minimal gap
  let newStart = Math.min(Math.max(0, clipStart.value), maxStart);
  clipStart.value = Math.round(newStart * 100) / 100;
  
  // Clamp end and round to 2 decimals
  const minEnd = clipStart.value + 0.01;
  let newEnd = Math.max(Math.min(duration.value, clipEnd.value), minEnd);
  clipEnd.value = Math.round(newEnd * 100) / 100;

  // Update video time to preview change
  if (props.videoElement) {
    props.videoElement.currentTime = clipStart.value;
  }
};


const togglePlay = () => {
  if (!props.videoElement) return;
  if (props.videoElement.paused) {
    // If outside range, jump to start
    if (props.videoElement.currentTime < clipStart.value || props.videoElement.currentTime >= clipEnd.value) {
         props.videoElement.currentTime = clipStart.value;
         isLooping.value = true; // Actively seeking to start
    }
    props.videoElement.play();
    isPlaying.value = true;
  } else {
    props.videoElement.pause();
    isPlaying.value = false;
  }
};

const checkTime = () => {
  if (!props.videoElement) return;
  // Ignore checks while seeking to avoid race conditions
  if (props.videoElement.seeking) return;

  const currentTime = props.videoElement.currentTime;

  // Handle looping state guard
  if (isLooping.value) {
      // If we are close to start, we have successfully looped
      if (Math.abs(currentTime - clipStart.value) < 1.0) {
          isLooping.value = false;
      } else {
          // Still at old position (likely end), ignore this check
          return;
      }
  }

  if (currentTime >= clipEnd.value) {
    props.videoElement.pause();
    props.videoElement.currentTime = clipEnd.value; // Snap to end
    isPlaying.value = false;
  }
};

const onPlay = () => { isPlaying.value = true; };
const onPause = () => { isPlaying.value = false; };

const startDrag = (handle) => {
  draggingHandle.value = handle;
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e) => {
  if (!draggingHandle.value || !trackRef.value) return;

  const rect = trackRef.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const width = rect.width;
  let percent = (offsetX / width) * 100;
  
  percent = Math.max(0, Math.min(100, percent));
  
  // Round to 2 decimal places
  let newValue = (percent / 100) * duration.value;
  newValue = Math.round(newValue * 100) / 100;
  
  if (draggingHandle.value === 'start') {
    const maxStart = clipEnd.value - 0.01; 
    let val = Math.min(Math.max(0, newValue), maxStart);
    clipStart.value = Math.round(val * 100) / 100;
    
    if (props.videoElement) props.videoElement.currentTime = clipStart.value;
  } else {
    const minEnd = clipStart.value + 0.01;
    let val = Math.max(Math.min(duration.value, newValue), minEnd);
    clipEnd.value = Math.round(val * 100) / 100;
    
    if (props.videoElement) props.videoElement.currentTime = clipEnd.value;
  }
};

const stopDrag = () => {
  draggingHandle.value = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  
  if(props.videoElement) {
      props.videoElement.removeEventListener('timeupdate', checkTime);
      props.videoElement.removeEventListener('play', onPlay);
      props.videoElement.removeEventListener('pause', onPause);
      props.videoElement.pause();
  }
});


onMounted(() => {
    if(props.videoElement) {
        // Initialize range
        clipStart.value = 0;
        let d = props.videoElement.duration || duration.value;
        clipEnd.value = Math.round(d * 100) / 100;
        
        props.videoElement.pause();
        isPlaying.value = false;
        

        props.videoElement.addEventListener('timeupdate', checkTime);
        props.videoElement.addEventListener('play', onPlay);
        props.videoElement.addEventListener('pause', onPause);
    }
});

const generateClip = async () => {
  if (clipStart.value >= clipEnd.value) {
    clipError.value = "Start time must be less than end time";
    return;
  }
  
  generating.value = true;
  clipError.value = null;
  generatedClip.value = null;

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/videos/clip/${props.video._id}`, {
      startTime: clipStart.value,
      endTime: clipEnd.value,
      name: `Clip from ${props.video.originalName}`
    });

    generatedClip.value = response.data;
    emit('clipCreated', response.data.clip);
  } catch (err) {
    console.error("Clip generation failed:", err);
    clipError.value = err.response?.data?.error || "Failed to generate clip";
  } finally {
    generating.value = false;
  }
};
</script>

<style scoped>

.clipping-overlay {

  position: relative; 
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.clip-interface {
  padding: 1.5rem;
  width: 100%;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  backdrop-filter: blur(4px);
}

.clip-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.action-btn.icon-only {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.icon-only:hover {
  background: rgba(255, 255, 255, 0.2);
}

.action-btn.primary {
  background: linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.action-btn.primary:hover {
  filter: brightness(1.1);
}

.action-btn.primary:disabled {
  opacity: 0.7;
  cursor: wait;
}

.time-inputs {
  display: flex;
  align-items: flex-start;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.video-input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  width: 80px;
  font-family: monospace;
  font-size: 0.875rem;
  text-align: center;
}

.video-input:focus {
  outline: none;
  border-color: #22d3ee;
  background: rgba(0, 0, 0, 0.6);
}


.timeline-container {
  padding: 1.5rem 0.5rem 0.5rem;
  margin-bottom: 0.5rem;
}

.timeline-track {
  position: relative;
  height: 6px;
  width: 100%;
  border-radius: 3px;
  cursor: pointer;
}

.timeline-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.timeline-selection {
  position: absolute;
  top: 0;
  bottom: 0;
  background: linear-gradient(to right, #22d3ee, #a855f7);
  border-radius: 3px;
  z-index: 2;
}

.timeline-handle {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transform: translate(-50%, -50%);
  cursor: col-resize;
  z-index: 3;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s;
}

.timeline-handle:hover,
.timeline-handle:active {
  transform: translate(-50%, -50%) scale(1.2);
  background-color: #22d3ee;
}

.handle-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background-color: rgba(15, 23, 42, 0.9);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  border: 1px solid rgba(255,255,255,0.1);
}

.timeline-handle:hover .handle-tooltip,
.timeline-handle:active .handle-tooltip {
  opacity: 1;
}

.generated-box {
  background-color: rgba(30, 41, 59, 0.5);
  border-radius: 0.75rem;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.download-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
