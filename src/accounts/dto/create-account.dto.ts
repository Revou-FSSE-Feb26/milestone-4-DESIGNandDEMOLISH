import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  E_WALLET = 'e-wallet',
}

export class CreateAccountDto {
  @IsString()
  user_id: string;

  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  balance?: number;
}

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
