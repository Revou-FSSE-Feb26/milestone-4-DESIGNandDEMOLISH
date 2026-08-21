import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  private mockUsers = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
    },
  ];

  findAll() {
    return this.mockUsers;
  }
}
