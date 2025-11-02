import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/auth';

// GET /api/complaints/[id] - Get a specific complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
          }
        },
        assignments: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
              }
            },
            officer: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        workProofs: {
          orderBy: { uploadedAt: 'desc' }
        }
      }
    });
    
    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }
    
    // Check access permissions
    if (user.role === 'CITIZEN' && complaint.citizenId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: complaint
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// PATCH /api/complaints/[id] - Update a complaint
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, ['OFFICER', 'ADMIN']);
    const body = await request.json();
    
    const { status, priority, category, title, description } = body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (category) updateData.category = category;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    
    if (status === 'COMPLETED') {
      updateData.resolvedAt = new Date();
    }
    
    const complaint = await prisma.complaint.update({
      where: { id: params.id },
      data: updateData,
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: complaint,
      message: 'Complaint updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}

// DELETE /api/complaints/[id] - Delete a complaint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['ADMIN']);
    
    await prisma.complaint.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}
