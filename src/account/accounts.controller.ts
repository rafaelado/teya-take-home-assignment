import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UsePipes,
    ValidationPipe,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException,
    ConflictException,
    Query,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { AccountNotFoundError } from './errors/AccountNotFound.error';
import { ForbiddenError } from './errors/Forbidden.error';
import { InsufficientFundsError } from './errors/InsufficientFundsError';
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Account } from './entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { Deposit } from './entities/deposit.entity';
import { Withdrawal } from './entities/withdrawal.entity';
import { Transfer } from './entities/transfer.entity';
import {
    TransactionFilterDto,
    TransactionType,
} from './dto/transaction-filter.dto';

@ApiTags('accounts')
@Controller()
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post('/accounts')
    @ApiOperation({ summary: 'Create a new account' })
    @ApiResponse({
        status: 201,
        description: 'Newly created account',
        type: Account,
    })
    createAccount() {
        try {
            return this.accountsService.createUserAccount();
        } catch (err) {
            this.handleError(err);
        }
    }

    @ApiOperation({ summary: 'Get account information' })
    @ApiResponse({
        status: 200,
        description: 'Account information',
        type: Account,
    })
    @Get('/accounts/:accountId')
    getAccount(@Param('accountId') accountId: string) {
        try {
            return this.accountsService.getUserAccount(accountId);
        } catch (err) {
            this.handleError(err);
        }
    }

    @ApiOperation({ summary: 'Get account balance' })
    @ApiResponse({
        status: 200,
        description: 'Balance of the account',
        schema: {
            type: 'object',
            properties: {
                balance: {
                    type: 'number',
                },
            },
        },
    })
    @Get('/accounts/:accountId/balance')
    async getAccountBalance(
        @Param('accountId') accountId: string,
        @Query('date') date: string,
    ) {
        try {
            const balance = await this.accountsService.getAccountBalance(
                accountId,
                date,
            );
            return { balance };
        } catch (err) {
            this.handleError(err);
        }
    }

    @ApiOperation({ summary: 'Get account transactions' })
    @ApiQuery({
        name: 'type',
        enum: TransactionType,
        enumName: 'TransactionType',
    })
    @ApiResponse({
        status: 200,
        description: 'Account transactions',
        type: [Transaction],
    })
    @Get('/accounts/:accountId/transactions')
    getAccountTransactions(
        @Param('accountId') accountId: string,
        @Query() filter: TransactionFilterDto,
    ) {
        try {
            return this.accountsService.getAccountTransactions(
                accountId,
                filter,
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    @ApiOperation({ summary: 'Make a deposit' })
    @ApiBody({
        type: [DepositDto],
        description: 'Deposit data',
    })
    @ApiResponse({
        status: 201,
        description: 'The newly created deposit',
        type: Deposit,
    })
    @Post('/accounts/:accountId/deposit')
    @UsePipes(new ValidationPipe())
    deposit(@Param('accountId') accountId: string, @Body() dto: DepositDto) {
        try {
            return this.accountsService.deposit(accountId, dto);
        } catch (err) {
            this.handleError(err);
        }
    }

    @ApiOperation({ summary: 'Withdraw money' })
    @ApiBody({
        type: [WithdrawDto],
        description: 'Deposit data',
    })
    @ApiResponse({
        status: 201,
        description: 'Withdrawal transaction',
        type: Withdrawal,
    })
    @Post('/accounts/:accountId/withdraw')
    @UsePipes(new ValidationPipe())
    async withdraw(
        @Param('accountId') accountId: string,
        @Body() dto: WithdrawDto,
    ) {
        try {
            return await this.accountsService.withdraw(accountId, dto);
        } catch (err) {
            this.handleError(err);
        }
    }

    @ApiOperation({ summary: 'Transfer money' })
    @ApiBody({
        type: [TransferDto],
        description: 'Deposit data',
    })
    @ApiResponse({
        status: 201,
        description: 'Transfer transaction',
        type: Transfer,
    })
    @Post('/accounts/:accountId/transfer')
    @UsePipes(new ValidationPipe())
    transfer(@Param('accountId') accountId: string, @Body() dto: TransferDto) {
        try {
            return this.accountsService.transfer(accountId, dto);
        } catch (err) {
            this.handleError(err);
        }
    }

    private handleError(err: unknown): never {
        if (err instanceof AccountNotFoundError) {
            throw new NotFoundException(err.message);
        }

        if (err instanceof ForbiddenError) {
            throw new ForbiddenException(err.message);
        }

        if (err instanceof InsufficientFundsError) {
            throw new ConflictException(err.message);
        }

        throw new InternalServerErrorException(
            err instanceof Error ? err.message : 'Unexpected error',
        );
    }
}
