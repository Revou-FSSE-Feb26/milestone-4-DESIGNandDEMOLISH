import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  private mockUsers = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'hashed_pass_1',
      role: 'user',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'hashed_pass_2',
      role: 'user',
      created_at: new Date().toISOString(),
    },
  ];
  private idCounter = 3;

  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: this.idCounter++,
      ...createUserDto,
      role: createUserDto.role ?? 'user',
      created_at: new Date().toISOString(),
    };
    this.mockUsers.push(newUser);
    return newUser;
  }

  findAll() {
    return this.mockUsers;
  }
}
