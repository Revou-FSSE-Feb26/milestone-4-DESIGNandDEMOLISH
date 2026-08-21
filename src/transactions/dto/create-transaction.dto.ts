import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsISO8601,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export class CreateTransactionDto {
  @IsString()
  account_id: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsISO8601()
  transaction_date: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
