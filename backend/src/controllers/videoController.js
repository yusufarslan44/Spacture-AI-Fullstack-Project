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
            res.status(500).json({
                message: 'Video uploaded but processing failed',
                error: metaErr.message
            });
        }
    });
};
