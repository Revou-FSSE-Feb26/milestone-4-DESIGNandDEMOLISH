import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/create-account.dto';

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
  private idCounter = 3;

  create(createAccountDto: CreateAccountDto) {
    const newAccount = {
      id: this.idCounter++,
      ...createAccountDto,
      balance: createAccountDto.balance ?? 0.0,
      created_at: new Date().toISOString(),
    };
    this.mockAccounts.push(newAccount);
    return newAccount;
  }

  findAll() {
    return this.mockAccounts;
  }

  findOne(id: number) {
    return this.mockAccounts.find((a) => a.id === id);
  }

  update(id: number, updateData: UpdateAccountDto) {
    const index = this.mockAccounts.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.mockAccounts[index] = { ...this.mockAccounts[index], ...updateData };
    return this.mockAccounts[index];
  }

  remove(id: number) {
    const index = this.mockAccounts.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.mockAccounts.splice(index, 1);
    return true;
  }
}
