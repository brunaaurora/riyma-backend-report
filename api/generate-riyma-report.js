import { generateRiymaPDF } from '../lib/pdf-generator.js';
import { validateRiymaData } from '../lib/validation.js';
import { processImages } from '../lib/image-processor.js';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Parse form data with file uploads
    const { fields, files } = await parseFormData(req);
    
    // Validate form data
    const validatedData = validateRiymaData(fields);
    
    // Process and upload images to Cloudinary
    const imageUrls = await processImages(files);
    
    // Generate PDF with all data
    const pdfBuffer = await generateRiymaPDF({
      ...validatedData,
      images: imageUrls,
      generatedAt: new Date().toISOString()
    });
    
    // Convert PDF buffer to base64 for response
    const pdfBase64 = pdfBuffer.toString('base64');
    const timestamp = Date.now();
    const clientName = validatedData.clientName.replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `riyma-analysis-${clientName}-${timestamp}.pdf`;
    
    // Return success response with PDF data
    res.status(200).json({ 
      success: true, 
      pdfData: pdfBase64,
      fileName: fileName,
      message: 'Riyma analysis report generated successfully'
    });
    
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

async function parseFormData(req) {
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    allowEmptyFiles: false,
    filter: function ({ name, originalFilename, mimetype }) {
      // Only allow images
      return mimetype && mimetype.includes('image');
    }
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
