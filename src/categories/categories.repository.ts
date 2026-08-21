import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesRepository {
  private mockCategories = [
    { id: 1, name: 'Salary', type: 'income' },
    { id: 2, name: 'Groceries', type: 'expense' },
  ];
  private idCounter = 3;

  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = { id: this.idCounter++, ...createCategoryDto };
    this.mockCategories.push(newCategory);
    return newCategory;
  }

  findAll() {
    return this.mockCategories;
  }

  findOne(id: number) {
    return this.mockCategories.find((c) => c.id === id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const index = this.mockCategories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.mockCategories[index] = {
      ...this.mockCategories[index],
      ...updateCategoryDto,
    };
    return this.mockCategories[index];
  }

  remove(id: number) {
    const index = this.mockCategories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.mockCategories.splice(index, 1);
    return true;
  }
}
