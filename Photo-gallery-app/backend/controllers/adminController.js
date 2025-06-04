[span_169](start_span)const Image = require(‘../models/Image’);[span_169](end_span)
Const AWS = require(‘aws-sdk’); // Added require for AWS

[span_170](start_span)// s3 object needs to be initialized here as well[span_170](end_span)
Const s3 = new AWS.S3({
  Endpoint: process.env.B2_ENDPOINT,
  accessKeyId: process.env.B2_KEY_ID,
  secretAccessKey: process.env.B2_APP_KEY
});

[span_171](start_span)exports.deleteImage = async (req, res) => {[span_171](end_span)
  Try {
    [span_172](start_span)const image = await Image.findById(req.params.id);[span_172](end_span)
    [span_173](start_span)if (!image) return res.status(404).json({ error: ‘Image not found’ });[span_173](end_span)

    [span_174](start_span)// Delete from Backblaze B2[span_174](end_span)
    [span_175](start_span)const params = {[span_175](end_span)
      [span_176](start_span)Bucket: process.env.B2_BUCKET_NAME,[span_176](end_span)
      [span_177](start_span)Key: image.filename[span_177](end_span)
    };
    Await s3.deleteObject(params).promise(); [span_178](start_span)// Corrected req.s3 to s3[span_178](end_span)
    [span_179](start_span)await Image.findByIdAndDelete(req.params.id);[span_179](end_span)
    [span_180](start_span)res.json({ message: ‘Image deleted successfully’ });[span_180](end_span)
  } catch (err) {
    [span_181](start_span)res.status(500).json({ error: err.message });[span_181](end_span)
  }
};

[span_182](start_span)// Added getAllImages for admin panel to fetch all images[span_182](end_span)
Exports.getAllImages = async (req, res) => {
  Try {
    Const images = await Image.find().sort({ uploadedAt: -1 });
    Res.json(images);
  } catch (err) {
    Res.status(500).json({ error: err.message });
  }
};

