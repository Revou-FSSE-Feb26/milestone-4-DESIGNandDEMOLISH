import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.account_id },
    });
    if (!account) throw new NotFoundException('Account not found');

    const amountNumber = Number(dto.amount);
    let balanceChange = 0;
    if (dto.type === ('income' as any)) balanceChange = amountNumber;
    else if (dto.type === ('expense' as any)) balanceChange = -amountNumber;

    const currentBalance = Number(account.balance);
    const newBalance = currentBalance + balanceChange;

    if (dto.type === ('expense' as any) && newBalance < 0) {
      throw new BadRequestException('Insufficient funds for this expense');
    }

    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          accountId: dto.account_id,
          categoryId: dto.category_id ?? '',
          type: dto.type,
          amount: amountNumber,
          description: dto.description,
          transactionDate: new Date(dto.transaction_date),
        },
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
    await this.findOne(id);
    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.account_id && { accountId: dto.account_id }),
        ...(dto.category_id && { categoryId: dto.category_id }),
        ...(dto.type && { type: dto.type }),
        ...(dto.amount !== undefined && { amount: Number(dto.amount) }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.transaction_date && {
          transactionDate: new Date(dto.transaction_date),
        }),
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    const account = await this.prisma.account.findUnique({
      where: { id: transaction.accountId },
    });

    if (account) {
      let balanceReverse = 0;
      const amountNum = Number(transaction.amount);
      if (transaction.type === 'income') balanceReverse = -amountNum;
      else if (transaction.type === 'expense') balanceReverse = amountNum;

      const restoredBalance = Number(account.balance) + balanceReverse;

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
