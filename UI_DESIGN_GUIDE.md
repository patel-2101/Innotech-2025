# 🎨 Smart Complaint System - UI/UX Design Guide

## Overview

This document describes the complete UI/UX design system for the Smart Complaint Management System built with **Next.js App Router**, **Tailwind CSS**, and **Shadcn-inspired components**.

---

## 🎯 Design Principles

### 1. **Role-Based Design**
- Each dashboard is tailored to specific user needs
- Clear visual hierarchy for role-specific actions
- Contextual information based on user type

### 2. **Responsive First**
- Mobile-first approach
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Collapsible sidebar for mobile
- Touch-friendly buttons and interactions

### 3. **Accessibility**
- WCAG 2.1 AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on interactive elements

### 4. **Performance**
- Client-side rendering for interactivity
- Optimized bundle size
- Lazy loading for charts and heavy components

---

## 🎨 Design System

### Color Palette

```tsx
// Primary Colors
Blue: #3b82f6    (Primary actions, links)
Green: #10b981   (Success, resolved)
Yellow: #eab308  (Pending, warnings)
Orange: #f59e0b  (In progress)
Red: #ef4444     (Errors, rejected)
Purple: #a855f7  (Assignments)

// Neutral Colors
Gray-50: #f9fafb   (Background)
Gray-100: #f3f4f6  (Cards)
Gray-200: #e5e7eb  (Borders)
Gray-500: #6b7280  (Secondary text)
Gray-900: #111827  (Primary text)
```

### Typography

```tsx
// Font Family
System Font Stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

// Headings
H1: text-3xl font-bold (30px)
H2: text-xl font-semibold (20px)
H3: text-lg font-semibold (18px)

// Body
Body: text-sm (14px)
Small: text-xs (12px)
```

### Spacing System

```tsx
// Tailwind spacing scale
px-4: 16px padding horizontal
py-2: 8px padding vertical
gap-4: 16px gap between flex/grid items
space-y-6: 24px vertical spacing
```

### Component Variants

```tsx
// Buttons
Primary: bg-blue-600 hover:bg-blue-700
Secondary: bg-gray-100 hover:bg-gray-200
Destructive: bg-red-600 hover:bg-red-700
Outline: border border-gray-300 hover:bg-gray-50
Ghost: hover:bg-gray-100
Success: bg-green-600 hover:bg-green-700

// Sizes
sm: h-8 px-3 text-xs
default: h-10 px-4 text-sm
lg: h-12 px-8 text-base
```

---

## 📱 Dashboard Pages

### 1. **Citizen Dashboard** (`/citizen`)

**Purpose:** File and track complaints

**Key Features:**
- ✅ File new complaint with photo/video upload
- ✅ View complaint status in real-time
- ✅ Search and filter complaints
- ✅ Statistics overview (Total, Pending, Resolved, Rejected)
- ✅ Detailed complaint cards with status badges

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "My Dashboard"              │
│ [+ File New Complaint Button]       │
├─────────────────────────────────────┤
│ Stats Grid (4 cards)                │
│ [Total] [Pending] [Resolved] [Rej.] │
├─────────────────────────────────────┤
│ Filters: [Search] [Category] [Stat.]│
├─────────────────────────────────────┤
│ Complaint Card 1                    │
│ 💧 Title, Description               │
│ Badges, Location, Date              │
│ [View Details]                      │
├─────────────────────────────────────┤
│ Complaint Card 2...                 │
└─────────────────────────────────────┘
```

**Components Used:**
- `Card`, `CardContent` - Complaint cards
- `Button` - Actions
- `Badge` - Status indicators
- `Input` - Search
- `Select` - Filters
- `Dialog` - File complaint modal

**Color Coding:**
- Pending: Yellow (bg-yellow-100)
- In Progress: Purple (bg-purple-100)
- Resolved: Green (bg-green-100)
- Rejected: Red (bg-red-100)

---

### 2. **Worker Dashboard** (`/worker`)

**Purpose:** Manage assigned tasks and upload completion proof

**Key Features:**
- ✅ View assigned tasks
- ✅ Start task and update status
- ✅ Upload before/after photos
- ✅ View citizen contact details
- ✅ Track completed tasks

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "Worker Dashboard"          │
├─────────────────────────────────────┤
│ Stats Grid (3 cards)                │
│ [Assigned] [In Progress] [Completed]│
├─────────────────────────────────────┤
│ Active Tasks                        │
│ ┌───────────────────────────────┐   │
│ │ Task Card                     │   │
│ │ ⚡ CMP-1234                   │   │
│ │ Street light not working      │   │
│ │ Deadline: Nov 2, 6:00 PM      │   │
│ │ Citizen: Priya • +91 98765..  │   │
│ │ [Start Task] [Upload Proof]   │   │
│ └───────────────────────────────┘   │
├─────────────────────────────────────┤
│ Recently Completed                  │
│ ✅ CMP-1225 | Garbage collection    │
└─────────────────────────────────────┘
```

**Special Features:**
- Dual photo upload (Before/After)
- Deadline countdown
- Citizen contact card
- Progress tracking

**Upload Flow:**
1. Click "Upload Proof"
2. Upload before photos
3. Upload after photos
4. Add work notes
5. Mark complete

---

### 3. **Officer Dashboard** (`/officer`)

**Purpose:** Monitor complaints and assign workers

**Key Features:**
- ✅ View all complaints
- ✅ Assign workers to pending complaints
- ✅ Update complaint status
- ✅ View worker availability
- ✅ Advanced filtering

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "Officer Dashboard"         │
├─────────────────────────────────────┤
│ Stats Grid (4 cards)                │
│ [Total] [Pending] [Progress] [Res.] │
├─────────────────────────────────────┤
│ Filters Row                         │
│ [Search] [Category] [Status] [Prio.]│
├─────────────────────────────────────┤
│ Complaint Card                      │
│ ┌─────────────────────────────────┐ │
│ │ 💧 CMP-1234                     │ │
│ │ Water supply issue              │ │
│ │ Citizen: Amit Patel             │ │
│ │ Worker: Ravi Kumar (if assigned)│ │
│ │ [View] [Assign Worker]          │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Available Workers (4 cards)         │
│ [Ravi Kumar] [Suresh] [Mohan] [...]  │
│ Active: 3 | Completed: 45           │
└─────────────────────────────────────┘
```

**Assignment Flow:**
1. Click "Assign Worker"
2. Select worker from dropdown
3. Set deadline
4. Set priority
5. Confirm assignment

---

### 4. **Admin Dashboard** (`/admin`)

**Purpose:** System analytics and user management

**Key Features:**
- ✅ Analytics charts (Bar, Pie)
- ✅ User management table
- ✅ System statistics
- ✅ Recent activity feed
- ✅ Add/edit/delete users

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "Admin Dashboard"           │
│ [+ Add User]                        │
├─────────────────────────────────────┤
│ Stats Grid (4 cards)                │
│ [Users] [Complaints] [Avg Time] [%] │
├─────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐   │
│ │ Bar Chart    │ │ Pie Chart    │   │
│ │ Complaints   │ │ Status Dist. │   │
│ │ by Category  │ │              │   │
│ └──────────────┘ └──────────────┘   │
├─────────────────────────────────────┤
│ User Management Table               │
│ ┌─────────────────────────────────┐ │
│ │ User | Role | Status | Actions │ │
│ │ Priya | CITIZEN | Active | ⋮   │ │
│ │ Ravi  | WORKER  | Active | ⋮   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Recent Activity Feed                │
│ • New complaint filed - 2 min ago   │
│ • Worker assigned - 15 min ago      │
└─────────────────────────────────────┘
```

**Charts:**
- **Bar Chart:** Complaints by category (Total vs Resolved)
- **Pie Chart:** Status distribution with colors

**User Table Columns:**
- Avatar + Name + Email
- Role badge
- Status badge
- Activity metrics
- Action buttons (Edit, Delete)

---

## 🧩 UI Components Library

### Core Components

#### 1. **Button** (`components/ui/button.tsx`)

```tsx
<Button variant="default" size="default">
  Primary Button
</Button>

// Variants
variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success"

// Sizes
size: "default" | "sm" | "lg" | "icon"
```

#### 2. **Card** (`components/ui/card.tsx`)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

#### 3. **Badge** (`components/ui/badge.tsx`)

```tsx
<Badge variant="default">Status</Badge>

// Variants
variant: "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
```

#### 4. **Input** (`components/ui/input.tsx`)

```tsx
<Input 
  type="text" 
  placeholder="Enter text..."
  className="w-full"
/>
```

#### 5. **Select** (`components/ui/select.tsx`)

```tsx
<Select>
  <option value="">Select option</option>
  <option value="1">Option 1</option>
</Select>
```

#### 6. **Textarea** (`components/ui/textarea.tsx`)

```tsx
<Textarea 
  placeholder="Enter description..."
  rows={4}
/>
```

#### 7. **Dialog** (`components/ui/dialog.tsx`)

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div>Content</div>
  </DialogContent>
</Dialog>
```

---

## 🛠️ Utility Functions

### Helper Functions (`lib/utils.ts`)

```tsx
// Tailwind class merger
cn(...classes) 

// Date formatting
formatDate(date) // "28 Oct 2025"
formatDateTime(date) // "28 Oct 2025, 10:30 AM"

// Status styling
getStatusColor(status) // Returns Tailwind classes
getPriorityColor(priority) // Returns Tailwind classes
getCategoryIcon(category) // Returns emoji
```

### Usage Example:

```tsx
<Badge className={getStatusColor("PENDING")}>
  Pending
</Badge>

<span>{getCategoryIcon("WATER")}</span> Water Supply
```

---

## 📐 Responsive Breakpoints

```tsx
// Mobile First Approach
default: Mobile (< 640px)
sm: Tablet (≥ 640px)
md: Desktop (≥ 768px)
lg: Large Desktop (≥ 1024px)
xl: Extra Large (≥ 1280px)

// Example Usage
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  // 1 col mobile, 2 cols tablet, 4 cols desktop
</div>
```

---

## 🎯 Sidebar Navigation

### Features:
- ✅ Role-based menu items
- ✅ Active state highlighting
- ✅ Mobile drawer (slides from left)
- ✅ User profile section
- ✅ Logout button

### Navigation Items:

**Citizen:**
- Dashboard (`/citizen`)
- My Complaints (`/citizen/complaints`)

**Worker:**
- Dashboard (`/worker`)
- My Tasks (`/worker/tasks`)

**Officer:**
- Dashboard (`/officer`)
- Complaints (`/officer/complaints`)
- Workers (`/officer/workers`)

**Admin:**
- Dashboard (`/admin`)
- Analytics (`/admin/analytics`)
- Users (`/admin/users`)
- Settings (`/admin/settings`)

---

## 🔄 Interactions & Animations

### Hover Effects

```tsx
// Cards
hover:shadow-md transition-shadow

// Buttons
hover:bg-blue-700 transition-colors

// Links
hover:text-blue-600 underline-offset-4
```

### Focus States

```tsx
focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
```

### Transitions

```tsx
transition-all duration-300 ease-in-out
```

---

## 📦 File Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx           # Shared sidebar layout
│   ├── citizen/
│   │   └── page.tsx         # Citizen dashboard
│   ├── worker/
│   │   └── page.tsx         # Worker dashboard
│   ├── officer/
│   │   └── page.tsx         # Officer dashboard
│   └── admin/
│       └── page.tsx         # Admin dashboard
│
components/
└── ui/
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── input.tsx
    ├── select.tsx
    ├── textarea.tsx
    └── dialog.tsx
│
lib/
└── utils.ts                 # Utility functions
```

---

## 🎨 Icon System

Using **Lucide React** icons:

```tsx
import { 
  Plus,           // Add actions
  Search,         // Search inputs
  Filter,         // Filters
  Users,          // User management
  FileText,       // Complaints
  CheckCircle2,   // Success/completed
  Clock,          // Pending
  AlertCircle,    // Warnings
  MapPin,         // Location
  Calendar,       // Dates
  Upload,         // File uploads
  Image,          // Photos
  Video,          // Videos
  Menu,           // Mobile menu
  X,              // Close
  LogOut          // Logout
} from 'lucide-react';
```

---

## 📊 Chart Integration

Using **Recharts** for analytics:

```tsx
import { 
  BarChart, Bar, 
  PieChart, Pie, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

// Responsive chart wrapper
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    {/* Chart components */}
  </BarChart>
</ResponsiveContainer>
```

---

## ✅ Accessibility Checklist

- [x] Semantic HTML elements
- [x] ARIA labels where needed
- [x] Keyboard navigation (Tab, Enter, Escape)
- [x] Focus indicators
- [x] Color contrast ratios (4.5:1 minimum)
- [x] Alt text for images
- [x] Screen reader friendly
- [x] Error messages
- [x] Loading states

---

## 🚀 Getting Started

### 1. **Navigate to dashboard:**

```bash
# Citizen
http://localhost:3000/citizen

# Worker
http://localhost:3000/worker

# Officer
http://localhost:3000/officer

# Admin
http://localhost:3000/admin
```

### 2. **View components:**

All UI components are in `components/ui/` and can be imported:

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### 3. **Customize:**

- Colors: `tailwind.config.ts`
- Components: `components/ui/`
- Utils: `lib/utils.ts`

---

## 🎉 Design Highlights

### What Makes This Design Great:

1. **Consistency:** Unified design language across all dashboards
2. **Efficiency:** Quick access to frequently used actions
3. **Clarity:** Clear visual hierarchy and information architecture
4. **Feedback:** Real-time status updates with color-coded badges
5. **Flexibility:** Easily extensible component system
6. **Performance:** Optimized for speed and responsiveness
7. **Modern:** Clean, contemporary UI following 2025 design trends

---

**🎨 Ready to use! All dashboards are fully functional with mock data.**

For API integration, connect to the backend routes in `app/api/`.
