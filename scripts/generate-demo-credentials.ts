import { hashPassword } from '../lib/password';

// Script to create demo users with hashed passwords

async function generateDemoCredentials() {
  const demoUsers = [
    { role: 'OFFICER', id: 'OFF12345', password: 'officer123' },
    { role: 'WORKER', id: 'WRK12345', password: 'worker123' },
    { role: 'ADMIN', id: 'ADM12345', password: 'admin123' },
  ];

  console.log('=== Demo Credentials with Hashed Passwords ===\n');
  
  for (const user of demoUsers) {
    const hashedPassword = await hashPassword(user.password);
    console.log(`${user.role}:`);
    console.log(`  Employee ID: ${user.id}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Hashed: ${hashedPassword}`);
    console.log('');
  }
}

generateDemoCredentials().catch(console.error);
