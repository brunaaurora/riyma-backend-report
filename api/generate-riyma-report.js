// api/generate-riyma-report.js
// FIXED VERSION - Proper Vercel FormData parsing

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
    console.log('📄 === VERCEL FORMDATA PARSING ===');
    
    // VERCEL FORMDATA FIX - Parse multipart/form-data properly
    let formFields = {};
    
    // Check if req.body exists and handle different formats
    if (req.body) {
      console.log('📋 Raw body type:', typeof req.body);
      console.log('📋 Raw body keys:', Object.keys(req.body));
      
      // Vercel sometimes puts FormData fields directly in req.body
      if (typeof req.body === 'object') {
        // Handle both nested and flat structures
        if (req.body.formData) {
          formFields = req.body.formData;
          console.log('📦 Using nested formData structure');
        } else {
          formFields = req.body;
          console.log('📦 Using flat body structure');
        }
      }
    }

    console.log('📝 Parsed form fields:');
    Object.keys(formFields).forEach(key => {
      console.log(`   ${key}: "${formFields[key]}"`);
    });

    // Generate report ID
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    const reportId = `RYM-${year}${month}${day}-${timestamp}`;

    // FIXED DATA MAPPING - Handle string values properly
    const mappedData = {
      // Patient Info - Direct mapping
      patientName: formFields.clientName || formFields.fullName || formFields.patientName || 'Name Not Provided',
      age: formFields.clientAge || formFields.age || formFields.patientAge || 'Age Not Provided',
      gender: formFields.gender || 'Not Specified',
      assessmentDate: formFields.analysisDate || formFields.assessmentDate || today.toISOString().split('T')[0],
      doctorName: formFields.aestheticianName || formFields.doctorName || formFields.referringPhysician || 'Aesthetician Not Provided',
      
      // Assessment Data - Handle numeric strings
      facialSymmetry: {
        rating: getRatingText(formFields.facialSymmetry || formFields.facialSymmetryScore) || 'Good',
        score: parseFloat(formFields.facialSymmetry || formFields.facialSymmetryScore) || 8.0,
        notes: formFields.facialSymmetryNotes || formFields.proportionNotes || 'Facial symmetry assessment completed.'
      },
      
      skinQuality: {
        rating: capitalizeFirst(formFields.skinQuality || formFields.skinQualityRating) || 'Good',
        score: getQualityScore(formFields.skinQuality || formFields.skinQualityScore) || 7.5,
        notes: formFields.skinQualityNotes || formFields.skinAnalysis || 'Skin quality assessment completed.'
      },
      
      facialProportions: {
        rating: getRatingText(formFields.ruleOfThirds || formFields.facialProportions || formFields.facialProportionsScore) || 'Good', 
        score: parseFloat(formFields.ruleOfThirds || formFields.facialProportions || formFields.facialProportionsScore) || 8.0,
        notes: formFields.facialProportionsNotes || formFields.featureAnalysis || 'Facial proportions assessed.'
      },

      // Recommendations - Build from form fields
      recommendations: buildRecommendations(formFields),
      
      // Summary
      summary: buildSummary(formFields),
      
      // Report metadata
      reportId: reportId,
      reviewedBy: formFields.aestheticianName || formFields.doctorName || formFields.referringPhysician || 'Professional Aesthetician',
      generatedAt: today.toISOString()
    };

    console.log('✅ MAPPED DATA CHECK:');
    console.log('   Patient Name:', mappedData.patientName);
    console.log('   Age:', mappedData.age);
    console.log('   Assessment Date:', mappedData.assessmentDate);
    console.log('   Doctor Name:', mappedData.doctorName);
    console.log('   Report ID:', mappedData.reportId);
    console.log('   Facial Symmetry Score:', mappedData.facialSymmetry.score);
    console.log('   Skin Quality Score:', mappedData.skinQuality.score);

    // Generate HTML template
    const htmlTemplate = generateRiymaReportTemplate(mappedData, []);
    
    // VERIFY DATA IN TEMPLATE
    const hasClientName = htmlTemplate.includes(mappedData.patientName) && !htmlTemplate.includes('Name Not Provided');
    const hasDoctor = htmlTemplate.includes(mappedData.doctorName) && !htmlTemplate.includes('Aesthetician Not Provided');
    const hasReportId = htmlTemplate.includes(mappedData.reportId);
    const hasAge = htmlTemplate.includes(mappedData.age) && !htmlTemplate.includes('Age Not Provided');
    
    console.log('🔍 TEMPLATE VERIFICATION:');
    console.log('   Contains patient name:', hasClientName);
    console.log('   Contains doctor name:', hasDoctor);  
    console.log('   Contains report ID:', hasReportId);
    console.log('   Contains age:', hasAge);
    
    // Build response
    const responseData = {
      success: true,
      reportData: {
        clientName: mappedData.patientName,
        age: mappedData.age,
        gender: mappedData.gender,
        analysisDate: mappedData.assessmentDate,
        aestheticianName: mappedData.doctorName,
        certification: formFields.certification || '',
        
        // Assessment scores
        facialSymmetryScore: mappedData.facialSymmetry.score,
        skinQualityScore: mappedData.skinQuality.score,
        facialProportionsScore: mappedData.facialProportions.score,
        
        // Assessment notes
        facialSymmetryNotes: mappedData.facialSymmetry.notes,
        skinQualityNotes: mappedData.skinQuality.notes,
        facialProportionsNotes: mappedData.facialProportions.notes,
        
        // Recommendations
        strengths: formFields.strengths || formFields.keyStrengths || 'Natural facial harmony observed.',
        nonSurgicalOptions: formFields.nonSurgicalOptions || formFields.nonSurgicalRecommendations || 'Skincare optimization recommended.',
        surgicalOptions: formFields.surgicalOptions || formFields.surgicalRecommendations || 'Consultation available if desired.',
        lifestyleRecommendations: formFields.lifestyleRecommendations || formFields.lifestyle || 'Maintain healthy lifestyle habits.',
        
        // Summary
        clinicalSummary: mappedData.summary,
        overallAssessment: formFields.overallAssessment || 'Professional facial analysis completed with personalized recommendations.',
        
        generatedAt: today.toISOString()
      },
      htmlPreview: htmlTemplate,
      reportId: reportId,
      debug: {
        receivedFields: Object.keys(formFields),
        receivedData: formFields,
        mappedData: mappedData,
        templateChecks: {
          hasClientName,
          hasDoctor,
          hasReportId,
          hasAge
        }
      }
    };

    console.log('📤 Sending response with debug info');
    console.log('🎯 Response includes actual data:', {
      clientName: responseData.reportData.clientName,
      aestheticianName: responseData.reportData.aestheticianName,
      reportId: responseData.reportId
    });
    
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Error processing form:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper functions
function getRatingText(score) {
  const num = parseFloat(score);
  if (isNaN(num)) return 'Good';
  if (num >= 9) return 'Excellent';
  if (num >= 8) return 'Very Good';
  if (num >= 7) return 'Good';  
  if (num >= 6) return 'Fair';
  if (num >= 5) return 'Needs Improvement';
  return 'Poor';
}

function getQualityScore(quality) {
  if (typeof quality === 'number') return quality;
  
  const qualityStr = String(quality).toLowerCase();
  const qualityMap = {
    'excellent': 9.5,
    'very good': 8.5,
    'good': 8.0,
    'average': 6.5,
    'fair': 5.5,
    'needs-improvement': 5.0,
    'needs improvement': 5.0,
    'poor': 3.0
  };
  
  return qualityMap[qualityStr] || parseFloat(quality) || 7.0;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildRecommendations(formFields) {
  const recommendations = [];
  
  // Key Strengths
  if (formFields.strengths && formFields.strengths.trim()) {
    recommendations.push({
      title: 'Key Strengths & Best Features',
      description: formFields.strengths
    });
  } else if (formFields.keyStrengths && formFields.keyStrengths.trim()) {
    recommendations.push({
      title: 'Key Strengths & Best Features',
      description: formFields.keyStrengths
    });
  }
  
  // Non-Surgical Options
  if (formFields.nonSurgicalOptions && formFields.nonSurgicalOptions.trim()) {
    recommendations.push({
      title: 'Non-Surgical Enhancement Options',
      description: formFields.nonSurgicalOptions
    });
  } else if (formFields.nonSurgicalRecommendations && formFields.nonSurgicalRecommendations.trim()) {
    recommendations.push({
      title: 'Non-Surgical Enhancement Options',
      description: formFields.nonSurgicalRecommendations
    });
  }
  
  // Surgical Options
  if (formFields.surgicalOptions && formFields.surgicalOptions.trim()) {
    recommendations.push({
      title: 'Surgical Enhancement Considerations', 
      description: formFields.surgicalOptions
    });
  } else if (formFields.surgicalRecommendations && formFields.surgicalRecommendations.trim()) {
    recommendations.push({
      title: 'Surgical Enhancement Considerations', 
      description: formFields.surgicalRecommendations
    });
  }
  
  // Lifestyle Recommendations
  if (formFields.lifestyleRecommendations && formFields.lifestyleRecommendations.trim()) {
    recommendations.push({
      title: 'Lifestyle & Wellness Recommendations',
      description: formFields.lifestyleRecommendations
    });
  } else if (formFields.lifestyle && formFields.lifestyle.trim()) {
    recommendations.push({
      title: 'Lifestyle & Wellness Recommendations',
      description: formFields.lifestyle
    });
  }

  // Default recommendation if none provided
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
  
  if (formFields.overallScore) {
    summary += `Overall assessment score: ${formFields.overallScore}/10. `;
  }
  
  if (formFields.clinicalNotes && formFields.clinicalNotes.trim()) {
    summary += formFields.clinicalNotes + ' ';
  }
  
  summary += 'Detailed recommendations provided based on individual assessment.';
  
  return summary;
}
