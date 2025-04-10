import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { Transfer } from '../entities/transfer.entity';
import { Err, Ok, Result } from 'ts-results';
import { TransactionFilterDto } from '../dto/transaction-filter.dto';

type accountId = string;

@Injectable()
export class InMemoryAccountsRepository extends AccountsRepository {
    private accounts: Map<accountId, Account> = new Map();
    private transactions: Transaction[] = [];

    async findAccountById(
        accountId: string,
    ): Promise<Result<Account | null, Error>> {
        const account = this.accounts.get(accountId);
        if (!account) return Ok(null);
        return Ok(account);
    }

    async createAccount(account: Account): Promise<Result<null, Error>> {
        this.accounts.set(account.id, account);
        return Ok(null);
    }

    async updateAccountBalance(
        accountId: string,
        newBalance: number,
    ): Promise<Result<Account, Error>> {
        const account = this.accounts.get(accountId);
        if (!account) return Err(new Error('Account not found'));

        account.balance = newBalance;
        this.accounts.set(accountId, account);
        return Ok(account);
    }

    async findTransactionsByAccountId(
        accountId: string,
        filter?: TransactionFilterDto,
    ): Promise<Result<Transaction[], Error>> {
        const txs = this.transactions.filter(
            (tx) =>
                tx.accountId === accountId ||
                accountId === (tx as Transfer)?.recipientId,
        );

        if (filter?.type) {
            return Ok(txs.filter((tx) => tx.type === filter.type));
        }

        return Ok(txs);
    }

    async createTransaction(tx: Transaction): Promise<Result<null, Error>> {
        this.transactions.push(tx);
        return Ok(null);
    }
}
