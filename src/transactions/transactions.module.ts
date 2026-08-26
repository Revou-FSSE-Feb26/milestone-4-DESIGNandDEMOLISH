import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { PrismaService } from '../prisma/prisma.service';
import { BalanceCalculatorProvider } from './providers/balance-calculator.provider';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    PrismaService,
    BalanceCalculatorProvider,
  ],
})
export class TransactionsModule {}
