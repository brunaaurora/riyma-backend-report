import React from 'react';
import ReactPDF, { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { RiymaReportTemplate } from '../templates/riyma-report-template.js';

// Register custom fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKvAZ9hiA.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 600 }
  ]
});

export async function generateRiymaPDF(data) {
  try {
    const pdfStream = await ReactPDF.renderToStream(
      <RiymaReportTemplate data={data} />
    );
    
    const chunks = [];
    return new Promise((resolve, reject) => {
      pdfStream.on('data', chunk => chunks.push(chunk));
      pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
      pdfStream.on('error', reject);
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
