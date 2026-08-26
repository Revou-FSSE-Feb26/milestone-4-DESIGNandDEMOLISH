import { Provider } from '@nestjs/common';

export const BALANCE_CALCULATOR_TOKEN = 'BALANCE_CALCULATOR_TOKEN';

export class BalanceCalculatorService {
  calculateNewBalance(
    currentBalance: number,
    amount: number,
    type: 'INCOME' | 'EXPENSE',
  ): number {
    return type === 'INCOME'
      ? currentBalance + amount
      : currentBalance - amount;
  }
}

export const BalanceCalculatorProvider: Provider = {
  provide: BALANCE_CALCULATOR_TOKEN,
  useClass: BalanceCalculatorService,
};
