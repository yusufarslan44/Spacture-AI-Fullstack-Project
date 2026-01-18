<template>
  <div class="clips-gallery animate-in">
    <div class="gallery-header">
      <h3 class="gallery-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Saved Clips
      </h3>
      <button @click="fetchClips" class="refresh-btn" title="Refresh Clips">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="{'animate-spin': loading}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <div v-if="loading && clips.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>Loading clips...</p>
    </div>

    <div v-else-if="clips.length === 0" class="empty-state">
      <p>No clips saved yet.</p>
    </div>

    <div v-else class="clips-grid">
      <div v-for="clip in clips" :key="clip._id" class="clip-card group">
        <div class="clip-info">
          <h4 class="clip-name">{{ clip.name }}</h4>
          <span class="clip-meta">
            {{ formatDuration(clip.startTime) }} - {{ formatDuration(clip.endTime) }}
          </span>
        </div>
        
        <div class="clip-actions">
          <a :href="`${import.meta.env.VITE_API_BASE_URL}/uploads/clips/${clip.filename}`" download class="action-btn download" title="Download">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <button @click="deleteClip(clip._id)" class="action-btn delete" title="Delete">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  videoId: {
    type: String,
    default: null
  },
  fetchAll: {
    type: Boolean,
    default: false
  }
});

const clips = ref([]);
const loading = ref(false);

const fetchClips = async () => {
  if(!props.videoId && !props.fetchAll) return;
  
  loading.value = true;
  try {
    let url = props.fetchAll 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/videos/clips/all`
      : `${import.meta.env.VITE_API_BASE_URL}/api/videos/clips/${props.videoId}`;
      
    const response = await axios.get(url);
    clips.value = response.data;
  } catch (err) {
    console.error("Failed to fetch clips", err);
  } finally {
    loading.value = false;
  }
};

const deleteClip = async (id) => {
  if(!confirm("Are you sure you want to delete this clip?")) return;
  
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/videos/clips/${id}`);
    clips.value = clips.value.filter(c => c._id !== id);
  } catch (err) {
    console.error("Failed to delete clip", err);
    alert("Failed to delete clip");
  }
};

const formatDuration = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5); // MM:SS
};

onMounted(fetchClips);

watch(() => props.videoId, (newId) => {
  if(newId) fetchClips();
});

// Expose refresh method for parent
defineExpose({ fetchClips });
</script>

<style scoped>
.clips-gallery {
  margin-top: 2rem;
  width: 100%;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.gallery-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn {
  color: #94a3b8;
  padding: 0.25rem;
  transition: color 0.2s;
}

.refresh-btn:hover {
  color: white;
}

.clips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.clip-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.clip-card:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.clip-info {
  flex: 1;
  min-width: 0;
  margin-right: 1rem;
}

.clip-name {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.clip-meta {
  color: #64748b;
  font-size: 0.75rem;
  font-family: monospace;
}

.clip-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.4rem;
  border-radius: 0.5rem;
  color: #94a3b8;
  background: rgba(255,255,255,0.05);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.action-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.875rem;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
