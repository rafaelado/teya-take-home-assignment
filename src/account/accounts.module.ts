import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { InMemoryAccountsRepository } from './repository/accounts-in-memory.repository';
import { AccountsRepository } from './repository/accounts.repository';

@Module({
    controllers: [AccountsController],
    providers: [
        AccountsService,
        {
            provide: AccountsRepository,
            useClass: InMemoryAccountsRepository,
        },
    ],
})
export class AccountsModule {}
