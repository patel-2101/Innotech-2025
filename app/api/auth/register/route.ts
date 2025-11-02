import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';

// POST /api/auth/register - Register or login user with Firebase UID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, phoneNumber, name, email } = body;
    
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'ID token is required' },
        { status: 400 }
      );
    }
    
    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { firebaseUid }
    });
    
    if (!user && phoneNumber) {
      // Try to find by phone number
      user = await prisma.user.findUnique({
        where: { phoneNumber }
      });
      
      if (user) {
        // Update existing user with Firebase UID
        user = await prisma.user.update({
          where: { id: user.id },
          data: { firebaseUid }
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            firebaseUid,
            phoneNumber,
            name,
            email,
            role: 'CITIZEN', // Default role
          }
        });
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User registration failed' },
        { status: 400 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Your account has been deactivated' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: user.createdAt === user.updatedAt ? 'User registered successfully' : 'Login successful'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Auth error:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
