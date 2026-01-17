const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    metadata: {
        duration: Number,
        width: Number,
        height: Number,
        frameRate: Number,
        codec: String,
        frameCount: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', videoSchema);
