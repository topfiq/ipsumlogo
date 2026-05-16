import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
  });

  const settings = [
    { key: "admin_password", value: "ipsum2025" },
    { key: "admin_otp", value: "123456" },
    { key: "admin_name", value: "Admin" },
    { key: "brand_name", value: "Ipsumlogo" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Seed complete");
  await prisma.$disconnect();
}

main().catch(console.error);
