import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '@prisma/client';

interface MockTransaction {
  id: string;
  account_id: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  transaction_date: string;
  created_at: string;
}

@Injectable()
export class TransactionsRepository {
  private mockTransactions: MockTransaction[] = [
    {
      id: '1',
      account_id: '1',
      category_id: '1',
      type: TransactionType.income,
      amount: 3000.0,
      description: 'Monthly Salary',
      transaction_date: '2026-01-01',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      account_id: '1',
      category_id: '2',
      type: TransactionType.expense,
      amount: 150.0,
      description: 'Weekly Grocery Supermarket',
      transaction_date: '2026-01-03',
      created_at: new Date().toISOString(),
    },
  ];
  private idCounter = 3;

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction = {
      id: String(this.idCounter++),
      ...createTransactionDto,
      created_at: new Date().toISOString(),
    };
    this.mockTransactions.push(newTransaction);
    return newTransaction;
  }

  findAll() {
    return this.mockTransactions;
  }

  findOne(id: string) {
    return this.mockTransactions.find((t) => t.id === id);
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const index = this.mockTransactions.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.mockTransactions[index] = {
      ...this.mockTransactions[index],
      ...updateTransactionDto,
    };
    return this.mockTransactions[index];
  }

  remove(id: string) {
    const index = this.mockTransactions.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const removedTransaction = this.mockTransactions[index];
    this.mockTransactions.splice(index, 1);
    return removedTransaction;
  }
}
