const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/images');
	},
	filename: function (req, file, cb) {
		console.log(file);
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	},
});

const upload = multer({ storage });

module.exports = {
	upload,
};
