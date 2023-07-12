import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ProviderType } from '@prisma/client';
import { Strategy } from 'passport-kakao';
import authConfig from 'src/config/auth.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {
    super({
      clientID: config.kakaoClientId,
      callbackURL: config.kakaoCallbackUrl,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJSON = profile._json;
    const exUser = await this.usersService.findByEmail(
      profileJSON.kakao_account.email,
    );

    if (exUser && exUser.provider === ProviderType.LOCAL)
      throw new UnprocessableEntityException(
        '해당 계정으로 가입한 이메일이 존재합니다.',
      );

    if (!exUser) {
      const data = {
        email: profileJSON.kakao_account.email as string,
        image: profileJSON.properties.profile_image as string,
        name: profile.displayName as string,
        snsId: profile.id + '',
        provider: ProviderType.KAKAO,
      };
      const kakaoUser = await this.usersService.createUserWithKakao(data);

      const kakaoUserPayload = {
        email: kakaoUser.email,
        name: kakaoUser.name,
        userId: kakaoUser.id,
      };

      return done(null, kakaoUserPayload);
    }

    const exUserPayload = {
      email: exUser.email,
      name: exUser.name,
      userId: exUser.id,
    };
    return done(null, exUserPayload);
  }
}
