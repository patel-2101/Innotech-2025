import { NextRequest, NextResponse } from 'next/server';
import { auth as firebaseAdmin } from 'firebase-admin/auth';
import { prisma } from '@/lib/prisma-mock';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firebaseUid, phoneNumber, email, displayName, photoURL, idToken } = body;

    // Verify Firebase ID token (in production)
    // const decodedToken = await firebaseAdmin().verifyIdToken(idToken);
    // if (!decodedToken) {
    //   return NextResponse.json({ success: false, message: 'Invalid Firebase token' }, { status: 401 });
    // }

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid },
          { phoneNumber: phoneNumber || undefined },
          { email: email || undefined }
        ]
      }
    });

    // Create new user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid,
          phoneNumber: phoneNumber || null,
          email: email || null,
          name: displayName || null,
          photoURL: photoURL || null,
          role: 'CITIZEN',
          isActive: true
        }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firebaseUid: firebaseUid || user.firebaseUid,
          phoneNumber: phoneNumber || user.phoneNumber,
          email: email || user.email,
          name: displayName || user.name,
          photoURL: photoURL || user.photoURL
        }
      });
    }

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      role: user.role as 'CITIZEN' | 'OFFICER' | 'WORKER' | 'ADMIN',
      email: user.email || undefined,
      phoneNumber: user.phoneNumber || undefined
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        photoURL: user.photoURL
      }
    });

  } catch (error) {
    console.error('Citizen auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
