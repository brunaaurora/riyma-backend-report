// api/generate-riyma-report.js
// COMPLETE FINAL VERSION - Professional Clinical Template with Bold Header Logo

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
    console.log('🚀 === RIYMA CLINICAL REPORT GENERATION ===');
    
    // Parse JSON data from React form
    let formFields = {};
    
    if (req.body && typeof req.body === 'object') {
      formFields = req.body;
      console.log('📝 Received', Object.keys(formFields).length, 'form fields');
    }

    // Generate unique report ID
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    const reportId = `RYM-${year}${month}${day}-${timestamp}`;

    // Map form data to template format
    const reportData = {
      // Patient Information
      patientName: formFields.clientName || 'Name Not Provided',
      age: formFields.clientAge ? `${formFields.clientAge} years` : 'Age Not Provided',
      gender: 'Not Specified',
      assessmentDate: formatDate(formFields.analysisDate) || formatDate(today.toISOString().split('T')[0]),
      doctorName: formFields.aestheticianName || 'Aesthetician Not Provided',
      
      // Assessment Scores with proper conversion
      facialSymmetry: {
        rating: getRatingText(formFields.facialSymmetry),
        score: convertToTenPoint(formFields.facialSymmetry),
        notes: formFields.proportionNotes || 'Facial symmetry assessment completed.'
      },
      
      skinQuality: {
        rating: capitalizeFirst(formFields.skinQuality),
        score: getQualityScore(formFields.skinQuality),
        notes: formFields.skinAnalysis || 'Skin quality assessment completed.'
      },
      
      facialProportions: {
        rating: getRatingText(formFields.ruleOfThirds),
        score: convertToTenPoint(formFields.ruleOfThirds),
        notes: formFields.featureAnalysis || 'Facial proportions assessed.'
      },

      // Individual Features
      eyesRating: formFields.eyesRating || 0,
      noseRating: formFields.noseRating || 0,
      lipsRating: formFields.lipsRating || 0,
      jawlineRating: formFields.jawlineRating || 0,
      
      // Enhancement Recommendations
      recommendations: buildRecommendations(formFields),
      
      // Clinical Summary
      clinicalSummary: buildClinicalSummary(formFields),
      
      // Report metadata
      reportId: reportId,
      generatedDate: formatDate(today.toISOString().split('T')[0]),
      reviewedBy: formFields.aestheticianName || 'Professional Aesthetician'
    };

    // Generate professional clinical template
    const htmlTemplate = generateClinicalTemplate(reportData);
    
    console.log('✅ Professional clinical report generated');
    console.log('📋 Report ID:', reportId);
    console.log('📋 Patient:', reportData.patientName);
    console.log('📋 Doctor:', reportData.doctorName);
    
    return res.status(200).json({
      success: true,
      reportData: reportData,
      htmlPreview: htmlTemplate,
      reportId: reportId,
      generatedAt: today.toISOString()
    });

  } catch (error) {
    console.error('❌ Error generating clinical report:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to generate clinical report', 
      details: error.message
    });
  }
};

// Professional Clinical Template Function
function generateClinicalTemplate(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Riyma Clinical Assessment Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: white;
            font-size: 14px;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(164, 186, 194, 0.3);
        }

        .logo {
            font-size: 32px;
            font-weight: 600;
            letter-spacing: 0.2em;
            color: #1e293b;
            text-transform: lowercase;
        }

        .report-info {
            text-align: right;
            color: #64748b;
            font-size: 12px;
        }

        .report-id {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .title-section {
            text-align: center;
            margin-bottom: 50px;
        }

        .main-title {
            font-size: 28px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }

        .subtitle {
            font-size: 16px;
            font-style: italic;
            color: #64748b;
            font-weight: 300;
        }

        .patient-section {
            background: rgba(164, 186, 194, 0.1);
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 40px;
            border-left: 4px solid rgba(164, 186, 194, 0.8);
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .section-number {
            background: rgba(164, 186, 194, 0.3);
            color: #1e293b;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 12px;
            font-size: 14px;
        }

        .patient-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .field-group {
            margin-bottom: 15px;
        }

        .field-label {
            font-weight: 600;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .field-value {
            color: #1e293b;
            font-size: 14px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(164, 186, 194, 0.3);
        }

        .clinical-section {
            margin-bottom: 40px;
        }

        .assessment-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 3fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .assessment-item {
            background: white;
            border: 1px solid rgba(164, 186, 194, 0.3);
            border-radius: 6px;
            padding: 15px;
        }

        .assessment-label {
            font-weight: 600;
            color: #374151;
            font-size: 13px;
            margin-bottom: 8px;
        }

        .assessment-value {
            color: #1e293b;
            font-size: 14px;
        }

        .rating-visual {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 5px;
        }

        .rating-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #e2e8f0;
        }

        .rating-dot.active {
            background: rgba(164, 186, 194, 0.8);
        }

        .enhancement-box {
            background: linear-gradient(135deg, rgba(164, 186, 194, 0.1) 0%, rgba(164, 186, 194, 0.05) 100%);
            border: 1px solid rgba(164, 186, 194, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
        }

        .enhancement-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .enhancement-text {
            color: #475569;
            font-size: 13px;
            line-height: 1.6;
        }

        .notes-section {
            background: #f8fafc;
            border: 1px solid rgba(164, 186, 194, 0.3);
            border-radius: 8px;
            padding: 25px;
            margin-top: 40px;
        }

        .notes-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
        }

        .notes-text {
            color: #475569;
            line-height: 1.7;
            font-size: 13px;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid rgba(164, 186, 194, 0.3);
            text-align: center;
            color: #64748b;
            font-size: 11px;
        }

        .confidential {
            background: rgba(164, 186, 194, 0.1);
            padding: 8px 16px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 10px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <div class="logo">riyma</div>
            <div class="report-info">
                <div class="report-id">Report ID: ${data.reportId}</div>
                <div>Generated: ${data.generatedDate}</div>
                <div>Reviewed by: ${data.reviewedBy}</div>
            </div>
        </div>

        <!-- Title Section -->
        <div class="title-section">
            <h1 class="main-title">Clinical Aesthetic Assessment</h1>
            <p class="subtitle">Professional facial analysis and enhancement recommendations</p>
        </div>

        <!-- Patient Information -->
        <div class="patient-section">
            <h2 class="section-title">
                <span class="section-number">01</span>
                Patient Information
            </h2>
            <div class="patient-grid">
                <div class="field-group">
                    <div class="field-label">Full Name</div>
                    <div class="field-value">${data.patientName}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Age</div>
                    <div class="field-value">${data.age}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Assessment Date</div>
                    <div class="field-value">${data.assessmentDate}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Gender</div>
                    <div class="field-value">${data.gender}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Referring Physician</div>
                    <div class="field-value">${data.doctorName}</div>
                </div>
            </div>
        </div>

        <!-- Clinical Assessment -->
        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">02</span>
                Clinical Assessment Results
            </h2>

            <!-- Facial Symmetry -->
            <div class="assessment-grid">
                <div class="assessment-item">
                    <div class="assessment-label">Facial Symmetry</div>
                    <div class="assessment-value">${data.facialSymmetry.rating}</div>
                    <div class="rating-visual">
                        ${generateRatingDots(data.facialSymmetry.score)}
                    </div>
                </div>
                <div class="assessment-item">
                    <div class="assessment-label">Score</div>
                    <div class="assessment-value" style="font-size: 18px; font-weight: 600;">${data.facialSymmetry.score}/10</div>
                </div>
                <div class="assessment-item">
                    <div class="assessment-label">Clinical Notes</div>
                    <div class="assessment-value">${data.facialSymmetry.notes}</div>
                </div>
            </div>

            <!-- Skin Quality -->
            <div class="assessment-grid">
                <div class="assessment-item">
                    <div class="assessment-label">Skin Quality</div>
                    <div class="assessment-value">${data.skinQuality.rating}</div>
                    <div class="rating-visual">
                        ${generateRatingDots(data.skinQuality.score)}
                    </div>
                </div>
                <div class="assessment-item">
                    <div class="assessment-label">Score</div>
                    <div class="assessment-value" style="font-size: 18px; font-weight: 600;">${data.skinQuality.score}/10</div>
                </div>
                <div class="assessment-item">
                    <div class="assessment-label">Clinical Notes</div>
                    <div class="assessment-value">${data.skinQuality.notes}</div>
                </div>
            </div>

            <!-- Facial Proportions -->
            <div class="assessment-grid">
                <div class="assessment-item">
                    <div class="assessment-label">Facial Proportions</div>
                    <div class="assessment-value">${data.facialProportions.rating}</div>
                    <div class="rating-visual">
                        ${generateRatingDots(data.facialProportions.score)}
                    </div>
                </div>
                <div class="assessment-item">
                    <div class="assessment-label">Score</div>
                    <div class="assessment-value" style="font-size: 18px; font-weight: 600;">${data.facialProportions.score}/10</div>
                </div>
                <div class="assessment-item">
                    <div class="assessment-label">Clinical Notes</div>
                    <div class="assessment-value">${data.facialProportions.notes}</div>
                </div>
            </div>
        </div>

        <!-- Enhancement Recommendations -->
        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">03</span>
                Enhancement Recommendations
            </h2>

            <div class="enhancements-section">
                ${data.recommendations.map(rec => `
                <div class="enhancement-box">
                    <div class="enhancement-title">${rec.title}</div>
                    <div class="enhancement-text">${rec.description}</div>
                </div>
                `).join('')}
            </div>
        </div>

        <!-- Professional Assessment Summary -->
        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">04</span>
                Professional Assessment Summary
            </h2>

            <div class="notes-section">
                <div class="notes-title">Clinical Summary</div>
                <div class="notes-text">${data.clinicalSummary}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="confidential">CONFIDENTIAL MEDICAL REPORT</div>
            <div>This report contains confidential patient information and is intended solely for the use of the patient and authorized healthcare providers.</div>
            <div style="margin-top: 10px;">
                <strong>riyma</strong> · Professional Aesthetic Assessment · www.riyma.com
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Helper Functions
function getRatingText(score) {
  const num = parseInt(score);
  switch(num) {
    case 5: return 'Excellent';
    case 4: return 'Very Good'; 
    case 3: return 'Good';
    case 2: return 'Fair';
    case 1: return 'Needs Improvement';
    default: return 'Good';
  }
}

function convertToTenPoint(score) {
  const num = parseInt(score);
  // Convert 1-5 scale to 1-10 scale
  return Math.round(num * 2).toFixed(1);
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
  if (!str) return 'Good';
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

function formatDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
}

function generateRatingDots(score) {
  const numDots = Math.round(parseFloat(score) / 2); // Convert 10-point to 5-dot scale
  let dots = '';
  for (let i = 1; i <= 5; i++) {
    const activeClass = i <= numDots ? 'active' : '';
    dots += `<div class="rating-dot ${activeClass}"></div>`;
  }
  return dots;
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

function buildClinicalSummary(formFields) {
  let summary = `The patient presents with ${formFields.aestheticType || 'balanced'} aesthetic characteristics. `;
  
  if (formFields.overallHarmony) {
    summary += `Overall facial harmony is rated ${formFields.overallHarmony}/5. `;
  }
  
  if (formFields.skinQuality) {
    summary += `Skin quality assessment indicates ${formFields.skinQuality} condition. `;
  }
  
  if (formFields.softTissue) {
    summary += `Soft tissue distribution appears ${formFields.softTissue.replace('-', ' ')}. `;
  }
  
  summary += 'The recommended treatment approach follows evidence-based protocols with conservative enhancement philosophy. ';
  summary += 'All recommendations are tailored to the patient\'s individual anatomy and aesthetic goals.';
  
  return summary;
}
