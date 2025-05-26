import { generateRiymaPDF } from '../lib/pdf-generator.js';

export default async function handler(req, res) {
  // Enable CORS
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
    // For now, use simple test data
    const testData = {
      clientName: 'Test Client',
      analysisDate: new Date().toISOString().split('T')[0],
      aestheticianName: 'Test Aesthetician',
      generatedAt: new Date().toISOString(),
      strengths: 'Beautiful natural features and great bone structure.',
      nonSurgicalOptions: 'Focus on skincare routine and highlighting your best features.',
      surgicalOptions: 'No surgical interventions recommended at this time.',
      lifestyleRecommendations: 'Maintain good hydration and regular sleep schedule.'
    };

    // Generate PDF
    const pdfBuffer = await generateRiymaPDF(testData);
    
    // Convert PDF buffer to base64
    const pdfBase64 = pdfBuffer.toString('base64');
    const fileName = `riyma-analysis-test-${Date.now()}.pdf`;
    
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
      details: error.message
    });
  }
}
