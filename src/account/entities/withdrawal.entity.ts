import { Transaction } from './transaction.entity';

type CreateWithdrawalParams = {
    accountId: string;
    amount: number;
};

export class Withdrawal extends Transaction {
    constructor(params: CreateWithdrawalParams) {
        super({
            accountId: params.accountId,
            type: 'withdrawal',
            amount: params.amount,
        });
    }
}
