import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET,
  kakaoClientId: process.env.KAKAO_CLIENT_ID,
  kakaoCallbackUrl: process.env.KAKAO_CALLBACK_URL,
  clientUrl: process.env.CLIENT_URL,
}));
