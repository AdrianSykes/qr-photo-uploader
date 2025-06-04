[span_205](start_span)const multer = require(‘multer’);[span_205](end_span)
[span_206](start_span)const path = require(‘path’);[span_206](end_span)

[span_207](start_span)const storage = multer.memoryStorage();[span_207](end_span)

[span_208](start_span)const fileFilter = (req, file, cb) => {[span_208](end_span)
  [span_209](start_span)const ext = path.extname(file.originalname).toLowerCase();[span_209](end_span)
  [span_210](start_span)if ([‘.jpg’, ‘.jpeg’, ‘.png’, ‘.gif’].includes(ext)) {[span_210](end_span) // Corrected If to if
    [span_211](start_span)cb(null, true);[span_211](end_span) // Corrected Cb to cb
  } else { // Corrected } else { to } else {
    [span_212](start_span)cb(new Error(‘Only image files are allowed’), false);[span_212](end_span) // Corrected Cb to cb
  }
};

[span_213](start_span)const upload = multer({[span_213](end_span)
  Storage: storage, // Corrected Storage to storage
  fileFilter: fileFilter,
  [span_214](start_span)limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit[span_214](end_span)
});

[span_215](start_span)module.exports = upload;[span_215](end_span)

