import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-mock';
import { signToken } from '@/lib/jwt';
import { comparePassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, password } = body;

    if (!employeeId || !password) {
      return NextResponse.json(
        { success: false, message: 'Admin ID and password are required' },
        { status: 400 }
      );
    }

    // Find admin by employee ID
    const user = await prisma.user.findFirst({
      where: {
        employeeId,
        role: 'ADMIN',
        isActive: true
      }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      role: 'ADMIN',
      employeeId: user.employeeId || undefined,
      email: user.email || undefined
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
