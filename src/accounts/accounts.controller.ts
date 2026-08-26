import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.accountsService.create(createAccountDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.accountsService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const account = await this.accountsService.findOne(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.userId !== req.user.userId) {
      throw new ForbiddenException('You do not own this account');
    }
    return account;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const account = await this.accountsService.findOne(id);
    if (account.userId !== req.user.userId) {
      throw new ForbiddenException('You do not own this account');
    }
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const account = await this.accountsService.findOne(id);
    if (account.userId !== req.user.userId) {
      throw new ForbiddenException('You do not own this account');
    }
    return this.accountsService.remove(id);
  }
}
