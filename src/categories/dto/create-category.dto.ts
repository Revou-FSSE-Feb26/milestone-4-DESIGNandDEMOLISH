import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CategoryType } from '@prisma/client';

export { CategoryType };

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
