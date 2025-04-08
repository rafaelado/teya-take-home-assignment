import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsPositive } from 'class-validator';

export class TransferDto {
    @IsPositive()
    @ApiProperty({
        example: 1000,
        description: 'Amount to transfer',
    })
    amount: number;

    @IsString()
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Recipient account ID',
    })
    recipientId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Transfer for services rendered',
        description: 'Description of the transfer',
    })
    description?: string;

    constructor(amount: number, recipientId: string, description?: string) {
        this.amount = amount;
        this.recipientId = recipientId;
        this.description = description;
    }
}
