import { Transfer } from '../entities/transfer.entity';
import { Deposit } from '../entities/deposit.entity';
import { Withdrawal } from '../entities/withdrawal.entity';

export type TransactionsResponseDto = (Transfer | Deposit | Withdrawal)[];
