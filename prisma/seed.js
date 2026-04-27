const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminEmail = 'admin@kodein.com';
  const adminPassword = 'Admin123!';

  try {
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Default password: ${adminPassword}`);
    console.log('⚠️  Please change this password after first login!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
