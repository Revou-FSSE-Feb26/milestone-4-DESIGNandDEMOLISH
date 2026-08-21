import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsRepository {
  private mockAccounts = [
    {
      id: 1,
      user_id: 1,
      name: 'Alice Main Checking',
      type: 'bank',
      balance: 2500.0,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      user_id: 1,
      name: 'Alice Pocket Cash',
      type: 'cash',
      balance: 150.0,
      created_at: new Date().toISOString(),
    },
  ];

  findAll() {
    return this.mockAccounts;
  }
}
