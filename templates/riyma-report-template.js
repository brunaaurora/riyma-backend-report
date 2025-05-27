// templates/riyma-report-template.js
// New Riyma Clinical PDF Template with Cloudinary support

const generateRiymaReportTemplate = (formData, cloudinaryImages = []) => {
  return `
<!DOCTYPE html>
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
        }

        /* Header */
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
            font-weight: 300;
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

        /* Title Section */
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

        /* Patient Info */
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

        /* Clinical Sections */
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

        /* Enhancement Boxes */
        .enhancements-section {
            margin-top: 30px;
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

        /* Professional Notes */
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

        /* Footer */
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
                <div class="report-id">Report ID: \${formData.reportId || generateReportId()}</div>
                <div>Generated: \${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>Reviewed by: \${formData.reviewedBy || 'Dr. [Manager Name]'}</div>
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
                    <div class="field-value">\${formData.patientName || formData.fullName || '[Patient Name]'}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Date of Birth</div>
                    <div class="field-value">\${formData.dateOfBirth || formData.dob || '[Date of Birth]'}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Age</div>
                    <div class="field-value">\${formData.age || '[Age]'} years</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Assessment Date</div>
                    <div class="field-value">\${formData.assessmentDate || formData.date || new Date().toLocaleDateString()}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Gender</div>
                    <div class="field-value">\${formData.gender || '[Gender]'}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Referring Physician</div>
                    <div class="field-value">\${formData.doctorName || formData.physician || '[Doctor Name]'}</div>
                </div>
            </div>
        </div>

        <!-- Clinical Assessment -->
        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">02</span>
                Clinical Assessment Results
            </h2>
            \${generateAssessmentSections(formData)}
        </div>

        <!-- Enhancement Recommendations -->
        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">03</span>
                Enhancement Recommendations
            </h2>
            <div class="enhancements-section">
                \${generateRecommendations(formData)}
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
                <div class="notes-text">
                    \${formData.summary || formData.clinicalSummary || 'The patient presents with well-balanced facial features and good overall aesthetic harmony. Primary areas of focus include minor volume restoration and skin quality optimization.'}
                </div>
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
</html>
  `;
};

// Helper functions
function generateRatingDots(score) {
  const totalDots = 10;
  const activeDots = Math.round(score);
  let dots = '';
  
  for (let i = 1; i <= totalDots; i++) {
    dots += `<div class="rating-dot ${i <= activeDots ? 'active' : ''}"></div>`;
  }
  
  return dots;
}

function generateReportId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  
  return `RYM-${year}${month}${day}-${timestamp}`;
}

function generateAssessmentSections(formData) {
  const assessments = [
    {
      key: 'facialSymmetry',
      label: 'Facial Symmetry',
      defaultRating: 'Excellent',
      defaultScore: 9.2,
      defaultNotes: 'Well-balanced facial proportions with minimal asymmetry observed.'
    },
    {
      key: 'skinQuality',
      label: 'Skin Quality', 
      defaultRating: 'Good',
      defaultScore: 7.8,
      defaultNotes: 'Good skin elasticity with minor textural irregularities noted.'
    },
    {
      key: 'facialProportions',
      label: 'Facial Proportions',
      defaultRating: 'Very Good', 
      defaultScore: 8.5,
      defaultNotes: 'Golden ratio proportions observed with minor adjustment potential.'
    }
  ];

  return assessments.map(assessment => {
    const data = formData[assessment.key] || {};
    const rating = data.rating || assessment.defaultRating;
    const score = data.score || assessment.defaultScore;
    const notes = data.notes || assessment.defaultNotes;

    return `
      <div class="assessment-grid">
          <div class="assessment-item">
              <div class="assessment-label">${assessment.label}</div>
              <div class="assessment-value">${rating}</div>
              <div class="rating-visual">
                  ${generateRatingDots(score)}
              </div>
          </div>
          <div class="assessment-item">
              <div class="assessment-label">Score</div>
              <div class="assessment-value" style="font-size: 18px; font-weight: 600;">${score}/10</div>
          </div>
          <div class="assessment-item">
              <div class="assessment-label">Clinical Notes</div>
              <div class="assessment-value">${notes}</div>
          </div>
      </div>
    `;
  }).join('');
}

function generateRecommendations(formData) {
  if (formData.recommendations && Array.isArray(formData.recommendations)) {
    return formData.recommendations.map(rec => `
      <div class="enhancement-box">
          <div class="enhancement-title">${rec.title || 'Clinical Recommendation'}</div>
          <div class="enhancement-text">${rec.description || rec}</div>
      </div>
    `).join('');
  }

  return `
    <div class="enhancement-box">
        <div class="enhancement-title">Primary Recommendation: Dermal Fillers</div>
        <div class="enhancement-text">
            Strategic placement of hyaluronic acid fillers to enhance facial balance and restore volume.
        </div>
    </div>
    <div class="enhancement-box">
        <div class="enhancement-title">Secondary Recommendation: Skin Resurfacing</div>
        <div class="enhancement-text">
            Fractional laser resurfacing to address textural irregularities and improve skin quality.
        </div>
    </div>
  `;
}

module.exports = { generateRiymaReportTemplate };
