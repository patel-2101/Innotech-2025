import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(request, ['OFFICER', 'ADMIN']);
    
    const [
      totalComplaints,
      pendingComplaints,
      assignedComplaints,
      inProgressComplaints,
      completedComplaints,
      totalCitizens,
      totalWorkers,
      totalOfficers
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'PENDING' } }),
      prisma.complaint.count({ where: { status: 'ASSIGNED' } }),
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { status: 'COMPLETED' } }),
      prisma.user.count({ where: { role: 'CITIZEN' } }),
      prisma.user.count({ where: { role: 'WORKER' } }),
      prisma.user.count({ where: { role: 'OFFICER' } }),
    ]);
    
    // Get complaints by category
    const complaintsByCategory = await prisma.complaint.groupBy({
      by: ['category'],
      _count: true,
    });
    
    // Get recent complaints
    const recentComplaints = await prisma.complaint.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
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
      data: {
        stats: {
          totalComplaints,
          pendingComplaints,
          assignedComplaints,
          inProgressComplaints,
          completedComplaints,
          totalCitizens,
          totalWorkers,
          totalOfficers,
        },
        complaintsByCategory: complaintsByCategory.map((c: any) => ({
          category: c.category,
          count: c._count
        })),
        recentComplaints
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
