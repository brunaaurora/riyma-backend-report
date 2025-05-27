// api/generate-riyma-report.js
// FIXED - Pure CommonJS syntax for Vercel

const { generateRiymaReportTemplate } = require('../templates/riyma-report-template.js');

// Comment out these if they don't exist yet - we'll add them later
// const { generatePDF } = require('../lib/pdf-generator.js');
// const { validateFormData } = require('../lib/validation.js');
// const { processCloudinaryImages } = require('../lib/image-processor.js');

module.exports = async function handler(req, res) {
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

    // Process Cloudinary images if present (skip for now if function doesn't exist)
    let processedImages = [];
    if (formData.cloudinaryImages && formData.cloudinaryImages.length > 0) {
      console.log('📸 Cloudinary images found:', formData.cloudinaryImages.length);
      // TODO: Add image processing later
      processedImages = formData.cloudinaryImages;
    }

    // Generate the HTML template with form data
    const htmlTemplate = generateRiymaReportTemplate(formData, processedImages);
    console.log('✅ HTML template generated successfully');

    // Handle different modes
    switch (mode) {
      case 'preview':
        console.log('🔍 Preview mode - returning HTML');
        return res.status(200).json({
          success: true,
          htmlPreview: htmlTemplate,
          reportId: formData.reportId || generateReportId(),
          mode: 'preview'
        });

      case 'generate':
        console.log('📄 Generate mode - creating PDF');
        
        // For now, return HTML until PDF generation is working
        // TODO: Uncomment when pdf-generator is ready
        /*
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
        */

        if (managerReview) {
          console.log('👨‍💼 Manager review mode');
          return res.status(200).json({
            success: true,
            htmlPreview: htmlTemplate,
            reportId: formData.reportId || generateReportId(),
            requiresApproval: true,
            mode: 'manager_review'
          });
        } else {
          // For now, return HTML instead of PDF
          console.log('📤 Returning HTML (PDF generation disabled for testing)');
          return res.status(200).json({
            success: true,
            htmlPreview: htmlTemplate,
            reportId: formData.reportId || generateReportId(),
            mode: 'html_output'
          });
          
          // TODO: Enable when PDF generator works
          /*
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="riyma-report-${formData.reportId || Date.now()}.pdf"`);
          return res.status(200).send(pdfBuffer);
          */
        }

      case 'approve':
        console.log('✅ Approve mode - generating final report');
        
        // TODO: Add PDF generation and Google Sheets integration
        return res.status(200).json({
          success: true,
          message: 'Report approved (PDF generation and Google Sheets integration pending)',
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
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper function to generate unique report ID
function generateReportId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  
  return `RYM-${year}${month}${day}-${timestamp}`;
}

// Helper function placeholder for Google Sheets integration
async function sendToGoogleSheets(formData, pdfBuffer) {
  console.log('📊 Google Sheets integration placeholder:', formData.reportId);
  // TODO: Add your existing Google Sheets code here
}
