// api/generate-riyma-report.js
// DEFINITIVE FIX - Exact field names from React form

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
    console.log('🚀 === RIYMA FORM PROCESSING START ===');
    
    // VERCEL FORMDATA PARSING - Handle multiple formats
    let formFields = {};
    
    if (req.body) {
      console.log('📋 Request body type:', typeof req.body);
      console.log('📋 Request body keys:', Object.keys(req.body));
      
      if (typeof req.body === 'object') {
        // Vercel might nest FormData or flatten it
        if (req.body.formData) {
          formFields = req.body.formData;
          console.log('📦 Using nested formData structure');
        } else {
          formFields = req.body;
          console.log('📦 Using flat body structure');
        }
      }
    }

    console.log('📝 === RECEIVED FORM DATA ===');
    console.log('📝 Total fields received:', Object.keys(formFields).length);
    Object.keys(formFields).forEach(key => {
      console.log(`   ${key}: "${formFields[key]}"`);
    });

    // Generate unique report ID
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    const reportId = `RYM-${year}${month}${day}-${timestamp}`;

    // EXACT FIELD MAPPING - Using React form field names
    const mappedData = {
      // Patient Information (exact field names from form)
      patientName: formFields.clientName || 'Name Not Provided',
      age: formFields.clientAge || 'Age Not Provided',
      gender: 'Not Specified', // Form doesn't have gender field
      assessmentDate: formFields.analysisDate || today.toISOString().split('T')[0],
      doctorName: formFields.aestheticianName || 'Aesthetician Not Provided',
      clientId: formFields.clientId || '',
      certification: formFields.certification || '',
      
      // Assessment Scores (convert ratings to scores)
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

      // Individual feature ratings
      eyesRating: parseFloat(formFields.eyesRating) || 0,
      noseRating: parseFloat(formFields.noseRating) || 0,
      lipsRating: parseFloat(formFields.lipsRating) || 0,
      jawlineRating: parseFloat(formFields.jawlineRating) || 0,
      
      // Skin assessment
      softTissue: formFields.softTissue || '',
      
      // Overall assessment
      aestheticType: formFields.aestheticType || '',
      overallHarmony: formFields.overallHarmony || '',

      // Recommendations (exact field names)
      strengths: formFields.strengths || '',
      nonSurgicalOptions: formFields.nonSurgicalOptions || '',
      surgicalOptions: formFields.surgicalOptions || '',
      lifestyleRecommendations: formFields.lifestyleRecommendations || '',
      
      // Build recommendations array
      recommendations: buildRecommendations(formFields),
      
      // Summary
      summary: buildSummary(formFields),
      
      // Report metadata
      reportId: reportId,
      reviewedBy: formFields.aestheticianName || 'Professional Aesthetician',
      generatedAt: today.toISOString()
    };

    console.log('✅ === MAPPED DATA VERIFICATION ===');
    console.log('   Patient Name:', `"${mappedData.patientName}"`);
    console.log('   Age:', `"${mappedData.age}"`);
    console.log('   Assessment Date:', `"${mappedData.assessmentDate}"`);
    console.log('   Doctor Name:', `"${mappedData.doctorName}"`);
    console.log('   Report ID:', `"${mappedData.reportId}"`);
    console.log('   Facial Symmetry Score:', mappedData.facialSymmetry.score);
    console.log('   Skin Quality:', `"${mappedData.skinQuality.rating}"`);
    console.log('   Strengths:', mappedData.strengths ? 'PROVIDED' : 'EMPTY');

    // Generate HTML template
    console.log('📄 Generating HTML template...');
    const htmlTemplate = generateRiymaReportTemplate(mappedData, []);
    
    // CRITICAL VERIFICATION - Check if actual data made it to template
    const dataChecks = {
      hasClientName: htmlTemplate.includes(mappedData.patientName) && !htmlTemplate.includes('Name Not Provided'),
      hasDoctor: htmlTemplate.includes(mappedData.doctorName) && !htmlTemplate.includes('Aesthetician Not Provided'),
      hasAge: htmlTemplate.includes(mappedData.age) && !htmlTemplate.includes('Age Not Provided'),
      hasReportId: htmlTemplate.includes(mappedData.reportId),
      hasAssessmentDate: htmlTemplate.includes(mappedData.assessmentDate)
    };
    
    console.log('🔍 === TEMPLATE DATA VERIFICATION ===');
    console.log('   Client name in template:', dataChecks.hasClientName);
    console.log('   Doctor name in template:', dataChecks.hasDoctor);  
    console.log('   Age in template:', dataChecks.hasAge);
    console.log('   Report ID in template:', dataChecks.hasReportId);
    console.log('   Assessment date in template:', dataChecks.hasAssessmentDate);
    
    // If data is not in template, there's an issue with the template function
    if (!dataChecks.hasClientName || !dataChecks.hasDoctor) {
      console.log('⚠️  WARNING: Template is not using the provided data correctly!');
      console.log('⚠️  This indicates an issue with the generateRiymaReportTemplate function');
    }
    
    // Build comprehensive response
    const responseData = {
      success: true,
      reportData: {
        // Patient info
        clientName: mappedData.patientName,
        age: mappedData.age,
        analysisDate: mappedData.assessmentDate,
        aestheticianName: mappedData.doctorName,
        clientId: mappedData.clientId,
        certification: mappedData.certification,
        
        // Assessment data
        facialSymmetryScore: mappedData.facialSymmetry.score,
        facialSymmetryRating: mappedData.facialSymmetry.rating,
        facialSymmetryNotes: mappedData.facialSymmetry.notes,
        
        skinQualityScore: mappedData.skinQuality.score,
        skinQualityRating: mappedData.skinQuality.rating, 
        skinQualityNotes: mappedData.skinQuality.notes,
        
        facialProportionsScore: mappedData.facialProportions.score,
        facialProportionsRating: mappedData.facialProportions.rating,
        facialProportionsNotes: mappedData.facialProportions.notes,
        
        // Individual features
        eyesRating: mappedData.eyesRating,
        noseRating: mappedData.noseRating,
        lipsRating: mappedData.lipsRating,
        jawlineRating: mappedData.jawlineRating,
        
        // Overall assessment
        aestheticType: mappedData.aestheticType,
        overallHarmony: mappedData.overallHarmony,
        softTissue: mappedData.softTissue,
        
        // Recommendations
        strengths: mappedData.strengths,
        nonSurgicalOptions: mappedData.nonSurgicalOptions,
        surgicalOptions: mappedData.surgicalOptions,
        lifestyleRecommendations: mappedData.lifestyleRecommendations,
        
        // Summary
        clinicalSummary: mappedData.summary,
        
        generatedAt: mappedData.generatedAt
      },
      htmlPreview: htmlTemplate,
      reportId: reportId,
      debug: {
        receivedFieldCount: Object.keys(formFields).length,
        receivedFields: Object.keys(formFields),
        sampleData: {
          clientName: formFields.clientName,
          aestheticianName: formFields.aestheticianName,
          analysisDate: formFields.analysisDate,
          facialSymmetry: formFields.facialSymmetry,
          skinQuality: formFields.skinQuality
        },
        mappedData: {
          patientName: mappedData.patientName,
          doctorName: mappedData.doctorName,
          assessmentDate: mappedData.assessmentDate
        },
        templateChecks: dataChecks
      }
    };

    console.log('📤 === SENDING RESPONSE ===');
    console.log('✅ Response includes:', {
      clientName: responseData.reportData.clientName,
      aestheticianName: responseData.reportData.aestheticianName,
      reportId: responseData.reportId,
      templateValid: dataChecks.hasClientName && dataChecks.hasDoctor
    });
    
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ === ERROR PROCESSING FORM ===', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper functions for rating conversion
function getRatingText(score) {
  const num = parseFloat(score);
  if (isNaN(num)) return 'Good';
  
  // Convert 1-5 scale to text
  switch(num) {
    case 5: return 'Excellent';
    case 4: return 'Very Good'; 
    case 3: return 'Good';
    case 2: return 'Fair';
    case 1: return 'Needs Improvement';
    default: return 'Good';
  }
}

function getQualityScore(quality) {
  if (typeof quality === 'number') return quality;
  
  const qualityStr = String(quality).toLowerCase();
  const qualityMap = {
    'excellent': 9.5,
    'good': 8.0,
    'average': 6.5,
    'needs-improvement': 5.0,
    'poor': 3.0
  };
  
  return qualityMap[qualityStr] || parseFloat(quality) || 7.0;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

function buildRecommendations(formFields) {
  const recommendations = [];
  
  if (formFields.strengths && formFields.strengths.trim()) {
    recommendations.push({
      title: 'Key Strengths & Best Features',
      description: formFields.strengths
    });
  }
  
  if (formFields.nonSurgicalOptions && formFields.nonSurgicalOptions.trim()) {
    recommendations.push({
      title: 'Non-Surgical Enhancement Options',
      description: formFields.nonSurgicalOptions
    });
  }
  
  if (formFields.surgicalOptions && formFields.surgicalOptions.trim()) {
    recommendations.push({
      title: 'Surgical Enhancement Considerations', 
      description: formFields.surgicalOptions
    });
  }
  
  if (formFields.lifestyleRecommendations && formFields.lifestyleRecommendations.trim()) {
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
  
  if (formFields.skinAnalysis && formFields.skinAnalysis.trim()) {
    summary += 'Detailed skin analysis provided. ';
  }
  
  summary += 'Personalized recommendations based on individual assessment.';
  
  return summary;
}
