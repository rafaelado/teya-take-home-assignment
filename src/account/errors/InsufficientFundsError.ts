export class InsufficientFundsError extends Error {
    public readonly name = 'InsufficientFundsError';

    constructor() {
        super('Insufficient funds to perform operation.');

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InsufficientFundsError);
        }
    }
}
