# 🌱 Database Seeding Guide

## Overview

This guide explains how to populate your Smart Complaint System database with realistic sample data.

---

## 📦 What's Included

### **1. Seed Script** (`prisma/seed.ts`)
- ✅ Creates 20 realistic complaints
- ✅ Creates sample users (Admin, Officer, Workers, Citizens)
- ✅ Assigns workers to complaints
- ✅ Adds work proof for resolved complaints

### **2. JSON Data** (`prisma/sample-complaints.json`)
- ✅ Raw JSON format for easy import
- ✅ 20 complaints with all fields
- ✅ Can be used for testing or manual import

---

## 🚀 Quick Start

### **Option 1: Use Prisma Seed (Recommended)**

```bash
# 1. Generate Prisma Client (if not done already)
npm run prisma:generate

# 2. Run migrations to create tables
npm run prisma:migrate

# 3. Seed the database
npm run prisma:seed
```

### **Option 2: Manual Import**

Use the JSON file `prisma/sample-complaints.json` to manually import data via your API or database client.

---

## 📊 Sample Data Breakdown

### **Users Created:**
- **1 Admin** - System Admin
- **1 Officer** - Rajesh Sharma
- **3 Workers** - Ravi Kumar, Suresh Reddy, Mohan Singh
- **8 Citizens** - Priya Sharma, Amit Patel, Sneha Gupta, and 5 others

### **20 Complaints:**

#### **By Category:**
- 🛣️ **Road:** 5 complaints (potholes, resurfacing, manholes, flooding)
- 💧 **Water:** 5 complaints (no supply, leakage, low pressure, contamination)
- ⚡ **Electricity:** 5 complaints (street lights, power outage, transformer issues)
- 🗑️ **Garbage:** 5 complaints (collection delays, illegal dumping, overflowing bins)

#### **By Status:**
- **Pending:** 8 complaints (40%)
- **Assigned:** 5 complaints (25%)
- **In Progress:** 4 complaints (20%)
- **Resolved:** 3 complaints (15%)

#### **By Priority:**
- **Urgent:** 7 complaints (35%)
- **High:** 9 complaints (45%)
- **Medium:** 3 complaints (15%)
- **Low:** 1 complaint (5%)

---

## 📝 Sample Complaint Examples

### **Road Category**
```json
{
  "title": "Large pothole on main road",
  "description": "There is a massive pothole near Indiranagar Metro Station that has been growing larger. Multiple vehicles have been damaged, and it poses a serious accident risk.",
  "category": "ROAD",
  "status": "PENDING",
  "priority": "URGENT",
  "location": "Indiranagar Metro Station, 100 Feet Road",
  "citizenName": "Amit Patel"
}
```

### **Water Category**
```json
{
  "title": "No water supply since morning",
  "description": "Our entire street in JP Nagar has not received water supply since 6 AM today. This is affecting around 50 households.",
  "category": "WATER",
  "status": "ASSIGNED",
  "priority": "URGENT",
  "location": "JP Nagar 7th Phase, 5th Cross",
  "citizenName": "Sneha Gupta"
}
```

### **Electricity Category**
```json
{
  "title": "Street light not working near bus stop",
  "description": "The street light at MG Road bus stop has been non-functional for the past 3 days. This is causing safety issues for commuters during evening hours.",
  "category": "ELECTRICITY",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "location": "MG Road Bus Stop, Bangalore",
  "citizenName": "Priya Sharma"
}
```

### **Garbage Category**
```json
{
  "title": "Garbage not collected for 4 days",
  "description": "The municipal garbage collection has not happened in our area for the past 4 days. Garbage is piling up and creating a health hazard.",
  "category": "GARBAGE",
  "status": "PENDING",
  "priority": "HIGH",
  "location": "Koramangala 4th Block, 8th Main Road",
  "citizenName": "Vikram Singh"
}
```

---

## 🔄 Reset and Reseed Database

### **Warning:** This will delete all existing data!

```bash
# 1. Reset database (removes all data)
npx prisma migrate reset

# 2. This will automatically:
#    - Drop the database
#    - Create a new database
#    - Run all migrations
#    - Run the seed script
```

---

## 🛠️ Customize Seed Data

### **Edit the seed script** (`prisma/seed.ts`)

```typescript
// Add more complaints
const complaints = [
  {
    title: 'Your custom complaint',
    description: 'Your description',
    category: ComplaintCategory.WATER,
    status: ComplaintStatus.PENDING,
    priority: ComplaintPriority.HIGH,
    location: 'Your location',
    createdAt: new Date(),
    citizenId: citizens[0].id,
  },
  // Add more...
];
```

### **Then reseed:**
```bash
npm run prisma:seed
```

---

## 📍 All Complaint Locations

The sample data includes complaints from various Bangalore locations:

1. MG Road Bus Stop
2. Indiranagar Metro Station, 100 Feet Road
3. JP Nagar 7th Phase, 5th Cross
4. Koramangala 4th Block, 8th Main Road
5. HSR Layout Sector 2, 27th Main Road
6. Whitefield Main Road, Near ITPL
7. Jayanagar 4th Block, East End
8. Electronic City Phase 1, Behind Tech Park
9. Bannerghatta Road to Arekere Gate
10. Malleshwaram Market, 8th Cross
11. Yeshwanthpur, 3rd Main Road
12. Cubbon Park, Main Entrance
13. Silk Board Junction, Underpass
14. BTM Layout 2nd Stage, Near Water Tank
15. Basaveshwaranagar, 2nd Stage
16. Yelahanka New Town, Sector 1
17. Rajajinagar, Near Government School
18. Sadashivanagar, 10th Cross
19. Vijayanagar, House No. 245
20. Bellandur Lake, Near ORR

---

## 🎯 Using Seeded Data

### **1. Test Your Dashboards**

After seeding, you can:
- Login as citizens to view their complaints
- Login as workers to see assigned tasks
- Login as officer to manage complaints
- Login as admin to view analytics

### **2. Test API Endpoints**

```bash
# Get all complaints
curl http://localhost:3000/api/complaints

# Get complaints by category
curl http://localhost:3000/api/complaints?category=WATER

# Get complaints by status
curl http://localhost:3000/api/complaints?status=PENDING

# Get dashboard stats
curl http://localhost:3000/api/dashboard/stats
```

### **3. View in Prisma Studio**

```bash
npm run prisma:studio
```

This opens a visual database browser at `http://localhost:5555`

---

## 📊 Expected Database State After Seeding

```
Users Table:
├── 1 Admin
├── 1 Officer
├── 3 Workers
└── 8 Citizens
Total: 13 users

Complaints Table:
├── 8 Pending
├── 5 Assigned
├── 4 In Progress
└── 3 Resolved
Total: 20 complaints

Assignments Table:
└── 12 assignments (for Assigned + In Progress + Resolved)

WorkProof Table:
└── 3 work proofs (for Resolved complaints)
```

---

## 🔍 Verify Seed Success

### **Check complaint count:**
```bash
npx prisma studio
# Navigate to Complaint table
# Should show 20 records
```

### **Check users:**
```bash
# Should show 13 users:
# - 1 Admin
# - 1 Officer
# - 3 Workers
# - 8 Citizens
```

### **Check assignments:**
```bash
# Should show assignments for:
# - Assigned complaints
# - In Progress complaints
# - Resolved complaints
```

---

## 🚨 Troubleshooting

### **Error: Prisma Client not generated**
```bash
npm run prisma:generate
```

### **Error: Database doesn't exist**
```bash
npm run prisma:migrate
```

### **Error: Foreign key constraint failed**
```bash
# Reset and reseed
npx prisma migrate reset
```

### **Error: Unique constraint failed**
```bash
# Users already exist, reset database
npx prisma migrate reset
```

---

## 🎨 JSON Data Format

The `sample-complaints.json` file contains clean JSON data:

```json
{
  "title": "string",
  "description": "string",
  "category": "ROAD | WATER | ELECTRICITY | GARBAGE",
  "status": "PENDING | ASSIGNED | IN_PROGRESS | RESOLVED",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "location": "string",
  "citizenName": "string",
  "createdAt": "ISO 8601 date string"
}
```

---

## 📚 Next Steps

1. **Run the seed:**
   ```bash
   npm run prisma:seed
   ```

2. **View the data:**
   ```bash
   npm run prisma:studio
   ```

3. **Test your dashboards:**
   ```bash
   npm run dev
   ```

4. **Use the API:**
   Test endpoints with seeded data

---

## 💡 Tips

- Run `npm run prisma:seed` anytime to add fresh data
- Use `npx prisma migrate reset` to completely reset and reseed
- Edit `prisma/seed.ts` to customize the sample data
- The JSON file can be used for frontend mock data during development

---

**🎉 Your database is now populated with realistic sample complaints!**

Use this data to:
- Test all dashboard features
- Demo the system to stakeholders
- Develop and test new features
- Train ML models with real-world examples
