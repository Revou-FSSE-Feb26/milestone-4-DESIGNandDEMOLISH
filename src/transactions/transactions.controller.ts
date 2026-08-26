import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly prisma: PrismaService,
  ) { }

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { id: createTransactionDto.account_id },
    });
    if (!account || account.userId !== req.user.userId) {
      throw new ForbiddenException('You do not own this account');
    }
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.transactionsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const transaction = await this.transactionsService.findOne(id);
    const account = await this.prisma.account.findUnique({
      where: { id: transaction.accountId },
    });
    if (!account || account.userId !== req.user.userId) {
      throw new ForbiddenException('You do not own this transaction');
    }
    return transaction;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const transaction = await this.transactionsService.findOne(id);
    const account = await this.prisma.account.findUnique({
      where: { id: transaction.accountId },
    });
    if (!account || account.userId !== req.user.userId) {
      throw new ForbiddenException('You do not own this transaction');
    }
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const transaction = await this.transactionsService.findOne(id);
    const account = await this.prisma.account.findUnique({
      where: { id: transaction.accountId },
    });
    if (!account || account.userId !== req.user.userId) {
      throw new ForbiddenException('You do not own this transaction');
    }
    return this.transactionsService.remove(id);
  }
}
