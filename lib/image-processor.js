import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function processImages(files) {
  if (!files || Object.keys(files).length === 0) {
    return [];
  }
  
  const imageUrls = [];
  const imageFiles = Object.values(files).flat();
  
  for (const file of imageFiles) {
    try {
      // Convert file to base64 for Cloudinary upload
      const buffer = await file.toBuffer();
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64Data}`;
      
      // Upload to Cloudinary with optimization
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'riyma-analysis', // Organizes your images
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // Max size 800x800
          { quality: 'auto:good' }, // Auto optimize quality
          { format: 'auto' } // Auto choose best format
        ],
        resource_type: 'auto'
      });
      
      imageUrls.push(result.secure_url);
      
    } catch (error) {
      console.error('Image processing error:', error);
      // Continue processing other images even if one fails
    }
  }
  
  return imageUrls;
}
