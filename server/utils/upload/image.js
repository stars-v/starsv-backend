const multer = require('multer');

const uploadImage = multer({ storage: multer.memoryStorage() });

module.exports = {
	uploadImage,
};
