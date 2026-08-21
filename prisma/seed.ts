import {
  PrismaClient,
  UserRole,
  AccountType,
  CategoryType,
  TransactionType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword123',
      role: UserRole.USER,
    },
  });

  const account = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Main Checking',
      type: AccountType.bank,
      balance: 1500.0,
    },
  });

  // 3. Create a sample category
  const category = await prisma.category.create({
    data: {
      name: 'Salary',
      type: CategoryType.income,
    },
  });

  await prisma.transaction.create({
    data: {
      accountId: account.id,
      categoryId: category.id,
      type: TransactionType.income,
      amount: 1500.0,
      description: 'Monthly salary deposit',
      transactionDate: new Date(),
    },
  });

  console.log(' Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(' Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
