import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pkg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://kartonosaleh@localhost:5432/spmb_db?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@kodein.com";
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  console.log("--- Memulai Seeding ---");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user berhasil disiapkan: ${admin.email}`);
  console.log("--- Seeding Selesai ---");
}

main()
  .catch((e) => {
    console.error("Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });