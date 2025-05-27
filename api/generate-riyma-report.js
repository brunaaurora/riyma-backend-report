// api/generate-riyma-report.js
// MINIMAL DEBUG VERSION - See exactly what's being received

module.exports = async function handler(req, res) {
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
    console.log('🚀 === MINIMAL DEBUG START ===');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // Log EVERYTHING about the request
    console.log('📋 Request method:', req.method);
    console.log('📋 Request headers:', JSON.stringify(req.headers, null, 2));
    console.log('📋 Request body type:', typeof req.body);
    console.log('📋 Request body:', req.body);
    
    // Try different ways to extract data
    let formData = {};
    let dataSource = 'none';
    
    if (req.body) {
      if (typeof req.body === 'object') {
        if (req.body.formData) {
          formData = req.body.formData;
          dataSource = 'nested formData';
        } else {
          formData = req.body;
          dataSource = 'direct body';
        }
      } else if (typeof req.body === 'string') {
        try {
          formData = JSON.parse(req.body);
          dataSource = 'parsed JSON string';
        } catch (e) {
          console.log('📋 Body is string but not JSON:', req.body);
          dataSource = 'raw string';
        }
      }
    }
    
    console.log('📦 Data source:', dataSource);
    console.log('📦 Extracted form data keys:', Object.keys(formData));
    console.log('📦 Extracted form data:', formData);
    
    // Test specific fields we expect
    const testFields = {
      clientName: formData.clientName || 'MISSING',
      aestheticianName: formData.aestheticianName || 'MISSING',
      analysisDate: formData.analysisDate || 'MISSING',
      facialSymmetry: formData.facialSymmetry || 'MISSING',
      skinQuality: formData.skinQuality || 'MISSING'
    };
    
    console.log('🔍 Key field check:', testFields);
    
    // Create a simple HTML response showing what we received
    const debugHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Riyma Debug Report</title>
        <style>
            body { font-family: monospace; padding: 20px; }
            .field { margin: 10px 0; padding: 10px; background: #f0f0f0; }
            .value { font-weight: bold; color: blue; }
            .missing { color: red; }
        </style>
    </head>
    <body>
        <h1>RIYMA DEBUG REPORT</h1>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Data Source:</strong> ${dataSource}</p>
        <p><strong>Total Fields Received:</strong> ${Object.keys(formData).length}</p>
        
        <h2>KEY FIELDS:</h2>
        <div class="field">
            <strong>Client Name:</strong> 
            <span class="${testFields.clientName === 'MISSING' ? 'missing' : 'value'}">
                ${testFields.clientName}
            </span>
        </div>
        
        <div class="field">
            <strong>Aesthetician Name:</strong> 
            <span class="${testFields.aestheticianName === 'MISSING' ? 'missing' : 'value'}">
                ${testFields.aestheticianName}
            </span>
        </div>
        
        <div class="field">
            <strong>Analysis Date:</strong> 
            <span class="${testFields.analysisDate === 'MISSING' ? 'missing' : 'value'}">
                ${testFields.analysisDate}
            </span>
        </div>
        
        <h2>ALL RECEIVED DATA:</h2>
        <pre>${JSON.stringify(formData, null, 2)}</pre>
        
        <h2>RAW REQUEST BODY:</h2>
        <pre>${JSON.stringify(req.body, null, 2)}</pre>
    </body>
    </html>
    `;
    
    // Return comprehensive debug response
    const response = {
      success: true,
      debug: true,
      timestamp: new Date().toISOString(),
      dataSource: dataSource,
      totalFields: Object.keys(formData).length,
      keyFields: testFields,
      allData: formData,
      rawBody: req.body,
      requestInfo: {
        method: req.method,
        contentType: req.headers['content-type'],
        userAgent: req.headers['user-agent']
      }
    };
    
    console.log('📤 Sending debug response');
    
    return res.status(200).json({
      ...response,
      htmlPreview: debugHtml,
      reportId: 'DEBUG-TEST-' + Date.now()
    });

  } catch (error) {
    console.error('❌ DEBUG ERROR:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Debug error', 
      details: error.message,
      stack: error.stack
    });
  }
};
