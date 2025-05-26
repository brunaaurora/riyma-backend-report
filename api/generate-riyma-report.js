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
    // Simple HTML report instead of PDF for now
    const htmlReport = `
      <html>
        <head><title>Riyma Analysis Report</title></head>
        <body style="font-family: Arial; padding: 40px;">
          <h1 style="color: #1e293b;">riyma</h1>
          <h2>Facial Analysis Report</h2>
          <p><strong>Client:</strong> Test Client</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Aesthetician:</strong> Test Aesthetician</p>
          <p>Report generated successfully!</p>
        </body>
      </html>
    `;
    
    res.status(200).json({ 
      success: true, 
      message: 'Report generated (HTML version)',
      htmlReport: htmlReport
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: error.message
    });
  }
}
