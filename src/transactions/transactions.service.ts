import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionType } from '@prisma/client';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import {
  BALANCE_CALCULATOR_TOKEN,
  BalanceCalculatorService,
} from './providers/balance-calculator.provider';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    @Inject(BALANCE_CALCULATOR_TOKEN)
    private balanceCalculator: BalanceCalculatorService,
  ) { }

  async create(dto: CreateTransactionDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.account_id },
    });
    if (!account) throw new NotFoundException('Account not found');

    const amountNumber = Number(dto.amount);
    const currentBalance = Number(account.balance);

    let newBalance = currentBalance;
    if (dto.type === TransactionType.income) {
      newBalance = this.balanceCalculator.calculateNewBalance(
        currentBalance,
        amountNumber,
        'INCOME',
      );
    } else if (dto.type === TransactionType.expense) {
      newBalance = this.balanceCalculator.calculateNewBalance(
        currentBalance,
        amountNumber,
        'EXPENSE',
      );
      if (newBalance < 0) {
        throw new BadRequestException('Insufficient funds for this expense');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const createData: any = {
        accountId: dto.account_id,
        type: dto.type,
        amount: amountNumber,
        description: dto.description,
        transactionDate: new Date(dto.transaction_date),
      };
      if (dto.category_id) {
        createData.categoryId = dto.category_id;
      }

      const transaction = await tx.transaction.create({
        data: createData,
        include: {
          category: true,
        },
      });

      await tx.account.update({
        where: { id: dto.account_id },
        data: { balance: newBalance },
      });

      return transaction;
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        category: true,
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        account: { userId },
      },
      include: {
        category: true,
        account: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!transaction)
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    return transaction;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const oldTransaction = await this.findOne(id);

    const account = await this.prisma.account.findUnique({
      where: { id: oldTransaction.accountId },
    });
    if (!account) throw new NotFoundException('Account not found');

    const oldAmount = Number(oldTransaction.amount);
    const newAmount =
      dto.amount !== undefined ? Number(dto.amount) : oldAmount;
    const newType = dto.type ?? oldTransaction.type;

    let balanceDelta = 0;
    if (oldTransaction.type === TransactionType.income) balanceDelta -= oldAmount;
    else if (oldTransaction.type === TransactionType.expense) balanceDelta += oldAmount;

    if (newType === TransactionType.income) balanceDelta += newAmount;
    else if (newType === TransactionType.expense) balanceDelta -= newAmount;

    const newBalance = Number(account.balance) + balanceDelta;

    if (newBalance < 0) {
      throw new BadRequestException('This update would result in insufficient funds');
    }

    return this.prisma.$transaction(async (tx) => {
      const updateData: any = {
        ...(dto.account_id && { accountId: dto.account_id }),
        ...(dto.type && { type: dto.type }),
        ...(dto.amount !== undefined && { amount: newAmount }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.transaction_date && {
          transactionDate: new Date(dto.transaction_date),
        }),
      };
      if (dto.category_id !== undefined) {
        updateData.categoryId = dto.category_id;
      }

      const updated = await tx.transaction.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      return updated;
    });
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    const account = await this.prisma.account.findUnique({
      where: { id: transaction.accountId },
    });

    if (account) {
      const amountNum = Number(transaction.amount);
      let balanceDelta = 0;
      if (transaction.type === TransactionType.income) balanceDelta = -amountNum;
      else if (transaction.type === TransactionType.expense) balanceDelta = amountNum;

      const restoredBalance = Number(account.balance) + balanceDelta;

      return this.prisma.$transaction(async (tx) => {
        const deleted = await tx.transaction.delete({ where: { id } });
        await tx.account.update({
          where: { id: account.id },
          data: { balance: restoredBalance },
        });
        return deleted;
      });
    }

    return this.prisma.transaction.delete({ where: { id } });
  }
}
