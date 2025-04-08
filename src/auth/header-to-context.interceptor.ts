import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClsService, ClsStore } from 'nestjs-cls';

export interface RequestContext extends ClsStore {
    userId: string;
}

@Injectable()
export class HeaderToContextInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const userId = request.headers['user-id'];

        if (!userId) {
            throw new UnauthorizedException('Missing user-id header');
        }

        this.cls.set('userId', userId);

        return next.handle();
    }
}
