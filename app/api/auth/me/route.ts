import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// GET /api/auth/me - Get current authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
  }
}
