import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsRepository {
  private mockTransactions = [
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

  findAll() {
    return this.mockTransactions;
  }
}
