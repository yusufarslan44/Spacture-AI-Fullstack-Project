const upload = require('../config/multer');
const { getVideoMetadata } = require('../utils/videoUtils');

const Video = require('../models/Video');

exports.uploadVideo = (req, res) => {
    upload.single('video')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            console.log('Upload attempt failed: No file received');
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        console.log('File uploaded successfully:', req.file);

        try {
            let finalPath = req.file.path;
            let finalFilename = req.file.filename;
            const originalPath = req.file.path;

            const path = require('path');
            const fs = require('fs');
            const ffmpeg = require('fluent-ffmpeg');

            const ext = path.extname(req.file.originalname).toLowerCase();
            const needsTranscoding = ext !== '.mp4';

            if (needsTranscoding) {

                const newFilename = path.basename(req.file.filename, path.extname(req.file.filename)) + '_converted.mp4';
                const newPath = path.join(path.dirname(req.file.path), newFilename);

                await new Promise((resolve, reject) => {
                    ffmpeg(originalPath)
                        .output(newPath)
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .on('end', () => {
                            console.log('Transcoding finished:', newPath);
                            // Delete original file
                            fs.unlink(originalPath, (err) => {
                                if (err) console.error('Failed to delete original file:', err);
                            });
                            resolve();
                        })
                        .on('error', (err) => {
                            console.error('Transcoding error:', err);
                            reject(err);
                        })
                        .run();
                });

                finalPath = newPath;
                finalFilename = newFilename;
            }

            const metadata = await getVideoMetadata(finalPath);

            // Save to Database
            const video = new Video({
                filename: finalFilename,
                originalName: req.file.originalname, // Keep original name for reference
                filePath: finalPath,
                metadata: metadata
            });

            await video.save();

            res.status(201).json({
                message: 'Video uploaded and saved successfully',
                video: video
            });
        } catch (metaErr) {
            console.error('Processing error:', metaErr);
            const fs = require('fs');
            fs.appendFileSync('error.log', `${new Date().toISOString()} - ${metaErr.message}\n${metaErr.stack}\n\n`);
            res.status(500).json({
                message: 'Video uploaded but processing failed',
                error: metaErr.message
            });
        }
    });
};

exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const fs = require('fs');
        if (fs.existsSync(video.filePath)) {
            fs.unlinkSync(video.filePath);
        }

        await Video.findByIdAndDelete(id);
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Failed to delete video' });
    }
};
