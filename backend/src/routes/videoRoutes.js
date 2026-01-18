const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const clipController = require('../controllers/clipController');

// Video Routes containing Clip sub-routes
router.get('/', videoController.getAllVideos);
router.get('/clips/all', clipController.getClips);
router.post('/upload', videoController.uploadVideo);

// Clips
router.get('/clips/all', clipController.getClips);
router.post('/clip/:id', clipController.createClip);
router.get('/clips/:id', (req, res, next) => { req.query.videoId = req.params.id; next(); }, clipController.getClips);
router.delete('/clips/:id', clipController.deleteClip);

module.exports = router;
