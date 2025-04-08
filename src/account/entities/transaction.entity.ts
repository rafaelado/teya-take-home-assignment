import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

type createTransactionParams = {
    accountId: string;
    type: TransactionType;
    amount: number;
};

export class Transaction {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'id of the transaction',
    })
    readonly id: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'id of the account the transaction is associated with',
    })
    readonly accountId: string;

    @ApiProperty({
        example: 'Deposit',
        description: 'Type of transaction',
        enum: ['deposit', 'withdrawal', 'transfer'],
    })
    readonly type: TransactionType;

    @ApiProperty({
        example: 50,
        description: 'Amount of money involved in the transaction',
    })
    readonly amount: number;

    @ApiProperty({
        example: '2025-04-08T18:24:24.992Z',
        description: 'Date and time of the transaction',
    })
    readonly date: Date;

    constructor(params: createTransactionParams) {
        this.type = params.type;
        this.amount = params.amount;
        this.accountId = params.accountId;
        this.date = new Date();
        this.id = randomUUID();
    }
}
