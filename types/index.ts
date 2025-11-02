// Local type definitions for development
export type UserRole = 'CITIZEN' | 'WORKER' | 'OFFICER' | 'ADMIN';
export type ComplaintCategory = 'ROAD' | 'WATER' | 'GARBAGE' | 'ELECTRICITY' | 'DRAINAGE' | 'STREET_LIGHT' | 'OTHER';
export type ComplaintStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CreateComplaintDto {
  title: string;
  description: string;
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  mediaFiles?: File[];
}

export interface UpdateComplaintDto {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  priority?: string;
  location?: string;
}

export interface CreateUserDto {
  phoneNumber: string;
  name?: string;
  email?: string;
  role: string;
  firebaseUid?: string;
}

export interface AssignWorkerDto {
  complaintId: string;
  workerId: string;
  deadline?: string;
  notes?: string;
}

export interface UploadWorkProofDto {
  complaintId: string;
  beforePhotos?: File[];
  afterPhotos?: File[];
  description?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ComplaintFilters extends PaginationParams {
  status?: string;
  category?: string;
  citizenId?: string;
  workerId?: string;
  priority?: string;
}
