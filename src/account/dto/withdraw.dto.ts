import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class WithdrawDto {
    @IsPositive()
    @ApiProperty({
        example: 100,
        description: 'Amount to withdraw',
    })
    amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }
}
