import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';

type CreateTransferParams = {
    accountId: string;
    amount: number;
    recipientId: string;
    description?: string;
};

export class Transfer extends Transaction {
    @ApiProperty({
        example: 'Payment',
        description: 'Description of the transfer',
    })
    readonly description?: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Id of the recipient account',
    })
    readonly recipientId: string;

    constructor(params: CreateTransferParams) {
        super({
            accountId: params.accountId,
            type: 'transfer',
            amount: params.amount,
        });

        this.description = params.description;
        this.recipientId = params.recipientId;
    }
}
