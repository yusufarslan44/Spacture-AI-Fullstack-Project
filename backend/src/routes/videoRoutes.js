const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const clipController = require('../controllers/clipController');

router.post('/upload', videoController.uploadVideo);
router.post('/:id/clip', clipController.createClip);

module.exports = router;
