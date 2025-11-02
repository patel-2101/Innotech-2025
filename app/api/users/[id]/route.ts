import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole, requireAuth } from '@/lib/auth';

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireAuth(request);
    
    // Users can view their own profile, officers and admins can view all
    if (currentUser.id !== id && !['OFFICER', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
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
      { status: errorMessage === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH /api/users/[id] - Update a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireAuth(request);
    const body = await request.json();
    
    // Users can update their own profile, admins can update anyone
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const { name, email, role, isActive } = body;
    
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    
    // Only admins can change role and active status
    if (currentUser.role === 'ADMIN') {
      if (role !== undefined) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : errorMessage === 'Forbidden' ? 403 : 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireRole(request, ['ADMIN']);
    
    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: errorMessage === 'Unauthorized' ? 401 : errorMessage === 'Forbidden' ? 403 : 500 }
    );
  }
}
