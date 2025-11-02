/**
 * Enhanced Complaint Categorizer using TensorFlow.js Model
 * 
 * This version uses the trained ML model instead of keyword matching
 */

/**
 * Load and predict using the trained model
 */
export async function categorizComplaintWithML(description: string): Promise<string> {
  try {
    const response = await fetch('/api/ml/predict-category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error('Prediction failed');
    }

    const data = await response.json();
    
    if (data.success) {
      // Convert to uppercase to match Prisma enum
      return data.data.predictedCategory.toUpperCase();
    }
    
    return 'OTHER';
  } catch (error) {
    console.error('ML prediction error:', error);
    return 'OTHER';
  }
}

/**
 * Get category confidence score
 */
export async function getCategoryWithConfidence(description: string) {
  try {
    const response = await fetch('/api/ml/predict-category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        category: data.data.predictedCategory.toUpperCase(),
        confidence: parseFloat(data.data.confidence),
        allPredictions: data.data.allPredictions,
      };
    }
    
    return {
      category: 'OTHER',
      confidence: 0,
      allPredictions: [],
    };
  } catch (error) {
    console.error('ML prediction error:', error);
    return {
      category: 'OTHER',
      confidence: 0,
      allPredictions: [],
    };
  }
}

// Keep the original keyword-based function as fallback
export { categorizeComplaint } from './complaint-categorizer';
