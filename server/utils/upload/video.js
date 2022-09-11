const multer = require('multer');

const uploadVideo = multer({ storage: multer.memoryStorage() });

module.exports = {
	uploadVideo,
};
