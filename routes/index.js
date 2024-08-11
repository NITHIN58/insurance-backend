const express = require('express');

const uploadController = require('../controller/uploadController');
const policyController = require('../controller/policyDetailsController');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.post('/upload',upload.single('file'), uploadController.upload);

router.get('/policy/:userName', policyController.getPolicyInfo);

router.get('/aggregate', policyController.getPolicyAggregate);

module.exports = router ;