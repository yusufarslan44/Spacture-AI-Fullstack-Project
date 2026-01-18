# Spacture AI Fullstack Project

A modern, full-stack video processing application built with Vue.js 3, Node.js, and MongoDB.

## Features

-   **Video Upload**: Drag & drop interface for uploading videos.
-   **Metadata Extraction**: Automatic extraction of video duration, resolution, frame rate, and codec using FFmpeg.
-   **Video Playback**: Custom video player with metadata display.
-   **Video Clipping**:
    -   Interactive timeline slider to select start and end points.
    -   Precision inputs for specific timestamps.
    -   Real-time playback of selected range.
    -   Backend processing to generate clip files.
-   **Clip Management**:
    -   Save generated clips to database.
    -   View saved clips in a gallery (Video specific & Global).
    -   Download or delete clips.
-   **Data Persistence**: Videos and clips are persisted in MongoDB.

## Tech Stack

-   **Frontend**: Vue 3 (Composition API), Pinia (State Management), Tailwind CSS v4, Axios.
-   **Backend**: Node.js, Express, Mongoose, Fluent-FFmpeg, Multer.
-   **Database**: MongoDB.

## Prerequisites

-   Node.js (v18+ recommended)
-   MongoDB (Running locally or a URI)
-   FFmpeg (Must be installed on the system)

## Setup & Running

### 1. Backend Setup

```bash
cd backend
npm install
# Create .env file with MONGODB_URI and PORT (optional, default 3000)
# Ensure local MongoDB is running
npm run dev
```

The backend runs on `http://localhost:3000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Usage

1.  Open the application in your browser.
2.  Upload a video file (`.mp4`, `.mov`, `.avi`, etc.).
3.  Once uploaded, you can view the video and its metadata.
4.  Click **"Edit Clip"** to open the clipping interface.
5.  Select a range and click **"Save Clip"**.
6.  The clip will be generated, saved, and appear in the "Saved Clips" gallery below.
