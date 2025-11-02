import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// POST /api/complaints/[id]/assign - Assign worker to complaint
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, ['OFFICER', 'ADMIN']);
    const body = await request.json();
    
    const { workerId, deadline, notes } = body;
    
    if (!workerId) {
      return NextResponse.json(
        { success: false, error: 'Worker ID is required' },
        { status: 400 }
      );
    }
    
    // Verify worker exists and has WORKER role
    const worker = await prisma.user.findUnique({
      where: { id: workerId }
    });
    
    if (!worker || worker.role !== 'WORKER') {
      return NextResponse.json(
        { success: false, error: 'Invalid worker' },
        { status: 400 }
      );
    }
    
    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        complaintId: params.id,
        workerId,
        officerId: user.id,
        deadline: deadline ? new Date(deadline) : undefined,
        notes,
      },
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
    });
    
    // Update complaint status
    await prisma.complaint.update({
      where: { id: params.id },
      data: { status: 'ASSIGNED' }
    });
    
    return NextResponse.json({
      success: true,
      data: assignment,
      message: 'Worker assigned successfully'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}
