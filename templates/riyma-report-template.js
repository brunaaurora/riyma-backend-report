import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b'
  },
  logo: {
    fontSize: 32,
    fontWeight: 300,
    color: '#1e293b',
    letterSpacing: 2
  },
  headerInfo: {
    textAlign: 'right'
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    color: '#1e293b',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b'
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  phaseNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#1e293b',
    color: 'white',
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 2.3,
    marginRight: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1e293b'
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 12
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  infoItem: {
    width: '50%',
    marginBottom: 8
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 2
  },
  infoValue: {
    fontSize: 11,
    color: '#1f2937'
  },
  assessmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16
  },
  assessmentCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e2e8f0'
  },
  assessmentTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: 6
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingScore: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1e293b',
    marginRight: 8
  },
  ratingStars: {
    fontSize: 12,
    color: '#fbbf24'
  },
  textBlock: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12
  },
  analysisText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#374151'
  },
  enhancementSection: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20
  },
  enhancementTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0c4a6e',
    marginBottom: 10
  },
  enhancementText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#164e63',
    marginBottom: 12
  },
  strengthsSection: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  imageSection: {
    marginTop: 20
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  imageContainer: {
    width: '48%',
    marginBottom: 12
  },
  analysisImage: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderRadius: 8
  },
  imageCaption: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 40,
    fontSize: 9,
    color: '#9ca3af'
  }
});

const getRatingText = (score) => {
  if (!score) return 'Not Rated';
  const ratings = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];
  return ratings[score - 1] || 'Not Rated';
};

const getStars = (score) => {
  if (!score) return '☆☆☆☆☆';
  return '★'.repeat(score) + '☆'.repeat(5 - score);
};

export const RiymaReportTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>riyma</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Facial Analysis Report</Text>
          <Text style={styles.subtitle}>
            Generated on {new Date(data.generatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.phaseNumber}>i</Text>
          <Text style={styles.sectionTitle}>Client Information</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Client Name:</Text>
            <Text style={styles.infoValue}>{data.clientName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{data.clientAge || 'Not specified'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Analysis Date:</Text>
            <Text style={styles.infoValue}>{data.analysisDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Aesthetician:</Text>
            <Text style={styles.infoValue}>{data.aestheticianName}</Text>
          </View>
        </View>
        {data.certification && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Certification:</Text>
            <Text style={styles.infoValue}>{data.certification}</Text>
          </View>
        )}
      </View>

      {/* Phase 1: Facial Proportion Analysis */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.phaseNumber}>1</Text>
          <Text style={styles.sectionTitle}>Facial Proportion Analysis</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Symmetry and balance evaluation using the "Rule of Thirds" and "Rule of Fifths"
        </Text>
        
        <View style={styles.assessmentGrid}>
          <View style={styles.assessmentCard}>
            <Text style={styles.assessmentTitle}>Overall Facial Symmetry</Text>
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingScore}>{data.facialSymmetry || 'N/A'}</Text>
              <Text style={styles.ratingStars}>{getStars(data.facialSymmetry)}</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#64748b' }}>
              {getRatingText(data.facialSymmetry)}
            </Text>
          </View>
          
          <View style={styles.assessmentCard}>
            <Text style={styles.assessmentTitle}>Rule of Thirds Compliance</Text>
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingScore}>{data.ruleOfThirds || 'N/A'}</Text>
              <Text style={styles.ratingStars}>{getStars(data.ruleOfThirds)}</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#64748b' }}>
              {getRatingText(data.ruleOfThirds)}
            </Text>
          </View>
        </View>

        {data.proportionNotes && (
          <View style={styles.textBlock}>
            <Text style={styles.analysisText}>{data.proportionNotes}</Text>
          </View>
        )}
      </View>

      {/* Page break for next section */}
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Phase 2: Individual Features */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.phaseNumber}>2</Text>
          <Text style={styles.sectionTitle}>Individual Facial Feature Evaluation</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Detailed assessment of each facial feature against aesthetic ideals
        </Text>

        <View style={styles.assessmentGrid}>
          <View style={styles.assessmentCard}>
            <Text style={styles.assessmentTitle}>Eyes & Eyebrows</Text>
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingScore}>{data.eyesRating || 'N/A'}</Text>
              <Text style={styles.ratingStars}>{getStars(data.eyesRating)}</Text>
            </View>
          </View>
          
          <View style={styles.assessmentCard}>
            <Text style={styles.assessmentTitle}>Nose Structure</Text>
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingScore}>{data.noseRating || 'N/A'}</Text>
              <Text style={styles.ratingStars}>{getStars(data.noseRating)}</Text>
            </View>
          </View>
          
          <View style={styles.assessmentCard}>
            <Text style={styles.assessmentTitle}>Lip Aesthetics</Text>
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingScore}>{data.lipsRating || 'N/A'}</Text>
              <Text style={styles.ratingStars}>{getStars(data.lipsRating)}</Text>
            </View>
          </View>
          
          <View style={styles.assessmentCard}>
            <Text style={styles.assessmentTitle}>Jawline & Chin</Text>
            <View style={styles.ratingDisplay}>
              <Text style={styles.ratingScore}>{data.jawlineRating || 'N/A'}</Text>
              <Text style={styles.ratingStars}>{getStars(data.jawlineRating)}</Text>
            </View>
          </View>
        </View>

        {data.featureAnalysis && (
          <View style={styles.textBlock}>
            <Text style={styles.analysisText}>{data.featureAnalysis}</Text>
          </View>
        )}
      </View>

      {/* Phase 3: Skin Analysis */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.phaseNumber}>3</Text>
          <Text style={styles.sectionTitle}>Skin and Soft Tissue Evaluation</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Skin Quality:</Text>
            <Text style={styles.infoValue}>{data.skinQuality || 'Not assessed'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Soft Tissue Distribution:</Text>
            <Text style={styles.infoValue}>{data.softTissue || 'Not assessed'}</Text>
          </View>
        </View>

        {data.skinAnalysis && (
          <View style={styles.textBlock}>
            <Text style={styles.analysisText}>{data.skinAnalysis}</Text>
          </View>
        )}
      </View>

      {/* Phase 4: Overall Harmony */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.phaseNumber}>4</Text>
          <Text style={styles.sectionTitle}>Overall Harmony & Aesthetic Typing</Text>
        </View>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Aesthetic Type:</Text>
            <Text style={styles.infoValue}>{data.aestheticType || 'Not classified'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Harmony Score:</Text>
            <Text style={styles.infoValue}>
              {data.overallHarmony ? `${data.overallHarmony}/5` : 'Not scored'}
            </Text>
          </View>
        </View>
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Enhancement Suggestions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.phaseNumber}>💡</Text>
          <Text style={styles.sectionTitle}>Enhancement Recommendations</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Personalized suggestions to celebrate your strengths and explore enhancement options
        </Text>

        {data.strengths && (
          <View style={styles.strengthsSection}>
            <Text style={styles.enhancementTitle}>✨ Your Key Strengths & Best Features</Text>
            <Text style={styles.enhancementText}>{data.strengths}</Text>
          </View>
        )}

        {data.nonSurgicalOptions && (
          <View style={styles.enhancementSection}>
            <Text style={styles.enhancementTitle}>💄 Non-Surgical Enhancement Options</Text>
            <Text style={styles.enhancementText}>{data.nonSurgicalOptions}</Text>
          </View>
        )}

        {data.surgicalOptions && (
          <View style={styles.enhancementSection}>
            <Text style={styles.enhancementTitle}>🔬 Surgical Enhancement Considerations</Text>
            <Text style={styles.enhancementText}>{data.surgicalOptions}</Text>
          </View>
        )}

        {data.lifestyleRecommendations && (
          <View style={styles.enhancementSection}>
            <Text style={styles.enhancementTitle}>🌿 Lifestyle & Wellness Recommendations</Text>
            <Text style={styles.enhancementText}>{data.lifestyleRecommendations}</Text>
          </View>
        )}
      </View>

      {/* Images Section */}
      {data.images && data.images.length > 0 && (
        <View style={styles.imageSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.phaseNumber}>📸</Text>
            <Text style={styles.sectionTitle}>Analysis Reference Photos</Text>
          </View>
          <View style={styles.imageGrid}>
            {data.images.slice(0, 4).map((imageUrl, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image style={styles.analysisImage} src={imageUrl} />
                <Text style={styles.imageCaption}>
                  Reference Photo {index + 1}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>
        This analysis was conducted by qualified aesthetic professionals at Riyma.{'\n'}
        Report generated on {new Date(data.generatedAt).toLocaleDateString()} - Confidential Document{'\n'}
        © 2025 Riyma - Personalized Facial Analysis Reports
      </Text>
    </Page>
  </Document>
);
