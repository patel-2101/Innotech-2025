# API Usage Examples

This document provides examples of how to interact with the Smart Complaint Management System API.

## Authentication

All API requests (except `/api/auth/register`) require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## API Endpoints

### 1. Authentication

#### Register/Login with Firebase OTP
```http
POST /api/auth/register
Content-Type: application/json

{
  "idToken": "firebase-id-token-here",
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CITIZEN"
  },
  "message": "User registered successfully"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <firebase-id-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CITIZEN",
    "firebaseUid": "firebase-uid"
  }
}
```

---

### 2. Complaints

#### Create a New Complaint (Citizen)
```http
POST /api/complaints
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole near the intersection causing traffic issues",
  "location": "123 Main St, City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "mediaUrls": ["url1", "url2"],
  "category": "ROAD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "complaint-id",
    "title": "Pothole on Main Street",
    "description": "Large pothole near the intersection causing traffic issues",
    "category": "ROAD",
    "status": "PENDING",
    "priority": "MEDIUM",
    "isAiCategorized": false,
    "createdAt": "2025-11-02T10:30:00.000Z",
    "citizen": {
      "id": "user-id",
      "name": "John Doe",
      "phoneNumber": "+1234567890"
    }
  },
  "message": "Complaint created successfully"
}
```

#### Get All Complaints (with filters)
```http
GET /api/complaints?page=1&limit=10&status=PENDING&category=ROAD
Authorization: Bearer <firebase-id-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complaints": [
      {
        "id": "complaint-id",
        "title": "Pothole on Main Street",
        "description": "...",
        "category": "ROAD",
        "status": "PENDING",
        "priority": "MEDIUM",
        "createdAt": "2025-11-02T10:30:00.000Z",
        "citizen": {
          "id": "user-id",
          "name": "John Doe",
          "phoneNumber": "+1234567890"
        },
        "assignments": [],
        "workProofs": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### Get Specific Complaint
```http
GET /api/complaints/complaint-id
Authorization: Bearer <firebase-id-token>
```

#### Update Complaint (Officer/Admin)
```http
PATCH /api/complaints/complaint-id
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

#### Delete Complaint (Admin only)
```http
DELETE /api/complaints/complaint-id
Authorization: Bearer <firebase-id-token>
```

---

### 3. Worker Assignment

#### Assign Worker to Complaint (Officer/Admin)
```http
POST /api/complaints/complaint-id/assign
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "workerId": "worker-user-id",
  "deadline": "2025-11-10T23:59:59.000Z",
  "notes": "Please prioritize this task"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "assignment-id",
    "complaintId": "complaint-id",
    "workerId": "worker-user-id",
    "officerId": "officer-user-id",
    "assignedAt": "2025-11-02T10:30:00.000Z",
    "deadline": "2025-11-10T23:59:59.000Z",
    "notes": "Please prioritize this task",
    "worker": {
      "id": "worker-user-id",
      "name": "Worker Name",
      "phoneNumber": "+1234567891"
    },
    "officer": {
      "id": "officer-user-id",
      "name": "Officer Name"
    }
  },
  "message": "Worker assigned successfully"
}
```

---

### 4. Work Proof

#### Upload Work Proof (Worker)
```http
POST /api/complaints/complaint-id/work-proof
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "beforePhotos": ["url1", "url2"],
  "afterPhotos": ["url3", "url4"],
  "description": "Fixed the pothole with asphalt"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "work-proof-id",
    "complaintId": "complaint-id",
    "beforePhotos": ["url1", "url2"],
    "afterPhotos": ["url3", "url4"],
    "description": "Fixed the pothole with asphalt",
    "uploadedAt": "2025-11-02T14:30:00.000Z"
  },
  "message": "Work proof uploaded successfully"
}
```

#### Get Work Proofs for Complaint
```http
GET /api/complaints/complaint-id/work-proof
Authorization: Bearer <firebase-id-token>
```

---

### 5. User Management

#### Get All Users (Officer/Admin)
```http
GET /api/users?page=1&limit=20&role=WORKER
Authorization: Bearer <firebase-id-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-id",
        "phoneNumber": "+1234567890",
        "name": "Worker Name",
        "email": "worker@example.com",
        "role": "WORKER",
        "isActive": true,
        "createdAt": "2025-11-01T10:00:00.000Z",
        "updatedAt": "2025-11-01T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

#### Create User (Admin only)
```http
POST /api/users
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "phoneNumber": "+1234567892",
  "name": "New Worker",
  "email": "newworker@example.com",
  "role": "WORKER"
}
```

#### Get User Details
```http
GET /api/users/user-id
Authorization: Bearer <firebase-id-token>
```

#### Update User
```http
PATCH /api/users/user-id
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "isActive": true
}
```

#### Delete User (Admin only)
```http
DELETE /api/users/user-id
Authorization: Bearer <firebase-id-token>
```

---

### 6. Dashboard Statistics

#### Get Dashboard Stats (Officer/Admin)
```http
GET /api/dashboard/stats
Authorization: Bearer <firebase-id-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalComplaints": 150,
      "pendingComplaints": 25,
      "assignedComplaints": 30,
      "inProgressComplaints": 45,
      "completedComplaints": 50,
      "totalCitizens": 500,
      "totalWorkers": 20,
      "totalOfficers": 5
    },
    "complaintsByCategory": [
      { "category": "ROAD", "count": 60 },
      { "category": "WATER", "count": 30 },
      { "category": "GARBAGE", "count": 25 },
      { "category": "ELECTRICITY", "count": 20 },
      { "category": "DRAINAGE", "count": 10 },
      { "category": "STREET_LIGHT", "count": 5 }
    ],
    "recentComplaints": [
      {
        "id": "complaint-id",
        "title": "Pothole on Main Street",
        "category": "ROAD",
        "status": "PENDING",
        "createdAt": "2025-11-02T10:30:00.000Z",
        "citizen": {
          "name": "John Doe",
          "phoneNumber": "+1234567890"
        }
      }
    ]
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Internal server error

---

## Frontend Integration Examples

### Using Fetch API

```javascript
// Get Firebase ID token
const idToken = await firebaseUser.getIdToken();

// Make API request
const response = await fetch('/api/complaints', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  },
  body: JSON.stringify({
    title: 'New Complaint',
    description: 'Description here'
  })
});

const data = await response.json();

if (data.success) {
  console.log('Complaint created:', data.data);
} else {
  console.error('Error:', data.error);
}
```

### Using React Hook

```javascript
import { useAuth } from '@/components/providers/AuthProvider';

function MyComponent() {
  const { firebaseUser } = useAuth();

  const createComplaint = async (complaintData) => {
    const idToken = await firebaseUser.getIdToken();
    
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(complaintData)
    });

    return await response.json();
  };

  return (
    // Component JSX
  );
}
```

---

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Filters
- `status` - Filter by complaint status (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, REJECTED)
- `category` - Filter by category (ROAD, WATER, GARBAGE, etc.)
- `citizenId` - Filter by citizen ID
- `workerId` - Filter by worker ID
- `priority` - Filter by priority (LOW, MEDIUM, HIGH, URGENT)
- `role` - Filter users by role (CITIZEN, WORKER, OFFICER, ADMIN)

### Example
```
GET /api/complaints?page=2&limit=20&status=PENDING&category=ROAD&priority=HIGH
```

---

## Rate Limiting

Currently, there are no rate limits implemented. For production, consider adding:
- Rate limiting middleware
- Request throttling
- API usage quotas per role

---

## Best Practices

1. **Always include Authorization header** for protected routes
2. **Handle errors gracefully** on the frontend
3. **Validate input** before sending to API
4. **Use pagination** for large datasets
5. **Cache responses** where appropriate
6. **Refresh tokens** when expired
7. **Log errors** for debugging

---

## Testing with cURL

```bash
# Login (get token from Firebase first)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_FIREBASE_TOKEN","phoneNumber":"+1234567890"}'

# Create complaint
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{"title":"Test Complaint","description":"Test description"}'

# Get complaints
curl -X GET http://localhost:3000/api/complaints \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Prisma Client API](https://www.prisma.io/docs/concepts/components/prisma-client)
