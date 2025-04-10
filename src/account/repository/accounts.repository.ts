import { Result } from 'ts-results';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';

export abstract class AccountsRepository {
    abstract findAccountById(
        accountId: string,
    ): Promise<Result<Account | null, Error>>;

    abstract createAccount(account: Account): Promise<Result<null, Error>>;

    abstract updateAccountBalance(
        accountId: string,
        newBalance: number,
    ): Promise<Result<Account, Error>>;

    abstract findTransactionsByAccountId(
        accountId: string,
        filter?: { type: string },
    ): Promise<Result<Transaction[], Error>>;

    abstract createTransaction(tx: Transaction): Promise<Result<null, Error>>;
}
