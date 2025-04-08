export class AccountNotFoundError extends Error {
    public readonly name = 'AccountNotFoundError';

    constructor(accountId?: string) {
        const message = accountId
            ? `Account with ID "${accountId}" not found.`
            : 'Account not found.';
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AccountNotFoundError);
        }
    }
}
