// api/generate-riyma-report.js
// CLEAN VERSION - No test content, full debugging

const { generateRiymaReportTemplate } = require('../templates/riyma-report-template.js');

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
    console.log('📄 Processing Riyma form submission...');

    // Handle FormData from your Framer form
    let formFields = {};

    if (req.body && typeof req.body === 'object') {
      if (req.body.formData) {
        formFields = req.body.formData;
      } else {
        formFields = req.body;
      }
    }

    console.log('📋 Form fields received:', Object.keys(formFields));
    console.log('👤 Client name:', formFields.clientName);
    console.log('📅 Analysis date:', formFields.analysisDate);

    // Generate CLEAN report ID - NO TEST CONTENT
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    const cleanReportId = `RYM-${year}${month}${day}-${timestamp}`;

    console.log('🆔 Generated Report ID:', cleanReportId);

    // Map form data - NO TEST CONTENT
    const mappedData = {
      // Patient Info
      patientName: formFields.clientName || 'Name Not Provided',
      age: formFields.clientAge || 'Age Not Provided',
      gender: 'Not Specified',
      assessmentDate: formFields.analysisDate || today.toISOString().split('T')[0],
      doctorName: formFields.aestheticianName || 'Aesthetician Not Provided',
      
      // Assessment Data
      facialSymmetry: {
        rating: getRatingText(formFields.facialSymmetry) || 'Good',
        score: parseFloat(formFields.facialSymmetry) || 8.0,
        notes: formFields.proportionNotes || 'Facial symmetry assessment completed.'
      },
      
      skinQuality: {
        rating: capitalizeFirst(formFields.skinQuality) || 'Good',
        score: getQualityScore(formFields.skinQuality) || 7.5,
        notes: formFields.skinAnalysis || 'Skin quality assessment completed.'
      },
      
      facialProportions: {
        rating: getRatingText(formFields.ruleOfThirds) || 'Good', 
        score: parseFloat(formFields.ruleOfThirds) || 8.0,
        notes: formFields.featureAnalysis || 'Facial proportions assessed.'
      },

      // Recommendations
      recommendations: buildRecommendations(formFields),
      
      // Summary
      summary: buildSummary(formFields),
      
      // Report metadata - CLEAN
      reportId: cleanReportId,
      reviewedBy: formFields.aestheticianName || 'Professional Aesthetician',
      generatedAt: today.toISOString()
    };

    console.log('✅ Mapped data created');
    console.log('🆔 Final Report ID in mappedData:', mappedData.reportId);

    // Generate HTML template
    const htmlTemplate = generateRiymaReportTemplate(mappedData, []);
    
    console.log('📄 HTML template generated');
    console.log('🔍 Template contains Report ID:', htmlTemplate.includes(cleanReportId) ? 'YES' : 'NO');

    // Build response
    const responseData = {
      success: true,
      reportData: {
        clientName: mappedData.patientName,
        analysisDate: mappedData.assessmentDate,
        aestheticianName: mappedData.doctorName,
        certification: formFields.certification || '',
        strengths: formFields.strengths || 'Natural facial harmony observed.',
        nonSurgicalOptions: formFields.nonSurgicalOptions || 'Skincare optimization recommended.',
        surgicalOptions: formFields.surgicalOptions || 'Consultation available if desired.',
        lifestyleRecommendations: formFields.lifestyleRecommendations || 'Maintain healthy lifestyle habits.',
        generatedAt: today.toISOString()
      },
      htmlPreview: htmlTemplate,
      reportId: cleanReportId
    };

    console.log('📤 Sending response with Report ID:', responseData.reportId);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Error processing form:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      details: error.message
    });
  }
};

// Helper functions
function getRatingText(score) {
  const num = parseFloat(score);
  if (num >= 4.5) return 'Excellent';
  if (num >= 3.5) return 'Very Good';
  if (num >= 2.5) return 'Good';
  if (num >= 1.5) return 'Fair';
  return 'Needs Improvement';
}

function getQualityScore(quality) {
  const qualityMap = {
    'excellent': 9.5,
    'good': 8.0,
    'average': 6.5,
    'needs-improvement': 5.0,
    'poor': 3.0
  };
  return qualityMap[quality] || 7.0;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildRecommendations(formFields) {
  const recommendations = [];
  
  if (formFields.strengths) {
    recommendations.push({
      title: 'Key Strengths & Best Features',
      description: formFields.strengths
    });
  }
  
  if (formFields.nonSurgicalOptions) {
    recommendations.push({
      title: 'Non-Surgical Enhancement Options',
      description: formFields.nonSurgicalOptions
    });
  }
  
  if (formFields.surgicalOptions) {
    recommendations.push({
      title: 'Surgical Enhancement Considerations', 
      description: formFields.surgicalOptions
    });
  }
  
  if (formFields.lifestyleRecommendations) {
    recommendations.push({
      title: 'Lifestyle & Wellness Recommendations',
      description: formFields.lifestyleRecommendations
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Professional Assessment Complete',
      description: 'Comprehensive facial analysis completed with personalized recommendations.'
    });
  }
  
  return recommendations;
}

function buildSummary(formFields) {
  let summary = 'Professional facial analysis completed. ';
  
  if (formFields.aestheticType) {
    summary += `Aesthetic classification: ${formFields.aestheticType}. `;
  }
  
  if (formFields.overallHarmony) {
    summary += `Overall harmony score: ${formFields.overallHarmony}/5. `;
  }
  
  summary += 'Detailed recommendations provided based on individual assessment.';
  
  return summary;
}
