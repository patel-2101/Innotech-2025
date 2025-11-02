// Mock Prisma client for development without database
// Password hashes are for: officer123, worker123, admin123 (bcrypt hashed)
export const mockUsers = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    phoneNumber: '+1234567890', 
    role: 'CITIZEN', 
    isActive: true, 
    firebaseUid: 'firebase1',
    employeeId: null,
    password: null,
    photoURL: null
  },
  { 
    id: '2', 
    name: 'Jane Worker', 
    email: 'jane@example.com', 
    phoneNumber: null,
    role: 'WORKER', 
    isActive: true, 
    firebaseUid: null,
    employeeId: 'WRK12345',
    password: '$2a$10$rN8yQH3H0SjKqXHJ8Z7YXu4FxGm5gQK4bCZJ5J5J5J5J5J5J5J5J5O',
    photoURL: null
  },
  { 
    id: '3', 
    name: 'Bob Officer', 
    email: 'bob@example.com', 
    phoneNumber: null,
    role: 'OFFICER', 
    isActive: true, 
    firebaseUid: null,
    employeeId: 'OFF12345',
    password: '$2a$10$rN8yQH3H0SjKqXHJ8Z7YXu4FxGm5gQK4bCZJ5J5J5J5J5J5J5J5J5O',
    photoURL: null
  },
  { 
    id: '4', 
    name: 'Alice Admin', 
    email: 'alice@example.com', 
    phoneNumber: null,
    role: 'ADMIN', 
    isActive: true, 
    firebaseUid: null,
    employeeId: 'ADM12345',
    password: '$2a$10$rN8yQH3H0SjKqXHJ8Z7YXu4FxGm5gQK4bCZJ5J5J5J5J5J5J5J5J5O',
    photoURL: null
  },
];

export const mockComplaints = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues',
    category: 'ROAD',
    status: 'PENDING',
    priority: 'HIGH',
    citizenId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    citizen: mockUsers[0],
  },
  {
    id: '2',
    title: 'Water leak in park',
    description: 'Water pipe burst in central park',
    category: 'WATER',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    citizenId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    citizen: mockUsers[0],
  },
];

class MockPrismaClient {
  user = {
    findUnique: async (params: any) => {
      return mockUsers.find(u => u.id === params.where.id || u.phoneNumber === params.where.phoneNumber);
    },
    findFirst: async (params: any) => {
      if (params.where.OR) {
        return mockUsers.find(u => 
          params.where.OR.some((condition: any) => {
            if (condition.firebaseUid) return u.firebaseUid === condition.firebaseUid;
            if (condition.phoneNumber) return u.phoneNumber === condition.phoneNumber;
            if (condition.email) return u.email === condition.email;
            if (condition.employeeId) return u.employeeId === condition.employeeId;
            return false;
          })
        );
      }
      if (params.where.employeeId && params.where.role) {
        return mockUsers.find(u => u.employeeId === params.where.employeeId && u.role === params.where.role && u.isActive === params.where.isActive);
      }
      return mockUsers.find(u => 
        (!params.where.id || u.id === params.where.id) &&
        (!params.where.phoneNumber || u.phoneNumber === params.where.phoneNumber) &&
        (!params.where.email || u.email === params.where.email) &&
        (!params.where.firebaseUid || u.firebaseUid === params.where.firebaseUid)
      );
    },
    findMany: async () => mockUsers,
    create: async (params: any) => {
      const newUser = { 
        id: Date.now().toString(), 
        employeeId: null,
        password: null,
        photoURL: null,
        ...params.data 
      };
      mockUsers.push(newUser);
      return newUser;
    },
    update: async (params: any) => {
      const index = mockUsers.findIndex(u => u.id === params.where.id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...params.data };
        return mockUsers[index];
      }
      throw new Error('User not found');
    },
    count: async () => mockUsers.length,
  };

  complaint = {
    findMany: async (params?: any) => {
      let complaints = [...mockComplaints];
      if (params?.where?.citizenId) {
        complaints = complaints.filter(c => c.citizenId === params.where.citizenId);
      }
      if (params?.include?.citizen) {
        complaints = complaints.map(c => ({
          ...c,
          citizen: mockUsers.find(u => u.id === c.citizenId),
        }));
      }
      return complaints;
    },
    create: async (params: any) => {
      const newComplaint = {
        id: Date.now().toString(),
        ...params.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockComplaints.push(newComplaint);
      return newComplaint;
    },
    count: async () => mockComplaints.length,
    groupBy: async (params: any) => {
      const grouped: any = {};
      mockComplaints.forEach(c => {
        const key = params.by[0];
        const value = (c as any)[key];
        grouped[value] = (grouped[value] || 0) + 1;
      });
      return Object.entries(grouped).map(([key, count]) => ({
        [params.by[0]]: key,
        _count: { _all: count }
      }));
    },
  };

  assignment = {
    findMany: async () => [],
    create: async (params: any) => ({ id: Date.now().toString(), ...params.data }),
    count: async () => 0,
  };

  workProof = {
    findMany: async () => [],
    create: async (params: any) => ({ id: Date.now().toString(), ...params.data }),
    count: async () => 0,
  };
}

export const prisma = new MockPrismaClient();