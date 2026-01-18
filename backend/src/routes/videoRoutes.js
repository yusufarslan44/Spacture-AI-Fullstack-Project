const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const clipController = require('../controllers/clipController');

// Video Routes containing Clip sub-routes
// Video Routes
router.get('/', videoController.getAllVideos);
router.get('/download/:filename', videoController.downloadVideo);
router.get('/clips/all', clipController.getClips);
router.post('/upload', videoController.uploadVideo);
router.delete('/:id', videoController.deleteVideo);

// Clips
router.get('/clips/download/:filename', clipController.downloadClip);
router.get('/clips/all', clipController.getClips);
router.post('/clip/:id', clipController.createClip);
router.get('/clips/:id', (req, res, next) => { req.query.videoId = req.params.id; next(); }, clipController.getClips);
router.delete('/clips/:id', clipController.deleteClip);

module.exports = router;
