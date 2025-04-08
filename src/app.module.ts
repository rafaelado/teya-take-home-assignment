import { Module } from '@nestjs/common';
import { AccountsModule } from './account/accounts.module';
import { ClsModule } from 'nestjs-cls';

@Module({
    imports: [
        AccountsModule,
        ClsModule.forRoot({
            global: true,
            middleware: { mount: true },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
