// api/generate-riyma-report.js
// COMPLETE FINAL VERSION - ENHANCED CSS + FIXED DESIGN + CORS + Patient Photo

module.exports = async function handler(req, res) {
  // ===== COMPREHENSIVE CORS HEADERS =====
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 === RIYMA CLINICAL REPORT GENERATION ===');
    console.log('📡 Request origin:', req.headers.origin);
    
    let formFields = {};
    
    if (req.body && typeof req.body === 'object') {
      formFields = req.body;
      console.log('📝 Received', Object.keys(formFields).length, 'form fields');
      console.log('📷 Patient photo included:', !!formFields.patientPhoto);
      console.log('📷 Analysis images count:', (formFields.analysisImages || []).length);
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
      patientName: formFields.clientName || 'Name Not Provided',
      age: formFields.clientAge ? `${formFields.clientAge} years` : 'Age Not Provided',
      gender: 'Not Specified',
      assessmentDate: formatDate(formFields.analysisDate) || formatDate(today.toISOString().split('T')[0]),
      doctorName: formFields.aestheticianName || 'Aesthetician Not Provided',
      patientPhoto: formFields.patientPhoto || null,
      analysisImages: formFields.analysisImages || [],
      
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

      eyesRating: formFields.eyesRating || 0,
      noseRating: formFields.noseRating || 0,
      lipsRating: formFields.lipsRating || 0,
      jawlineRating: formFields.jawlineRating || 0,
      
      recommendations: buildRecommendations(formFields),
      clinicalSummary: buildClinicalSummary(formFields),
      
      reportId: reportId,
      generatedDate: formatDate(today.toISOString().split('T')[0]),
      reviewedBy: formFields.aestheticianName || 'Professional Aesthetician'
    };

    const htmlTemplate = generateClinicalTemplate(reportData);
    
    console.log('✅ Enhanced clinical report generated with updated styling');
    
    return res.status(200).json({
      success: true,
      reportData: reportData,
      htmlPreview: htmlTemplate,
      reportId: reportId,
      generatedAt: today.toISOString(),
      debug: {
        receivedFields: Object.keys(formFields),
        totalFields: Object.keys(formFields).length,
        keyFieldsReceived: {
          clientName: !!formFields.clientName,
          aestheticianName: !!formFields.aestheticianName,
          analysisDate: !!formFields.analysisDate,
          patientPhoto: !!formFields.patientPhoto
        }
      }
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

// ENHANCED LUXURY CLINICAL TEMPLATE - 2024 STANDARDS
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background: #ffffff;
            font-size: 14px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 25mm;
            background: #ffffff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            position: relative;
        }

        /* LUXURY DESIGN ENHANCEMENTS */
        .page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #64748b 0%, #94a3b8 50%, #64748b 100%);
        }

        /* RESPONSIVE DESIGN */
        @media screen and (max-width: 768px) {
            .page {
                width: 100%;
                margin: 0;
                padding: 20px;
                box-shadow: none;
                min-height: auto;
            }
            
            .page::before {
                display: none;
            }
            
            .header {
                flex-direction: column;
                text-align: center;
                gap: 20px;
                margin-bottom: 35px;
            }
            
            .report-info {
                text-align: center;
            }
            
            .patient-layout {
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 20px;
            }
            
            .patient-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .assessment-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .photos-grid {
                grid-template-columns: 1fr !important;
                gap: 15px;
            }
        }

        @media screen and (max-width: 480px) {
            .page {
                padding: 15px;
            }
            
            .logo {
                font-size: 28px !important;
            }
            
            .main-title {
                font-size: 22px !important;
            }
            
            .analysis-photo {
                height: 250px !important;
            }
        }

        /* HEADER STYLING */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 45px;
            padding-bottom: 25px;
            border-bottom: 1px solid #e2e8f0;
            position: relative;
        }

        .logo {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: normal;
            color: #1a202c;
            text-transform: lowercase;
            font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .report-info {
            text-align: right;
            color: #64748b;
            font-size: 12px;
            line-height: 1.5;
        }

        .report-id {
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 4px;
            font-size: 13px;
        }

        /* TITLE SECTION */
        .title-section {
            text-align: center;
            margin-bottom: 50px;
            padding: 20px 0;
        }

        .main-title {
            font-size: 32px;
            font-weight: 300;
            color: #1a202c;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }

        .subtitle {
            font-size: 16px;
            font-style: italic;
            color: #64748b;
            font-weight: 300;
        }

        /* PATIENT SECTION - FIXED DESIGN */
        .patient-section {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 45px;
            border: none;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .patient-layout {
            display: flex;
            gap: 30px;
            align-items: flex-start;
        }

        .patient-photo-container {
            flex-shrink: 0;
            width: 130px;
            height: 160px;
        }

        .patient-photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .patient-photo-placeholder {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 2px dashed #cbd5e1;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 12px;
            text-align: center;
            padding: 15px;
        }

        .patient-info {
            flex: 1;
        }

        /* SECTION TITLES */
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        .section-number {
            background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
            color: #ffffff;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 15px;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
        }

        .patient-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
        }

        .field-group {
            margin-bottom: 20px;
        }

        .field-label {
            font-weight: 600;
            color: #374151;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 6px;
        }

        .field-value {
            color: #1a202c;
            font-size: 15px;
            font-weight: 500;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }

        /* CLINICAL SECTIONS */
        .clinical-section {
            margin-bottom: 45px;
        }

        .assessment-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 3fr;
            gap: 20px;
            margin-bottom: 25px;
        }

        .assessment-item {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            transition: all 0.2s ease;
        }

        .assessment-item:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .assessment-label {
            font-weight: 600;
            color: #374151;
            font-size: 13px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .assessment-value {
            color: #1a202c;
            font-size: 15px;
            font-weight: 500;
        }

        .rating-visual {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 8px;
        }

        .rating-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #e2e8f0;
            transition: all 0.2s ease;
        }

        .rating-dot.active {
            background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
            box-shadow: 0 2px 4px rgba(100, 116, 139, 0.3);
        }

        /* ENHANCEMENT BOXES */
        .enhancement-box {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .enhancement-title {
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 10px;
            font-size: 15px;
        }

        .enhancement-text {
            color: #475569;
            font-size: 14px;
            line-height: 1.7;
        }

        /* NOTES SECTION */
        .notes-section {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 30px;
            margin-top: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .notes-title {
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .notes-text {
            color: #475569;
            line-height: 1.8;
            font-size: 14px;
        }

        /* PHOTOS SECTION - ENHANCED PORTRAIT GRID */
        .photos-section {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 30px;
            margin-top: 35px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .photos-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-top: 20px;
        }

        .analysis-photo {
            width: 100%;
            height: 320px;
            object-fit: cover;
            border-radius: 10px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }

        .analysis-photo:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        /* FOOTER */
        .footer {
            margin-top: 50px;
            padding-top: 25px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }

        .confidential {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            padding: 10px 20px;
            border-radius: 6px;
            display: inline-block;
            margin-bottom: 15px;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 11px;
        }

        /* PRINT OPTIMIZATION */
        @media print {
            .page {
                width: 100%;
                margin: 0;
                padding: 15mm;
                box-shadow: none;
            }
            
            .page::before {
                display: none;
            }
            
            .photos-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            
            .analysis-photo {
                height: 220px;
            }
            
            .assessment-item:hover,
            .analysis-photo:hover {
                transform: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
        }

        /* TABLET RESPONSIVE */
        @media screen and (max-width: 1024px) and (min-width: 769px) {
            .photos-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
            
            .analysis-photo {
                height: 280px;
            }
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
            <div class="patient-layout">
                <div class="patient-photo-container">
                    ${data.patientPhoto ? 
                        `<img src="${data.patientPhoto}" alt="Patient Photo" class="patient-photo" />` :
                        `<div class="patient-photo-placeholder">Patient Photo</div>`
                    }
                </div>
                <div class="patient-info">
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
                    <div class="assessment-value" style="font-size: 20px; font-weight: 700;">${data.facialSymmetry.score}/10</div>
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
                    <div class="assessment-value" style="font-size: 20px; font-weight: 700;">${data.skinQuality.score}/10</div>
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
                    <div class="assessment-value" style="font-size: 20px; font-weight: 700;">${data.facialProportions.score}/10</div>
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

        <!-- Analysis Photos - ENHANCED PORTRAIT GRID -->
        ${data.analysisImages && data.analysisImages.length > 0 ? `
        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">◎</span>
                Analysis Photos
            </h2>
            <div class="photos-section">
                <div class="notes-title">Clinical Documentation (${data.analysisImages.length} ${data.analysisImages.length === 1 ? 'photo' : 'photos'})</div>
                <div class="photos-grid">
                    ${data.analysisImages.map((image, index) => `
                        <img src="${image}" alt="Clinical Analysis Photo ${index + 1}" class="analysis-photo" />
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
            <div class="confidential">Confidential Medical Report</div>
            <div>This report contains confidential patient information and is intended solely for the use of the patient and authorized healthcare providers.</div>
            <div style="margin-top: 15px;">
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
  const numDots = Math.round(parseFloat(score) / 2);
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
