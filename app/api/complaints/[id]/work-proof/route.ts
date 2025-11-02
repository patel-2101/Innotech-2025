import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// POST /api/complaints/[id]/work-proof - Upload work proof
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, ['WORKER', 'OFFICER', 'ADMIN']);
    const body = await request.json();
    
    const { beforePhotos, afterPhotos, description } = body;
    
    // Verify complaint exists and user is assigned (for workers)
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          where: { workerId: user.id }
        }
      }
    });
    
    if (!complaint) {
      return NextResponse.json(
        { success: false, error: 'Complaint not found' },
        { status: 404 }
      );
    }
    
    if (user.role === 'WORKER' && complaint.assignments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You are not assigned to this complaint' },
        { status: 403 }
      );
    }
    
    const workProof = await prisma.workProof.create({
      data: {
        complaintId: params.id,
        beforePhotos: beforePhotos || [],
        afterPhotos: afterPhotos || [],
        description,
      }
    });
    
    // Update complaint status if after photos are uploaded
    if (afterPhotos && afterPhotos.length > 0) {
      await prisma.complaint.update({
        where: { id: params.id },
        data: { status: 'IN_PROGRESS' }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: workProof,
      message: 'Work proof uploaded successfully'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}

// GET /api/complaints/[id]/work-proof - Get all work proofs for a complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['WORKER', 'OFFICER', 'ADMIN', 'CITIZEN']);
    
    const workProofs = await prisma.workProof.findMany({
      where: { complaintId: params.id },
      orderBy: { uploadedAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: workProofs
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    );
  }
}
