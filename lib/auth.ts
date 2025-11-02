// Mock auth implementation for development
import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { UserRole } from '@/types';

export interface AuthUser {
  id: string;
  phoneNumber: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  firebaseUid: string | null;
}

/**
 * Mock auth verification for development
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  // Mock authentication - return first user for development
  const user = await prisma.user.findUnique({
    where: { id: '1' },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return {
    id: user.id,
    phoneNumber: user.phoneNumber,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    firebaseUid: user.firebaseUid,
  };
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthUser | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Middleware to require specific roles
 */
export async function requireRole(request: NextRequest, roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth(request);
  if (!hasRole(user, roles)) {
    throw new Error('Forbidden');
  }
  return user;
}
