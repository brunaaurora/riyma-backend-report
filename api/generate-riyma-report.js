// api/generate-riyma-report.js
// Updated to use the new Riyma clinical template

const { generateRiymaReportTemplate } = require('../templates/riyma-report-template.js');
const { generatePDF } = require('../lib/pdf-generator.js');
const { validateFormData } = require('../lib/validation.js');
const { processCloudinaryImages } = require('../lib/image-processor.js');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, mode = 'generate', managerReview = false } = req.body;

    console.log('📄 Generating Riyma report with data:', JSON.stringify(formData, null, 2));

    // Basic validation
    if (!formData || typeof formData !== 'object') {
      return res.status(400).json({ 
        error: 'Invalid form data', 
        details: 'Form data is required and must be an object'
      });
    }

    // Process Cloudinary images if present
    let processedImages = [];
    if (formData.cloudinaryImages && formData.cloudinaryImages.length > 0) {
      try {
        processedImages = await processCloudinaryImages(formData.cloudinaryImages);
        console.log('📸 Processed Cloudinary images:', processedImages.length);
      } catch (imageError) {
        console.log('⚠️ Image processing failed:', imageError.message);
      }
    }

    // Generate the HTML template with form data
    const htmlTemplate = generateRiymaReportTemplate(formData, processedImages);
    console.log('✅ HTML template generated successfully');

    // Handle different modes
    switch (mode) {
      case 'preview':
        return res.status(200).json({
          success: true,
          htmlPreview: htmlTemplate,
          reportId: formData.reportId || generateReportId(),
          mode: 'preview'
        });

      case 'generate':
        const pdfBuffer = await generatePDF(htmlTemplate, {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
          }
        });

        if (managerReview) {
          return res.status(200).json({
            success: true,
            htmlPreview: htmlTemplate,
            reportId: formData.reportId || generateReportId(),
            requiresApproval: true,
            mode: 'manager_review'
          });
        } else {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="riyma-report-${formData.reportId || Date.now()}.pdf"`);
          return res.status(200).send(pdfBuffer);
        }

      case 'approve':
        const finalPdfBuffer = await generatePDF(htmlTemplate, {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
          }
        });

        // Send to Google Sheets (your existing integration)
        try {
          await sendToGoogleSheets(formData, finalPdfBuffer);
          console.log('📊 Sent to Google Sheets successfully');
        } catch (sheetsError) {
          console.log('⚠️ Google Sheets integration failed:', sheetsError.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Report approved and sent to client',
          reportId: formData.reportId || generateReportId(),
          mode: 'approved'
        });

      default:
        return res.status(400).json({ error: 'Invalid mode. Use: preview, generate, or approve' });
    }

  } catch (error) {
    console.error('❌ Error generating report:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message
    });
  }
}

// Helper functions
function generateReportId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  
  return `RYM-${year}${month}${day}-${timestamp}`;
}

async function sendToGoogleSheets(formData, pdfBuffer) {
  // Your existing Google Sheets integration code goes here
  console.log('📊 Sending to Google Sheets:', formData.reportId);
}
