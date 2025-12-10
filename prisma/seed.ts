import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("<1 Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("123", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log(" Created admin user:", {
    username: admin.username,
    password: "123 (hashed)",
  });

  console.log("<‰ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("L Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
