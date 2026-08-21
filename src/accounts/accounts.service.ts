import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AccountType } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: {
    userId: string;
    name: string;
    type: AccountType;
    balance?: number;
  }) {
    return this.prisma.account.create({
      data: {
        userId: createAccountDto.userId,
        name: createAccountDto.name,
        type: createAccountDto.type,
        balance: createAccountDto.balance ?? 0.0,
      },
    });
  }

  async findAll() {
    return this.prisma.account.findMany();
  }

  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(
    id: string,
    updateAccountDto: { name?: string; type?: AccountType; balance?: number },
  ) {
    await this.findOne(id);
    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
