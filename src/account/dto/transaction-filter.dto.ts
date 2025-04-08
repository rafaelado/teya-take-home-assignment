import { IsEnum } from 'class-validator';

export enum TransactionType {
    TRANSFER = 'transfer',
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdrawal',
}

export class TransactionFilterDto {
    @IsEnum(TransactionType)
    type: TransactionType;

    constructor(type: TransactionType) {
        this.type = type;
    }
}
