import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
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
