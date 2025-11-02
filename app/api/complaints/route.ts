import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { categorizeComplaint } from '@/lib/ml/complaint-categorizer';

// GET /api/complaints - Get all complaints with filters
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const citizenId = searchParams.get('citizenId');
    
    const skip = (page - 1) * limit;
    
    // Build where clause based on role
    const where: any = {};
    
    if (user.role === 'CITIZEN') {
      where.citizenId = user.id;
    } else if (user.role === 'WORKER') {
      where.assignments = {
        some: { workerId: user.id }
      };
    }
    
    if (status) where.status = status;
    if (category) where.category = category;
    if (citizenId && (user.role === 'OFFICER' || user.role === 'ADMIN')) {
      where.citizenId = citizenId;
    }
    
    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        include: {
          citizen: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
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
          workProofs: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.complaint.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        complaints,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// POST /api/complaints - Create a new complaint
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    
    const { title, description, location, latitude, longitude, mediaUrls, category } = body;
    
    // Auto-categorize if not provided
    let complaintCategory = category;
    let isAiCategorized = false;
    
    if (!complaintCategory && description) {
      complaintCategory = await categorizeComplaint(description);
      isAiCategorized = true;
    }
    
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category: complaintCategory || 'OTHER',
        location,
        latitude,
        longitude,
        mediaUrls: mediaUrls || [],
        isAiCategorized,
        citizenId: user.id,
      },
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
      message: 'Complaint created successfully'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
