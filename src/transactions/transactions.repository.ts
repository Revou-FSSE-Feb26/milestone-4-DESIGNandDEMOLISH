import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsRepository {
  private mockTransactions: Array<{
    id: number;
    account_id: number;
    category_id?: number;
    type: string;
    amount: number;
    description?: string;
    transaction_date: string;
    created_at: string;
  }> = [
    {
      id: 1,
      account_id: 1,
      category_id: 1,
      type: 'income',
      amount: 3000.0,
      description: 'Monthly Salary',
      transaction_date: '2026-01-01',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      account_id: 1,
      category_id: 2,
      type: 'expense',
      amount: 150.0,
      description: 'Weekly Grocery Supermarket',
      transaction_date: '2026-01-03',
      created_at: new Date().toISOString(),
    },
  ];
  private idCounter = 3;

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction = {
      id: this.idCounter++,
      ...createTransactionDto,
      created_at: new Date().toISOString(),
    };
    this.mockTransactions.push(newTransaction);
    return newTransaction;
  }

  findAll() {
    return this.mockTransactions;
  }

  findOne(id: number) {
    return this.mockTransactions.find((t) => t.id === id);
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const index = this.mockTransactions.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.mockTransactions[index] = {
      ...this.mockTransactions[index],
      ...updateTransactionDto,
    };
    return this.mockTransactions[index];
  }

  remove(id: number) {
    const index = this.mockTransactions.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const removedTransaction = this.mockTransactions[index];
    this.mockTransactions.splice(index, 1);
    return removedTransaction;
  }
}
