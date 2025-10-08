import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Roller
  await prisma.role.createMany({
    data: [
      { name: "ADMIN", description: "Full access" },
      { name: "EDITOR", description: "Can write and publish articles" },
      { name: "READER", description: "Can read content" },
    ],
    skipDuplicates: true,
  });

  // Adminanvändare
  const admin = await prisma.user.upsert({
    where: { email: "admin@news.local" },
    update: {},
    create: {
      email: "admin@news.local",
      passwordHash: "$2b$10$abcdefghijklmnopqrstuv", // ersätt med bcrypt-hash
    },
  });

  // Koppla ADMIN-roll till admin
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: admin.id, roleId: adminRole.id },
      },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id },
    });
  }

  // Kategori
  await prisma.category.createMany({
    data: [
      { slug: "nyheter", name: "Nyheter" },
      { slug: "sport", name: "Sport" },
    ],
    skipDuplicates: true,
  });

  // Prenumerationstyp
  await prisma.subscriptionType.createMany({
    data: [
      {
        name: "Gratis",
        description: "Fri åtkomst till artiklar utan annonser",
        priceSek: 0,
        durationDays: 30,
      },
      {
        name: "Premium",
        description: "Full åtkomst + nyhetsbrev",
        priceSek: 99,
        durationDays: 30,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("✅ Seed data inserted"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
