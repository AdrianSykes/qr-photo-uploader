const AWS = require('aws-sdk');

// Configure AWS SDK for Backblaze B2
const s3 = new AWS.S3({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION || 'us-west-001', // Default Backblaze region
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY
  },
  s3ForcePathStyle: true, // Required for Backblaze compatibility
  signatureVersion: 'v4'
});

// Helper: Generate pre-signed upload URL
const generatePresignedUrl = (key, contentType) => {
  return s3.getSignedUrl('putObject', {
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    Expires: 3600, // 1 hour expiry
    ContentType: contentType
  });
};

// Helper: Delete file from B2
const deleteFile = async (key) => {
  await s3.deleteObject({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key
  }).promise();
};

module.exports = {
  s3,
  generatePresignedUrl,
  deleteFile
};
