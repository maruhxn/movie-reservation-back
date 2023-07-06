import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from '../user-info';

@Injectable()
export class IsEmailVerifiedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return this.checkIsVerified(req.user as UserInfo);
  }

  async checkIsVerified(user: UserInfo): Promise<boolean> {
    const exUser = await this.prisma.user.findFirst({
      where: { id: user.userId },
    });
    if (!exUser.isVerified)
      throw new UnauthorizedException('이메일 인증이 필요합니다.');

    return true;
  }
}
