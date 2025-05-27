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
    const day = String(today.getDate()).padStar
