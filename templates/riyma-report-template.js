// templates/riyma-report-template.js - MINIMAL TEST VERSION
function generateRiymaReportTemplate(formData, cloudinaryImages = []) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Riyma Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .header { border-bottom: 1px solid #ccc; padding-bottom: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>riyma</h1>
    <p>Report ID: TEST-001</p>
  </div>
  
  <h2>Patient Information</h2>
  <p><strong>Name:</strong> ${formData.patientName || 'Test Patient'}</p>
  <p><strong>Age:</strong> ${formData.age || 'N/A'}</p>
  
  <h2>Assessment</h2>
  <p>This is a test report to verify deployment works.</p>
  
  <footer style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px;">
    <p><strong>riyma</strong> - Professional Aesthetic Assessment</p>
  </footer>
</body>
</html>`;
}

module.exports = { generateRiymaReportTemplate };
