import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.operador.count();
  if (count === 0) {
    await prisma.operador.createMany({
      data: [
        { nome: "Ana", cor: "#FF6A13" },
        { nome: "Bruno", cor: "#F2B705" },
        { nome: "Carlos", cor: "#2FA84F" },
      ],
    });
    console.log("Operadores iniciais criados.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
