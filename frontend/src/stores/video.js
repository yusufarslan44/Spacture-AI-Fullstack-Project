import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

export const useVideoStore = defineStore('video', () => {
    const currentVideo = ref(null)
    const uploading = ref(false)
    const error = ref(null)

    async function uploadVideo(file) {
        if (!file.type.startsWith('video/')) {
            error.value = "Please upload a valid video file."
            return
        }

        uploading.value = true
        error.value = null

        const formData = new FormData()
        formData.append('video', file)

        try {
            const response = await axios.post('http://localhost:3000/api/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            // Backend returns { message, video: { ... } }
            currentVideo.value = response.data.video
            return response.data.video
        } catch (err) {
            console.error("Upload error:", err)
            error.value = err.response?.data?.error || "Upload failed. Please try again."
            throw err
        } finally {
            uploading.value = false
        }
    }

    function clearCurrentVideo() {
        currentVideo.value = null
        error.value = null
    }

    return {
        currentVideo,
        uploading,
        error,
        uploadVideo,
        clearCurrentVideo
    }
})
