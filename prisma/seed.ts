import { PrismaClient, ComplaintCategory, ComplaintStatus, ComplaintPriority, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users first
  console.log('👥 Creating users...');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartcms.com' },
    update: {},
    create: {
      email: 'admin@smartcms.com',
      phone: '+919876543210',
      name: 'System Admin',
      role: UserRole.ADMIN,
      location: 'Bangalore, Karnataka',
    },
  });

  const officer = await prisma.user.upsert({
    where: { email: 'officer@smartcms.com' },
    update: {},
    create: {
      email: 'officer@smartcms.com',
      phone: '+919876543211',
      name: 'Rajesh Sharma',
      role: UserRole.OFFICER,
      location: 'Bangalore, Karnataka',
    },
  });

  const workers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ravi.worker@smartcms.com' },
      update: {},
      create: {
        email: 'ravi.worker@smartcms.com',
        phone: '+919876543212',
        name: 'Ravi Kumar',
        role: UserRole.WORKER,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'suresh.worker@smartcms.com' },
      update: {},
      create: {
        email: 'suresh.worker@smartcms.com',
        phone: '+919876543213',
        name: 'Suresh Reddy',
        role: UserRole.WORKER,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mohan.worker@smartcms.com' },
      update: {},
      create: {
        email: 'mohan.worker@smartcms.com',
        phone: '+919876543214',
        name: 'Mohan Singh',
        role: UserRole.WORKER,
        location: 'Bangalore, Karnataka',
      },
    }),
  ]);

  const citizens = await Promise.all([
    prisma.user.upsert({
      where: { email: 'priya.sharma@example.com' },
      update: {},
      create: {
        email: 'priya.sharma@example.com',
        phone: '+919876543220',
        name: 'Priya Sharma',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'amit.patel@example.com' },
      update: {},
      create: {
        email: 'amit.patel@example.com',
        phone: '+919876543221',
        name: 'Amit Patel',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sneha.gupta@example.com' },
      update: {},
      create: {
        email: 'sneha.gupta@example.com',
        phone: '+919876543222',
        name: 'Sneha Gupta',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'vikram.singh@example.com' },
      update: {},
      create: {
        email: 'vikram.singh@example.com',
        phone: '+919876543223',
        name: 'Vikram Singh',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'anita.das@example.com' },
      update: {},
      create: {
        email: 'anita.das@example.com',
        phone: '+919876543224',
        name: 'Anita Das',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'karthik.reddy@example.com' },
      update: {},
      create: {
        email: 'karthik.reddy@example.com',
        phone: '+919876543225',
        name: 'Karthik Reddy',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'meera.joshi@example.com' },
      update: {},
      create: {
        email: 'meera.joshi@example.com',
        phone: '+919876543226',
        name: 'Meera Joshi',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
    prisma.user.upsert({
      where: { email: 'rahul.verma@example.com' },
      update: {},
      create: {
        email: 'rahul.verma@example.com',
        phone: '+919876543227',
        name: 'Rahul Verma',
        role: UserRole.CITIZEN,
        location: 'Bangalore, Karnataka',
      },
    }),
  ]);

  console.log('✅ Users created successfully');

  // Create 20 sample complaints
  console.log('📝 Creating sample complaints...');

  const complaints = [
    {
      title: 'Street light not working near bus stop',
      description: 'The street light at MG Road bus stop has been non-functional for the past 3 days. This is causing safety issues for commuters during evening hours.',
      category: ComplaintCategory.ELECTRICITY,
      status: ComplaintStatus.IN_PROGRESS,
      priority: ComplaintPriority.HIGH,
      location: 'MG Road Bus Stop, Bangalore',
      createdAt: new Date('2025-10-28T10:30:00Z'),
      citizenId: citizens[0].id,
    },
    {
      title: 'Large pothole on main road',
      description: 'There is a massive pothole near Indiranagar Metro Station that has been growing larger. Multiple vehicles have been damaged, and it poses a serious accident risk.',
      category: ComplaintCategory.ROAD,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.URGENT,
      location: 'Indiranagar Metro Station, 100 Feet Road',
      createdAt: new Date('2025-10-30T14:20:00Z'),
      citizenId: citizens[1].id,
    },
    {
      title: 'No water supply since morning',
      description: 'Our entire street in JP Nagar has not received water supply since 6 AM today. This is affecting around 50 households.',
      category: ComplaintCategory.WATER,
      status: ComplaintStatus.ASSIGNED,
      priority: ComplaintPriority.URGENT,
      location: 'JP Nagar 7th Phase, 5th Cross',
      createdAt: new Date('2025-11-01T08:15:00Z'),
      citizenId: citizens[2].id,
    },
    {
      title: 'Garbage not collected for 4 days',
      description: 'The municipal garbage collection has not happened in our area for the past 4 days. Garbage is piling up and creating a health hazard.',
      category: ComplaintCategory.GARBAGE,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.HIGH,
      location: 'Koramangala 4th Block, 8th Main Road',
      createdAt: new Date('2025-10-29T16:45:00Z'),
      citizenId: citizens[3].id,
    },
    {
      title: 'Broken manhole cover on footpath',
      description: 'An open manhole on the footpath near HSR Layout Sector 2 is extremely dangerous. Someone could fall in during night time.',
      category: ComplaintCategory.ROAD,
      status: ComplaintStatus.RESOLVED,
      priority: ComplaintPriority.URGENT,
      location: 'HSR Layout Sector 2, 27th Main Road',
      createdAt: new Date('2025-10-25T09:20:00Z'),
      citizenId: citizens[4].id,
    },
    {
      title: 'Water pipeline leakage',
      description: 'There is continuous water leakage from the main pipeline near Whitefield. Water is being wasted 24/7 for the past week.',
      category: ComplaintCategory.WATER,
      status: ComplaintStatus.IN_PROGRESS,
      priority: ComplaintPriority.HIGH,
      location: 'Whitefield Main Road, Near ITPL',
      createdAt: new Date('2025-10-26T11:30:00Z'),
      citizenId: citizens[5].id,
    },
    {
      title: 'Power outage in residential area',
      description: 'Entire Jayanagar 4th Block has been experiencing frequent power cuts lasting 2-3 hours each day for the past week.',
      category: ComplaintCategory.ELECTRICITY,
      status: ComplaintStatus.ASSIGNED,
      priority: ComplaintPriority.HIGH,
      location: 'Jayanagar 4th Block, East End',
      createdAt: new Date('2025-10-27T15:10:00Z'),
      citizenId: citizens[6].id,
    },
    {
      title: 'Illegal garbage dumping spot',
      description: 'People are illegally dumping garbage at the corner near Electronic City. This needs immediate cleanup and monitoring.',
      category: ComplaintCategory.GARBAGE,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.MEDIUM,
      location: 'Electronic City Phase 1, Behind Tech Park',
      createdAt: new Date('2025-10-31T12:40:00Z'),
      citizenId: citizens[7].id,
    },
    {
      title: 'Road resurfacing needed urgently',
      description: 'The entire stretch of road from Bannerghatta Road to Arekere has deteriorated badly with multiple potholes and cracks.',
      category: ComplaintCategory.ROAD,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.MEDIUM,
      location: 'Bannerghatta Road to Arekere Gate',
      createdAt: new Date('2025-11-01T10:25:00Z'),
      citizenId: citizens[0].id,
    },
    {
      title: 'Street light pole damaged',
      description: 'A street light pole near Malleshwaram market has been damaged and is tilting dangerously. It might fall during heavy rain.',
      category: ComplaintCategory.ELECTRICITY,
      status: ComplaintStatus.RESOLVED,
      priority: ComplaintPriority.HIGH,
      location: 'Malleshwaram Market, 8th Cross',
      createdAt: new Date('2025-10-23T14:50:00Z'),
      citizenId: citizens[1].id,
    },
    {
      title: 'Low water pressure issue',
      description: 'Residents of Yeshwanthpur are experiencing very low water pressure making it difficult to use water for daily needs.',
      category: ComplaintCategory.WATER,
      status: ComplaintStatus.IN_PROGRESS,
      priority: ComplaintPriority.MEDIUM,
      location: 'Yeshwanthpur, 3rd Main Road',
      createdAt: new Date('2025-10-28T07:30:00Z'),
      citizenId: citizens[2].id,
    },
    {
      title: 'Overflowing garbage bins',
      description: 'Public garbage bins near Cubbon Park are overflowing for the past 2 days. The smell is unbearable and attracting stray animals.',
      category: ComplaintCategory.GARBAGE,
      status: ComplaintStatus.ASSIGNED,
      priority: ComplaintPriority.HIGH,
      location: 'Cubbon Park, Main Entrance',
      createdAt: new Date('2025-10-30T09:15:00Z'),
      citizenId: citizens[3].id,
    },
    {
      title: 'Road flooded after rain',
      description: 'The underpass at Silk Board junction gets completely flooded even with light rain due to poor drainage. Vehicles cannot pass.',
      category: ComplaintCategory.ROAD,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.URGENT,
      location: 'Silk Board Junction, Underpass',
      createdAt: new Date('2025-11-01T18:20:00Z'),
      citizenId: citizens[4].id,
    },
    {
      title: 'Transformer making loud noise',
      description: 'The electrical transformer near our apartment in BTM Layout is making extremely loud buzzing noise and sparking occasionally.',
      category: ComplaintCategory.ELECTRICITY,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.URGENT,
      location: 'BTM Layout 2nd Stage, Near Water Tank',
      createdAt: new Date('2025-11-02T06:45:00Z'),
      citizenId: citizens[5].id,
    },
    {
      title: 'Contaminated water supply',
      description: 'The water being supplied to Basaveshwaranagar has a strange smell and color. Multiple residents have reported stomach issues.',
      category: ComplaintCategory.WATER,
      status: ComplaintStatus.ASSIGNED,
      priority: ComplaintPriority.URGENT,
      location: 'Basaveshwaranagar, 2nd Stage',
      createdAt: new Date('2025-11-01T13:30:00Z'),
      citizenId: citizens[6].id,
    },
    {
      title: 'Stray dogs attacking due to garbage',
      description: 'Uncollected garbage near Yelahanka is attracting stray dogs in large numbers. They are becoming aggressive towards residents.',
      category: ComplaintCategory.GARBAGE,
      status: ComplaintStatus.IN_PROGRESS,
      priority: ComplaintPriority.HIGH,
      location: 'Yelahanka New Town, Sector 1',
      createdAt: new Date('2025-10-29T11:50:00Z'),
      citizenId: citizens[7].id,
    },
    {
      title: 'Speed breaker needed urgently',
      description: 'There have been 3 accidents in the past month near the school in Rajajinagar due to overspeeding. Speed breakers are urgently needed.',
      category: ComplaintCategory.ROAD,
      status: ComplaintStatus.RESOLVED,
      priority: ComplaintPriority.HIGH,
      location: 'Rajajinagar, Near Government School',
      createdAt: new Date('2025-10-20T16:30:00Z'),
      citizenId: citizens[0].id,
    },
    {
      title: 'Street lights off during night',
      description: 'All street lights in our locality in Sadashivanagar remain off throughout the night, making it unsafe for women and elderly.',
      category: ComplaintCategory.ELECTRICITY,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.HIGH,
      location: 'Sadashivanagar, 10th Cross',
      createdAt: new Date('2025-11-01T20:15:00Z'),
      citizenId: citizens[1].id,
    },
    {
      title: 'Broken water meter',
      description: 'My water meter has been broken for 2 weeks showing incorrect readings. Need replacement to avoid overbilling.',
      category: ComplaintCategory.WATER,
      status: ComplaintStatus.PENDING,
      priority: ComplaintPriority.LOW,
      location: 'Vijayanagar, House No. 245',
      createdAt: new Date('2025-10-27T14:20:00Z'),
      citizenId: citizens[2].id,
    },
    {
      title: 'Hazardous waste dumped illegally',
      description: 'Some construction waste and possibly hazardous materials have been dumped near the lake in Bellandur. Immediate action required.',
      category: ComplaintCategory.GARBAGE,
      status: ComplaintStatus.ASSIGNED,
      priority: ComplaintPriority.URGENT,
      location: 'Bellandur Lake, Near ORR',
      createdAt: new Date('2025-11-01T08:45:00Z'),
      citizenId: citizens[3].id,
    },
  ];

  // Create complaints and optionally assign them
  for (let i = 0; i < complaints.length; i++) {
    const complaintData = complaints[i];
    
    const complaint = await prisma.complaint.create({
      data: complaintData,
    });

    console.log(`Created complaint ${i + 1}/20: ${complaint.title}`);

    // Assign workers to some complaints
    if (complaint.status === ComplaintStatus.ASSIGNED || complaint.status === ComplaintStatus.IN_PROGRESS) {
      const worker = workers[i % workers.length];
      
      await prisma.assignment.create({
        data: {
          complaintId: complaint.id,
          workerId: worker.id,
          assignedById: officer.id,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        },
      });

      console.log(`  ✓ Assigned to ${worker.name}`);
    }

    // Add work proof for resolved complaints
    if (complaint.status === ComplaintStatus.RESOLVED) {
      const worker = workers[i % workers.length];
      
      await prisma.workProof.create({
        data: {
          complaintId: complaint.id,
          workerId: worker.id,
          notes: 'Work completed successfully. Issue has been resolved.',
        },
      });

      console.log(`  ✓ Work proof added`);
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${1 + 1 + workers.length + citizens.length}`);
  console.log(`   Complaints: ${complaints.length}`);
  console.log(`   - Road: ${complaints.filter(c => c.category === ComplaintCategory.ROAD).length}`);
  console.log(`   - Water: ${complaints.filter(c => c.category === ComplaintCategory.WATER).length}`);
  console.log(`   - Electricity: ${complaints.filter(c => c.category === ComplaintCategory.ELECTRICITY).length}`);
  console.log(`   - Garbage: ${complaints.filter(c => c.category === ComplaintCategory.GARBAGE).length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
