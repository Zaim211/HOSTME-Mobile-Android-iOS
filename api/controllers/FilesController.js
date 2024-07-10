const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bucket = "hostme-application";

// Function to upload a file to S3
async function uploadToS3(buffer, originalFilename, mimetype) {
  // Create a new S3 client with specified region and credentials
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  // Generate a new filename based on the current timestamp
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;

  // Upload the file to S3
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: buffer,
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );

  // Return the URL of the uploaded file
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

class FilesController {
  // Method to upload multiple images to S3
  static async uploadImages(req, res) {
    try {
      const uploadedFiles = [];
      for (let i = 0; i < req.files.length; i++) {
        const { buffer, originalname, mimetype } = req.files[i];
        const url = await uploadToS3(buffer, originalname, mimetype);
        uploadedFiles.push(url);
      }
      res.json(uploadedFiles);
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ error: 'Failed to upload images' });
    }
  }
}

module.exports = FilesController;
