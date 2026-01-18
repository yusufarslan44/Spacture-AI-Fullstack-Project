const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const Clip = require('../models/Clip');

// Helper to ensure clips directory exists
const clipsDir = path.join(__dirname, '../../uploads/clips');
if (!fs.existsSync(clipsDir)) {
    fs.mkdirSync(clipsDir, { recursive: true });
}

exports.createClip = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, name } = req.body;

        if (startTime === undefined || endTime === undefined) {
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
            .on('end', async () => {
                console.log('Clip generated successfully');

                try {
                    const clip = new Clip({
                        video: video._id,
                        name: name || `Clip from ${video.originalName}`,
                        filename: outputFilename,
                        path: outputPath,
                        startTime,
                        endTime
                    });

                    await clip.save();

                    const clipUrl = `http://localhost:3000/uploads/clips/${outputFilename}`;

                    res.status(201).json({
                        message: 'Clip generated and saved successfully',
                        clipUrl: clipUrl,
                        clip: clip
                    });
                } catch (dbErr) {
                    console.error('Error saving clip to DB:', dbErr);
                    res.status(500).json({ error: 'Clip generated but failed to save record' });
                }
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

exports.getClips = async (req, res) => {
    try {
        const { videoId } = req.query;
        let query = {};
        if (videoId) {
            query.video = videoId;
        }
        const clips = await Clip.find(query).sort({ createdAt: -1 });
        res.status(200).json(clips);
    } catch (error) {
        console.error('Error fetching clips:', error);
        res.status(500).json({ error: 'Failed to fetch clips' });
    }
};

exports.deleteClip = async (req, res) => {
    try {
        const { id } = req.params;
        const clip = await Clip.findById(id);

        if (!clip) {
            return res.status(404).json({ error: 'Clip not found' });
        }

        // Delete file
        if (fs.existsSync(clip.path)) {
            fs.unlinkSync(clip.path);
        }

        await Clip.findByIdAndDelete(id);

        res.status(200).json({ message: 'Clip deleted successfully' });
    } catch (error) {
        console.error('Error deleting clip:', error);
        res.status(500).json({ error: 'Failed to delete clip' });
    }
};

