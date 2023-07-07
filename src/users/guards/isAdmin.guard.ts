import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('로그인이 필요합니다.');
    }

    if (!user.isVerified)
      throw new UnauthorizedException('이메일 인증이 필요합니다.');
    if (user.role !== 1) throw new UnauthorizedException('권한이 없습니다.');
    return user;
  }
}
