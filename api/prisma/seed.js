const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const organizer = await prisma.user.upsert({
    where: { email: "organizador@teste.com" },
    update: {},
    create: {
      name: "Organizador Teste",
      email: "organizador@teste.com",
      password: passwordHash,
      role: "ORGANIZER",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "cliente@teste.com" },
    update: {},
    create: {
      name: "Cliente Teste",
      email: "cliente@teste.com",
      password: passwordHash,
      role: "CLIENT",
    },
  });

  const gate = await prisma.user.upsert({
    where: { email: "portaria@teste.com" },
    update: {},
    create: {
      name: "Portaria Teste",
      email: "portaria@teste.com",
      password: passwordHash,
      role: "GATE",
    },
  });

  const event = await prisma.event.upsert({
    where: { id: "seed-event-1" },
    update: {},
    create: {
      id: "seed-event-1",
      title: "Show de Teste",
      description: "Evento criado pelo seed para testes de desenvolvimento.",
      category: "Show",
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Arena Teste, São Paulo - SP",
      capacity: 100,
      availableTickets: 100,
      price: 50.0,
      imageUrl: null,
      organizerId: organizer.id,
    },
  });

  console.log("Seed concluído:");
  console.log({ organizer: organizer.email, client: client.email, gate: gate.email, event: event.title });
  console.log("Senha para todos os usuários de teste: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
