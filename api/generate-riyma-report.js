import { generateRiymaPDF } from '../lib/pdf-generator.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting PDF generation...');
    
    // Simple test data
    const testData = {
      clientName: 'Test Client',
      analysisDate: new Date().toISOString().split('T')[0],
      aestheticianName: 'Test Aesthetician',
      generatedAt: new Date().toISOString(),
      strengths: 'Beautiful natural features and excellent bone structure that create harmonious facial proportions.',
      nonSurgicalOptions: 'Focus on a consistent skincare routine with quality products. Consider professional facial treatments quarterly.'
    };

    // Generate PDF
    const pdfBuffer = await generateRiymaPDF(testData);
    
    // Convert to base64
    const pdfBase64 = pdfBuffer.toString('base64');
    const fileName = `riyma-analysis-${Date.now()}.pdf`;
    
    res.status(200).json({ 
      success: true, 
      pdfData: pdfBase64,
      fileName: fileName,
      message: 'Riyma PDF analysis report generated successfully'
    });
    
  } catch (error) {
    console.error('PDF Error:', error);
    res.status(500).json({ 
      error: 'PDF generation failed',
      details: error.message
    });
  }
}
