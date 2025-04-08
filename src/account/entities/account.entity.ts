import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class Account {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'id of the account',
    })
    id: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'id of the user account is associated with',
    })
    userId: string;

    @ApiProperty({
        example: 1000,
        description: 'account balance',
    })
    balance: number;

    constructor(userId: string) {
        this.userId = userId;
        this.balance = 0;
        this.id = randomUUID();
    }
}
