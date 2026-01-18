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
            const metadata = await getVideoMetadata(req.file.path);

            // Save to Database
            const video = new Video({
                filename: req.file.filename,
                originalName: req.file.originalname,
                filePath: req.file.path,
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
