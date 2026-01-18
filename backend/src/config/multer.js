const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept video files
    const allowedExts = ['.mp4', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.webm'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith('video/') || allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('only videos are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 500 } // 500MB limit
});

module.exports = upload;
