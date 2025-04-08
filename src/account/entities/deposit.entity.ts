import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';

type CreateDepositParams = {
    accountId: string;
    amount: number;
    description?: string;
};

export class Deposit extends Transaction {
    @ApiProperty({
        example: 'Payroll deposit',
        description: 'Description of the deposit',
    })
    description?: string;

    constructor(params: CreateDepositParams) {
        super({
            accountId: params.accountId,
            type: 'deposit',
            amount: params.amount,
        });

        this.description = params.description;
    }
}
