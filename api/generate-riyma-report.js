import formidable from 'formidable';

export const config = {
  api: { bodyParser: false }
};

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
    // Parse form data
    const form = formidable();
    const [fields] = await form.parse(req);
    
    // Extract form data
    const reportData = {
      clientName: fields.clientName?.[0] || 'Test Client',
      analysisDate: fields.analysisDate?.[0] || new Date().toISOString().split('T')[0],
      aestheticianName: fields.aestheticianName?.[0] || 'Test Aesthetician',
      certification: fields.certification?.[0] || '',
      strengths: fields.strengths?.[0] || '',
      nonSurgicalOptions: fields.nonSurgicalOptions?.[0] || '',
      surgicalOptions: fields.surgicalOptions?.[0] || '',
      lifestyleRecommendations: fields.lifestyleRecommendations?.[0] || '',
      generatedAt: new Date().toISOString()
    };
    
    // Return structured data (no PDF generation on backend)
    res.status(200).json({ 
      success: true, 
      reportData: reportData,
      message: 'Report data processed successfully - PDF will be generated on frontend'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process form data',
      details: error.message
    });
  }
}
