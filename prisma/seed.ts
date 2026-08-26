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

  // ── Clean slate ──────────────────────────────────────────────────────────────
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ── Users (3) ────────────────────────────────────────────────────────────────
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: '$2b$10$examplehashedpassword1111111111111111111111111111111',
      role: UserRole.USER,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: '$2b$10$examplehashedpassword2222222222222222222222222222222',
      role: UserRole.USER,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: '$2b$10$examplehashedpassword3333333333333333333333333333333',
      role: UserRole.ADMIN,
    },
  });

  // ── Accounts (2 per user = 6 total) ──────────────────────────────────────────
  const aliceChecking = await prisma.account.create({
    data: { userId: alice.id, name: 'Alice Main Checking', type: AccountType.bank, balance: 2500.0 },
  });
  const aliceCash = await prisma.account.create({
    data: { userId: alice.id, name: 'Alice Pocket Cash', type: AccountType.cash, balance: 150.0 },
  });
  const bobSavings = await prisma.account.create({
    data: { userId: bob.id, name: 'Bob Savings', type: AccountType.bank, balance: 5000.0 },
  });
  const bobWallet = await prisma.account.create({
    data: { userId: bob.id, name: 'Bob Pay Wallet', type: AccountType.e_wallet, balance: 320.5 },
  });
  const charlieVault = await prisma.account.create({
    data: { userId: charlie.id, name: 'Charlie Vault', type: AccountType.bank, balance: 12000.0 },
  });
  const charlieCash = await prisma.account.create({
    data: { userId: charlie.id, name: 'Charlie Daily Cash', type: AccountType.cash, balance: 80.0 },
  });

  // ── Categories (7: income + expense mix, 1 unused for zero-tx test) ──────────
  const salary = await prisma.category.create({ data: { name: 'Salary', type: CategoryType.income } });
  const freelance = await prisma.category.create({ data: { name: 'Freelance', type: CategoryType.income } });
  const groceries = await prisma.category.create({ data: { name: 'Groceries', type: CategoryType.expense } });
  const utilities = await prisma.category.create({ data: { name: 'Utilities', type: CategoryType.expense } });
  const entertainment = await prisma.category.create({ data: { name: 'Entertainment', type: CategoryType.expense } });
  const dining = await prisma.category.create({ data: { name: 'Dining Out', type: CategoryType.expense } });
  await prisma.category.create({ data: { name: 'Subscriptions', type: CategoryType.expense } }); // intentionally unused

  // ── Transactions (21 entries across accounts and dates) ──────────────────────
  const txData = [
    // Alice Checking — January
    { accountId: aliceChecking.id, categoryId: salary.id, type: TransactionType.income, amount: 3000.0, description: 'Monthly Salary', transactionDate: new Date('2026-01-01') },
    { accountId: aliceChecking.id, categoryId: groceries.id, type: TransactionType.expense, amount: 150.0, description: 'Weekly Grocery Supermarket', transactionDate: new Date('2026-01-03') },
    { accountId: aliceChecking.id, categoryId: utilities.id, type: TransactionType.expense, amount: 120.0, description: 'Electricity Bill', transactionDate: new Date('2026-01-05') },
    { accountId: aliceChecking.id, categoryId: entertainment.id, type: TransactionType.expense, amount: 45.0, description: 'Movie Tickets', transactionDate: new Date('2026-01-10') },
    // Alice Cash — January
    { accountId: aliceCash.id, categoryId: dining.id, type: TransactionType.expense, amount: 25.0, description: 'Coffee and Snacks', transactionDate: new Date('2026-01-12') },
    { accountId: aliceCash.id, categoryId: groceries.id, type: TransactionType.expense, amount: 30.0, description: 'Corner Store Supplies', transactionDate: new Date('2026-01-15') },
    // Bob Savings — January
    { accountId: bobSavings.id, categoryId: salary.id, type: TransactionType.income, amount: 4500.0, description: 'Monthly Salary', transactionDate: new Date('2026-01-01') },
    { accountId: bobSavings.id, categoryId: freelance.id, type: TransactionType.income, amount: 800.0, description: 'Side Project Payment', transactionDate: new Date('2026-01-14') },
    { accountId: bobSavings.id, categoryId: groceries.id, type: TransactionType.expense, amount: 220.0, description: 'Bulk Grocery Shopping', transactionDate: new Date('2026-01-16') },
    { accountId: bobSavings.id, categoryId: utilities.id, type: TransactionType.expense, amount: 200.0, description: 'Internet and Phone', transactionDate: new Date('2026-01-18') },
    // Bob Wallet — January
    { accountId: bobWallet.id, categoryId: dining.id, type: TransactionType.expense, amount: 60.0, description: 'Dinner with Friends', transactionDate: new Date('2026-01-20') },
    { accountId: bobWallet.id, categoryId: entertainment.id, type: TransactionType.expense, amount: 15.0, description: 'Gaming Subscription', transactionDate: new Date('2026-01-22') },
    // Charlie Vault — January
    { accountId: charlieVault.id, categoryId: salary.id, type: TransactionType.income, amount: 6000.0, description: 'Executive Salary', transactionDate: new Date('2026-01-01') },
    { accountId: charlieVault.id, categoryId: groceries.id, type: TransactionType.expense, amount: 400.0, description: 'Organic Market Shopping', transactionDate: new Date('2026-01-02') },
    { accountId: charlieVault.id, categoryId: utilities.id, type: TransactionType.expense, amount: 350.0, description: 'Water & Power Utilities', transactionDate: new Date('2026-01-08') },
    { accountId: charlieVault.id, categoryId: dining.id, type: TransactionType.expense, amount: 180.0, description: 'Fine Dining', transactionDate: new Date('2026-01-15') },
    // Charlie Cash — January
    { accountId: charlieCash.id, categoryId: dining.id, type: TransactionType.expense, amount: 12.0, description: 'Lunch Grab', transactionDate: new Date('2026-01-17') },
    // Alice Checking — February
    { accountId: aliceChecking.id, categoryId: groceries.id, type: TransactionType.expense, amount: 110.0, description: 'Mid-month Groceries', transactionDate: new Date('2026-02-02') },
    { accountId: aliceChecking.id, categoryId: utilities.id, type: TransactionType.expense, amount: 125.0, description: 'Water Bill', transactionDate: new Date('2026-02-05') },
    // Bob Savings — February
    { accountId: bobSavings.id, categoryId: groceries.id, type: TransactionType.expense, amount: 205.0, description: 'February Groceries', transactionDate: new Date('2026-02-04') },
    // Bob Wallet — February
    { accountId: bobWallet.id, categoryId: dining.id, type: TransactionType.expense, amount: 40.0, description: 'Takeout Lunch', transactionDate: new Date('2026-02-10') },
  ];

  for (const tx of txData) {
    await prisma.transaction.create({ data: tx });
  }

  console.log('✅ Seeding finished successfully.');
  console.log(`  Users: ${[alice.name, bob.name, charlie.name].join(', ')}`);
  console.log(`  Accounts: 6 total (2 per user)`);
  console.log(`  Categories: 7 (2 income, 5 expense)`);
  console.log(`  Transactions: ${txData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
