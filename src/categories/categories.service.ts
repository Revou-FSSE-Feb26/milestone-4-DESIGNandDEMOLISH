import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  private mockCategories = [
    { id: 1, name: 'Salary', type: 'income' },
    { id: 2, name: 'Groceries', type: 'expense' },
    { id: 3, name: 'Utilities', type: 'expense' },
  ];

  findAll() {
    return this.mockCategories;
  }
}
