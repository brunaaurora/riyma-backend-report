// api/generate-riyma-report.js
// ECHO TEST - Shows exactly what we receive

const { generateRiymaReportTemplate } = require('../templates/riyma-report-template.js');

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
    // Log everything we receive
    console.log('📨 === RECEIVED DATA ===');
    console.log('Type:', typeof req.body);
    console.log('Keys:', Object.keys(req.body || {}));
    
    // Log each field
    const formFields = req.body || {};
    Object.keys(formFields).forEach(key => {
      console.log(`${key}: "${formFields[key]}"`);
    });

    // Create test data using received data
    const testData = {
      patientName: formFields.clientName || 'NO CLIENT NAME RECEIVED',
      age: formFields.clientAge || 'NO AGE RECEIVED', 
      gender: 'Not Specified',
      assessmentDate: formFields.analysisDate || 'NO DATE RECEIVED',
      doctorName: formFields.aestheticianName || 'NO AESTHETICIAN NAME RECEIVED',
        
      facialSymmetry: {
        rating: 'Good',
        score: 8.0,
        notes: formFields.proportionNotes || 'NO PROPORTION NOTES RECEIVED'
      },
      
      skinQuality: {
        rating: 'Good',
        score: 7.5,
        notes: formFields.skinAnalysis || 'NO SKIN ANALYSIS RECEIVED'
      },
      
      facialProportions: {
        rating: 'Good',
        score: 8.0,
        notes: formFields.featureAnalysis || 'NO FEATURE ANALYSIS RECEIVED'
      },

      recommendations: [
        {
          title: 'Strengths',
          description: formFields.strengths || 'NO STRENGTHS RECEIVED'
        },
        {
          title: 'Non-Surgical Options', 
          description: formFields.nonSurgicalOptions || 'NO NON-SURGICAL OPTIONS RECEIVED'
        }
      ],
      
      summary: formFields.lifestyleRecommendations || 'NO LIFESTYLE RECOMMENDATIONS RECEIVED',
      reportId: `RYM-${Date.now()}`,
      reviewedBy: formFields.aestheticianName || 'NO REVIEWER NAME'
    };

    console.log('📋 MAPPED DATA:', JSON.stringify(testData, null, 2));

    // Generate template
    const htmlTemplate = generateRiymaReportTemplate(testData, []);
    
    return res.status(200).json({
      success: true,
      reportData: { clientName: testData.patientName },
      htmlPreview: htmlTemplate,
      reportId: testData.reportId,
      debug: {
        received: formFields,
        mapped: testData
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
};
