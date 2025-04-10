import { Injectable } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { ClsService } from 'nestjs-cls';
import { RequestContext } from 'src/auth/header-to-context.interceptor';
import { Account } from './entities/account.entity';
import { WithdrawDto } from './dto/withdraw.dto';
import { Withdrawal } from './entities/withdrawal.entity';
import { Deposit } from './entities/deposit.entity';
import { TransferDto } from './dto/transfer.dto';
import { Transfer } from './entities/transfer.entity';
import { Err, Ok, Result } from 'ts-results';
import { Transaction } from './entities/transaction.entity';
import { AccountNotFoundError } from './errors/AccountNotFound.error';
import { ForbiddenError } from './errors/Forbidden.error';
import { AccountsRepository } from './repository/accounts.repository';
import { InsufficientFundsError } from './errors/InsufficientFundsError';
import { TransactionFilterDto } from './dto/transaction-filter.dto';

@Injectable()
export class AccountsService {
    constructor(
        private readonly accountsRepository: AccountsRepository,
        private readonly cls: ClsService<RequestContext>,
    ) {}

    async getAccountTransactions(
        accountId: string,
        filter: TransactionFilterDto,
    ): Promise<Transaction[]> {
        const txsResult =
            await this.accountsRepository.findTransactionsByAccountId(
                accountId,
                filter,
            );
        if (txsResult.err) {
            throw txsResult.val;
        }

        return txsResult.val;
    }

    async getUserAccount(accountId: string): Promise<Account> {
        const accountResult = await this.getAuthorizedAccount(accountId);
        if (accountResult.err) {
            throw accountResult.val;
        }
        const account = accountResult.val;

        return account;
    }

    async getAccountBalance(accountId: string, date?: string): Promise<number> {
        if (date) {
            const txsResult =
                await this.accountsRepository.findTransactionsByAccountId(
                    accountId,
                );
            if (txsResult.err) {
                throw txsResult.val;
            }
            const txs = txsResult.val;
            console.log(txs);

            return txs.reduce((balance, tx) => {
                console.log(
                    this.toTimestamp(tx.date.toDateString()),
                    this.toTimestamp(date),
                );
                if (
                    this.toTimestamp(tx.date.toDateString()) <=
                    this.toTimestamp(date)
                ) {
                    if (tx instanceof Withdrawal) {
                        return balance - tx.amount;
                    }
                    if (tx instanceof Deposit) {
                        return balance + tx.amount;
                    }
                    if (tx instanceof Transfer) {
                        if (tx.accountId === accountId) {
                            return balance - tx.amount;
                        } else if (tx.recipientId === accountId) {
                            return balance + tx.amount;
                        }
                    }
                }
                return balance;
            }, 0);
        }
        const accountResult = await this.getAuthorizedAccount(accountId);
        if (accountResult.err) {
            throw accountResult.val;
        }
        const account = accountResult.val;

        return account.balance;
    }

    private toTimestamp(strDate: string) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }

    async createUserAccount(): Promise<Account> {
        const userId = this.cls.get('userId');

        const account = new Account(userId);

        (await this.accountsRepository.createAccount(account)).unwrap();

        return account;
    }

    async withdraw(accountId: string, dto: WithdrawDto): Promise<Withdrawal> {
        const accountResult = await this.getAuthorizedAccount(accountId);
        if (accountResult.err) {
            throw accountResult.val;
        }
        const account = accountResult.val;

        if (dto.amount > account.balance) {
            throw new InsufficientFundsError();
        }

        const withdrawal = new Withdrawal({
            accountId: account.id,
            amount: dto.amount,
        });
        this.accountsRepository.createTransaction(withdrawal);

        this.accountsRepository.updateAccountBalance(
            account.id,
            account.balance - dto.amount,
        );

        return withdrawal;
    }

    async deposit(accountId: string, dto: DepositDto): Promise<Deposit> {
        const accountResult = await this.getAuthorizedAccount(accountId);
        if (accountResult.err) {
            throw accountResult.val;
        }
        const account = accountResult.val;

        const deposit = new Deposit({
            accountId: account.id,
            amount: dto.amount,
            description: dto.description,
        });
        this.accountsRepository.createTransaction(deposit);
        this.accountsRepository.updateAccountBalance(
            account.id,
            account.balance + dto.amount,
        );

        return deposit;
    }

    async transfer(accountId: string, dto: TransferDto): Promise<Transfer> {
        const accountResult = await this.getAuthorizedAccount(accountId);
        if (accountResult.err) {
            throw accountResult.val;
        }
        const account = accountResult.val;

        const recipientAccountResult =
            await this.accountsRepository.findAccountById(dto.recipientId);
        const recipientAccount = recipientAccountResult.unwrap();
        if (!recipientAccount) {
            throw new AccountNotFoundError(dto.recipientId);
        }

        if (dto.amount > account.balance) {
            throw new InsufficientFundsError();
        }

        const transfer = new Transfer({
            accountId: account.id,
            amount: dto.amount,
            description: dto.description,
            recipientId: dto.recipientId,
        });

        (await this.accountsRepository.createTransaction(transfer)).unwrap;
        (
            await this.accountsRepository.updateAccountBalance(
                account.id,
                account.balance - dto.amount,
            )
        ).unwrap();
        (
            await this.accountsRepository.updateAccountBalance(
                dto.recipientId,
                recipientAccount.balance + dto.amount,
            )
        ).unwrap();

        return transfer;
    }

    private async getAuthorizedAccount(
        accountId: string,
    ): Promise<Result<Account, Error>> {
        const userId = this.cls.get('userId');
        const accountResult =
            await this.accountsRepository.findAccountById(accountId);

        if (accountResult.err) return accountResult;
        const account = accountResult.val;

        if (!account) return Err(new AccountNotFoundError(accountId));
        if (account.userId !== userId) return Err(new ForbiddenError());

        return Ok(account);
    }
}
