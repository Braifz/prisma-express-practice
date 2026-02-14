import { PrismaClient, Prisma } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });

const createPost = () => ({
  title: faker.lorem.text(),
  content: faker.lorem.text(),
  published: true,
});

const createUser = () => ({
  name: faker.person.firstName(),
  email: faker.internet.email(),
  posts: {
    create: new Array(Math.floor(Math.random() * 3) + 1)
      .fill(0)
      .map(() => createPost()),
  },
});

const userData: Prisma.UserCreateInput[] = [
  createUser(),
  createUser(),
  createUser(),
];

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  // await prisma.post.deleteMany();
  // await prisma.user.deleteMany();

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
