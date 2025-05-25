export function validateRiymaData(fields) {
  const errors = [];
  
  // Extract and flatten form data
  const data = {};
  Object.keys(fields).forEach(key => {
    data[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
  });
  
  // Required fields validation
  if (!data.clientName?.trim()) {
    errors.push('Client name is required');
  }
  
  if (!data.analysisDate) {
    errors.push('Analysis date is required');
  }
  
  if (!data.aestheticianName?.trim()) {
    errors.push('Aesthetician name is required');
  }
  
  // Validate ratings (should be 1-5)
  const ratingFields = ['facialSymmetry', 'ruleOfThirds', 'eyesRating', 'noseRating', 'lipsRating', 'jawlineRating'];
  ratingFields.forEach(field => {
    if (data[field] && (data[field] < 1 || data[field] > 5)) {
      errors.push(`${field} must be between 1 and 5`);
    }
  });
  
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join(', ')}`);
  }
  
  return sanitizeData(data);
}

function sanitizeData(data) {
  const sanitized = {};
  
  // Sanitize text fields
  const textFields = [
    'clientName', 'clientAge', 'clientId', 'aestheticianName', 'certification',
    'proportionNotes', 'featureAnalysis', 'skinAnalysis', 'strengths',
    'nonSurgicalOptions', 'surgicalOptions', 'lifestyleRecommendations',
    'skinQuality', 'softTissue', 'aestheticType', 'overallHarmony'
  ];
  
  textFields.forEach(field => {
    if (data[field]) {
      sanitized[field] = String(data[field]).trim().substring(0, 2000); // Limit length
    }
  });
  
  // Handle numeric fields
  const numericFields = ['facialSymmetry', 'ruleOfThirds', 'eyesRating', 'noseRating', 'lipsRating', 'jawlineRating'];
  numericFields.forEach(field => {
    if (data[field]) {
      sanitized[field] = parseInt(data[field], 10);
    }
  });
  
  // Handle date
  if (data.analysisDate) {
    sanitized.analysisDate = new Date(data.analysisDate).toISOString().split('T')[0];
  }
  
  return sanitized;
}
