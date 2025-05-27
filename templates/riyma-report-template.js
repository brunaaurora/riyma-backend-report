// templates/riyma-report-template.js
// COMPLETELY CLEAN - No test content anywhere

const generateRiymaReportTemplate = (formData, cloudinaryImages = []) => {
  
  // Debug logging
  console.log('🎨 Template received Report ID:', formData.reportId);
  
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
        <div class="header">
            <div class="logo">riyma</div>
            <div class="report-info">
                <div class="report-id">Report ID: ${formData.reportId}</div>
                <div>Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>Reviewed by: ${formData.reviewedBy}</div>
            </div>
        </div>

        <div class="title-section">
            <h1 class="main-title">Clinical Aesthetic Assessment</h1>
            <p class="subtitle">Professional facial analysis and enhancement recommendations</p>
        </div>

        <div class="patient-section">
            <h2 class="section-title">
                <span class="section-number">01</span>
                Patient Information
            </h2>
            <div class="patient-grid">
                <div class="field-group">
                    <div class="field-label">Full Name</div>
                    <div class="field-value">${formData.patientName}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Age</div>
                    <div class="field-value">${formData.age}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Assessment Date</div>
                    <div class="field-value">${formData.assessmentDate}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Gender</div>
                    <div class="field-value">${formData.gender}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">Referring Physician</div>
                    <div class="field-value">${formData.doctorName}</div>
                </div>
            </div>
        </div>

        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">02</span>
                Clinical Assessment Results
            </h2>
            ${generateAssessmentSections(formData)}
        </div>

        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">03</span>
                Enhancement Recommendations
            </h2>
            <div class="enhancements-section">
                ${generateRecommendations(formData)}
            </div>
        </div>

        <div class="clinical-section">
            <h2 class="section-title">
                <span class="section-number">04</span>
                Professional Assessment Summary
            </h2>
            <div class="notes-section">
                <div class="notes-title">Clinical Summary</div>
                <div class="notes-text">${formData.summary}</div>
            </div>
        </div>

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

function generateRatingDots(score) {
  const totalDots = 10;
  const activeDots = Math.round(score);
  let dots = '';
  
  for (let i = 1; i <= totalDots; i++) {
    dots += `<div class="rating-dot ${i <= activeDots ? 'active' : ''}"></div>`;
  }
  
  return dots;
}

function generateAssessmentSections(formData) {
  const assessments = [
    {
      key: 'facialSymmetry',
      label: 'Facial Symmetry',
    },
    {
      key: 'skinQuality',
      label: 'Skin Quality', 
    },
    {
      key: 'facialProportions',
      label: 'Facial Proportions',
    }
  ];

  return assessments.map(assessment => {
    const data = formData[assessment.key] || {};
    const rating = data.rating || 'Good';
    const score = data.score || 8.0;
    const notes = data.notes || 'Assessment completed.';

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
          <div class="enhancement-title">${rec.title}</div>
          <div class="enhancement-text">${rec.description}</div>
      </div>
    `).join('');
  }

  return `
    <div class="enhancement-box">
        <div class="enhancement-title">Professional Assessment Complete</div>
        <div class="enhancement-text">Comprehensive facial analysis completed with personalized recommendations.</div>
    </div>
  `;
}

module.exports = { generateRiymaReportTemplate };
