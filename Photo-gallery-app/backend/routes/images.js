[span_117](start_span)const express = require(‘express’);[span_117](end_span)
[span_118](start_span)const router = express.Router();[span_118](end_span)
[span_119](start_span)const imageController = require(‘../controllers/imageController’);[span_119](end_span)
[span_120](start_span)const auth = require(‘../middleware/auth’);[span_120](end_span)
[span_121](start_span)const upload = require(‘../middleware/upload’);[span_121](end_span)

[span_122](start_span)router.post(‘/upload’, auth, upload.single(‘image’), imageController.uploadImage);[span_122](end_span)
[span_123](start_span)router.get(‘/’, auth, imageController.getUserImages);[span_123](end_span)
Router.post(‘/download’, auth, imageController.downloadImages); // Added route for download endpoint
[span_124](start_span)module.exports = router;[span_124](end_span)

