const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

// Helper to ensure clips directory exists
const clipsDir = path.join(__dirname, '../../uploads/clips');
if (!fs.existsSync(clipsDir)) {
    fs.mkdirSync(clipsDir, { recursive: true });
}

exports.createClip = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, name } = req.body;

        if (!startTime || !endTime) {
            return res.status(400).json({ error: 'Start time and end time are required' });
        }

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const videoPath = video.filePath;
        const outputFilename = `clip-${Date.now()}-${path.basename(video.filename)}`;
        const outputPath = path.join(clipsDir, outputFilename);

        console.log(`Generating clip for video ${id} from ${startTime} to ${endTime}`);

        ffmpeg(videoPath)
            .setStartTime(startTime)
            .setDuration(endTime - startTime)
            .output(outputPath)
            .on('end', () => {
                console.log('Clip generated successfully');

                const clipUrl = `http://localhost:3000/uploads/clips/${outputFilename}`;

                res.status(201).json({
                    message: 'Clip generated successfully',
                    clipUrl: clipUrl,
                    downloadPath: `/uploads/clips/${outputFilename}`
                });
            })
            .on('error', (err) => {
                console.error('Error generating clip:', err);
                res.status(500).json({ error: 'Failed to generate clip', details: err.message });
            })
            .run();

    } catch (error) {
        console.error('Clip Controller Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
