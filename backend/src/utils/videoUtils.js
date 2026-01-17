const ffmpeg = require('fluent-ffmpeg');

exports.getVideoMetadata = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const videoStream = metadata.streams.find(s => s.codec_type === 'video');
                const format = metadata.format;

                resolve({
                    duration: format.duration,
                    width: videoStream ? videoStream.width : null,
                    height: videoStream ? videoStream.height : null,
                    frameRate: videoStream ? videoStream.r_frame_rate : null,
                    codec: videoStream ? videoStream.codec_name : null,
                    frameCount: videoStream ? videoStream.nb_frames : null
                });
            }
        });
    });
};
