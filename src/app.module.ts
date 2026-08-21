import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [UserModule, AccountsModule, UsersModule, CategoriesModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
