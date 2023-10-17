const multer = require('multer');
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const fileName = `${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage });

module.exports = upload;