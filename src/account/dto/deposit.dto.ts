import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsPositive } from 'class-validator';

export class DepositDto {
    @IsPositive()
    @ApiProperty({
        example: 1000,
        description: 'Amount to deposit',
    })
    amount: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Payroll',
        description: 'Description of the deposit',
    })
    description?: string;

    constructor(amount: number, description?: string) {
        this.amount = amount;
        this.description = description;
    }
}
