// api/generate-riyma-report.js
// DEBUG VERSION - See exactly what data is received

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
    console.log('📄 === FORM SUBMISSION DEBUG ===');
    console.log('📋 Raw req.body type:', typeof req.body);
    console.log('📋 Raw req.body keys:', Object.keys(req.body || {}));
    console.log('📋 Raw req.body content:', JSON.stringify(req.body, null, 2));

    // Handle FormData parsing
    let formFields = {};

    // Check if it's FormData or JSON
    if (req.body && typeof req.body === 'object') {
      // If it has formData property, it's JSON wrapped
      if (req.body.formData) {
        formFields = req.body.formData;
        console.log('📦 Using req.body.formData');
      } else {
        // Otherwise, it's direct FormData
        formFields = req.body;
        console.log('📦 Using req.body directly');
      }
    }

    console.log('📝 Parsed form fields:');
    Object.keys(formFields).forEach(key => {
      console.log(`   ${key}: ${formFields[key]}`);
    });

    // Generate report ID
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    const reportId = `RYM-${year}${month}${day}-${timestamp}`;

    // Map form data with detailed logging
    console.log('🗺️ Mapping form data...');
    
    const mappedData = {
      // Patient Info
      patientName: formFields.clientName || 'Name Not Provided',
      age: formFields.clientAge || 'Age Not Provided',
      gender: 'Not Specified',
      assessmentDate: formFields.analysisDate || today.toISOString().split('T')[0],
      doctorName: formFields.aestheticianName || 'Aesthetician Not Provided',
      
      // Assessment Data - with detailed logging
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
      
      // Report metadata
      reportId: reportId,
      reviewedBy: formFields.aestheticianName || 'Professional Aesthetician',
      generatedAt: today.toISOString()
    };

    console.log('✅ Mapped data created:');
    console.log('   Patient Name:', mappedData.patientName);
    console.log('   Age:', mappedData.age);
    console.log('   Assessment Date:', mappedData.assessmentDate);
    console.log('   Doctor Name:', mappedData.doctorName);
    console.log('   Facial Symmetry Rating:', mappedData.facialSymmetry.rating);
    console.log('   Skin Quality Rating:', mappedData.skinQuality.rating);
    console.log('   Recommendations count:', mappedData.recommendations.length);

    // Generate HTML template
    const htmlTemplate = generateRiymaReportTemplate(mappedData, []);
    
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
      reportId: reportId
    };

    console.log('📤 Sending response...');
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
  console.log('🔢 Converting rating score:', score, 'type:', typeof score);
  const num = parseFloat(score);
  if (isNaN(num)) return 'Good';
  if (num >= 4.5) return 'Excellent';
  if (num >= 3.5) return 'Very Good';
  if (num >= 2.5) return 'Good';  
  if (num >= 1.5) return 'Fair';
  return 'Needs Improvement';
}

function getQualityScore(quality) {
  console.log('🎯 Converting quality:', quality);
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
  console.log('💡 Building recommendations...');
  const recommendations = [];
  
  if (formFields.strengths) {
    console.log('   ✓ Adding strengths:', formFields.strengths.substring(0, 50) + '...');
    recommendations.push({
      title: 'Key Strengths & Best Features',
      description: formFields.strengths
    });
  }
  
  if (formFields.nonSurgicalOptions) {
    console.log('   ✓ Adding non-surgical options');
    recommendations.push({
      title: 'Non-Surgical Enhancement Options',
      description: formFields.nonSurgicalOptions
    });
  }
  
  if (formFields.surgicalOptions) {
    console.log('   ✓ Adding surgical options');
    recommendations.push({
      title: 'Surgical Enhancement Considerations', 
      description: formFields.surgicalOptions
    });
  }
  
  if (formFields.lifestyleRecommendations) {
    console.log('   ✓ Adding lifestyle recommendations');
    recommendations.push({
      title: 'Lifestyle & Wellness Recommendations',
      description: formFields.lifestyleRecommendations
    });
  }

  if (recommendations.length === 0) {
    console.log('   ⚠️ No recommendations found, using default');
    recommendations.push({
      title: 'Professional Assessment Complete',
      description: 'Comprehensive facial analysis completed with personalized recommendations.'
    });
  }
  
  console.log('   📊 Total recommendations:', recommendations.length);
  return recommendations;
}

function buildSummary(formFields) {
  console.log('📋 Building summary...');
  let summary = 'Professional facial analysis completed. ';
  
  if (formFields.aestheticType) {
    summary += `Aesthetic classification: ${formFields.aestheticType}. `;
    console.log('   ✓ Added aesthetic type:', formFields.aestheticType);
  }
  
  if (formFields.overallHarmony) {
    summary += `Overall harmony score: ${formFields.overallHarmony}/5. `;
    console.log('   ✓ Added harmony score:', formFields.overallHarmony);
  }
  
  summary += 'Detailed recommendations provided based on individual assessment.';
  
  console.log('   📝 Final summary length:', summary.length);
  return summary;
}
