const express = require('express');

const uploadController = require('../controller/uploadController');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/upload',upload.single('file'), uploadController.upload);

module.exports = router ;