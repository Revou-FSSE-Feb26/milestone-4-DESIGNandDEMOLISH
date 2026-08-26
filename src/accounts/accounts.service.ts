import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID #${userId} not found`);
    }
    return this.prisma.account.create({
      data: {
        userId,
        name: createAccountDto.name,
        type: createAccountDto.type,
        balance: createAccountDto.balance ?? 0.0,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
    });
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

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    await this.findOne(id);
    return this.prisma.account.update({
      where: { id },
      data: {
        ...(updateAccountDto.name && { name: updateAccountDto.name }),
        ...(updateAccountDto.type && { type: updateAccountDto.type }),
        ...(updateAccountDto.balance !== undefined && {
          balance: updateAccountDto.balance,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.account.delete({
      where: { id },
    });
  }
}
