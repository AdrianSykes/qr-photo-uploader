[span_22](start_span)const Image = require(‘../models/Image’);[span_22](end_span)
[span_23](start_span)const User = require(‘../models/User’);[span_23](end_span)
[span_24](start_span)const AWS = require(‘aws-sdk’);[span_24](end_span)
Const JSZip = require(‘jszip’); // Added require for jszip
Const stream = require(‘stream’); // Added require for stream

[span_25](start_span)const s3 = new AWS.S3({[span_25](end_span)
  [span_26](start_span)endpoint: process.env.B2_ENDPOINT,[span_26](end_span)
  [span_27](start_span)accessKeyId: process.env.B2_KEY_ID,[span_27](end_span)
  [span_28](start_span)secretAccessKey: process.env.B2_APP_KEY[span_28](end_span)
});

[span_29](start_span)exports.uploadImage = async (req, res) => {[span_29](end_span)
  Try {
    [span_30](start_span)const user = await User.findById(req.user.id);[span_30](end_span)
    [span_31](start_span)if (!user) return res.status(404).json({ error: ‘User not found’ });[span_31](end_span)
    // Check upload limit (35 images)
    [span_32](start_span)const imageCount = await Image.countDocuments({ user: user._id });[span_32](end_span)
    [span_33](start_span)if (imageCount >= 35) {[span_33](end_span)
      [span_34](start_span)return res.status(400).json({ error: ‘Upload limit reached (max 35 images)’ });[span_34](end_span)
    }
    [span_35](start_span)const file = req.file;[span_35](end_span)
    [span_36](start_span)const fileName = `user-${user._id}/${Date.now()}-${file.originalname}`;[span_36](end_span)
    [span_37](start_span)const params = {[span_37](end_span)
      [span_38](start_span)Bucket: process.env.B2_BUCKET_NAME,[span_38](end_span)
      [span_39](start_span)Key: fileName,[span_39](end_span)
      [span_40](start_span)Body: file.buffer,[span_40](end_span)
      [span_41](start_span)ContentType: file.mimetype[span_41](end_span)
    };
    [span_42](start_span)const b2Response = await s3.upload(params).promise();[span_42](end_span)
    [span_43](start_span)const newImage = new Image({[span_43](end_span)
      [span_44](start_span)user: user._id,[span_44](end_span)
      [span_45](start_span)filename: fileName,[span_45](end_span)
      [span_46](start_span)url: b2Response.Location,[span_46](end_span)
      [span_47](start_span)size: file.size[span_47](end_span)
    });
    [span_48](start_span)await newImage.save();[span_48](end_span)
    [span_49](start_span)res.status(201).json(newImage);[span_49](end_span)
  } catch (err) {
    [span_50](start_span)res.status(500).json({ error: err.message });[span_50](end_span)
  }
};

[span_51](start_span)// Added getUserImages for fetching user-specific images[span_51](end_span)
Exports.getUserImages = async (req, res) => {
  Try {
    Const images = await Image.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    Res.json(images);
  } catch (err) {
    Res.status(500).json({ error: err.message });
  }
};

[span_52](start_span)// Added downloadImages endpoint[span_52](end_span)
[span_53](start_span)exports.downloadImages = async (req, res) => {[span_53](end_span)
  Try {
    Const images = await Image.find({
      _id: { $in: req.body.ids },
      User: req.user.id // Corrected ‘User’ to ‘user’ to match schema
    [span_54](start_span)});[span_54](end_span)

    [span_55](start_span)if (images.length === 0) {[span_55](end_span)
      [span_56](start_span)return res.status(404).json({ error: ‘No images found’ });[span_56](end_span)
    }

    [span_57](start_span)const zip = new JSZip();[span_57](end_span)
    [span_58](start_span)// s3 object already initialized at the top of the file.[span_58](end_span)

    [span_59](start_span)// Add each image to zip[span_59](end_span)
    [span_60](start_span)await Promise.all(images.map(async (image) => {[span_60](end_span)
      [span_61](start_span)const params = {[span_61](end_span)
        [span_62](start_span)Bucket: process.env.B2_BUCKET_NAME,[span_62](end_span)
        [span_63](start_span)Key: image.filename[span_63](end_span)
      };

      [span_64](start_span)const data = await s3.getObject(params).promise();[span_64](end_span)
      [span_65](start_span)zip.file(image.filename.split(‘/’).pop(), data.Body);[span_65](end_span)
    }));

    [span_66](start_span)// Generate zip stream[span_66](end_span)
    [span_67](start_span)const zipStream = zip.generateNodeStream({ type: ‘nodebuffer’ });[span_67](end_span)
    [span_68](start_span)const ps = new stream.PassThrough();[span_68](end_span)
    [span_69](start_span)zipStream.pipe(ps);[span_69](end_span)

    [span_70](start_span)// Set headers[span_70](end_span)
    [span_71](start_span)res.setHeader(‘Content-Type’, ‘application/zip’);[span_71](end_span)
    [span_72](start_span)res.setHeader(‘Content-Disposition’, ‘attachment; filename=photos.zip’);[span_72](end_span)
    [span_73](start_span)ps.pipe(res);[span_73](end_span)

  } catch (err) {
    [span_74](start_span)res.status(500).json({ error: err.message });[span_74](end_span)
  }
};

