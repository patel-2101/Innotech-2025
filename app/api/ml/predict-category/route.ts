import { NextRequest, NextResponse } from 'next/server';
import { categorizeComplaint } from '@/lib/ml/complaint-categorizer';

/**
 * API Route: POST /api/ml/predict-category
 * 
 * Predicts the category of a complaint based on its description
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Description is required and must be a string',
        },
        { status: 400 }
      );
    }

    if (description.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Description is too short (minimum 5 characters)',
        },
        { status: 400 }
      );
    }

    // Predict category using mock function
    const predictedCategory = await categorizeComplaint(description);

    return NextResponse.json({
      success: true,
      data: {
        predictedCategory,
        confidence: '85.2%', // Mock confidence
        allPredictions: [
          { category: predictedCategory, probability: 0.852, confidence: '85.2%' },
        ],
      },
    });
  } catch (error: any) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to predict category',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/ml/predict-category
 * 
 * Get model information and available categories
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      categories: ['ROAD', 'WATER', 'GARBAGE', 'ELECTRICITY', 'DRAINAGE', 'STREET_LIGHT', 'OTHER'],
      modelInfo: {
        maxLen: 50,
        vocabularySize: 1000,
        embeddingDim: 100,
        trainedAt: new Date().toISOString(),
      },
    },
  });
}
