import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// GET /api/users - Get all users (Admin/Officer only)
export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(request, ['OFFICER', 'ADMIN']);
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    
    const skip = (page - 1) * limit;
    
    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          phoneNumber: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : errorMessage === 'Forbidden' ? 403 : 500 }
    );
  }
}

// POST /api/users - Create a new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, ['ADMIN']);
    const body = await request.json();
    
    const { phoneNumber, name, email, role, firebaseUid } = body;
    
    if (!phoneNumber || !role) {
      return NextResponse.json(
        { success: false, error: 'Phone number and role are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this phone number already exists' },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        name,
        email,
        role,
        firebaseUid,
      },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : errorMessage === 'Forbidden' ? 403 : 500 }
    );
  }
}
