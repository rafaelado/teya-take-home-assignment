export class ForbiddenError extends Error {
    public readonly name = 'ForbiddenError';

    constructor() {
        super('Forbidden.');

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ForbiddenError);
        }
    }
}
