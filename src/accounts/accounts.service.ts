import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  findAll() {
    return this.accountsRepository.findAll();
  }
}
