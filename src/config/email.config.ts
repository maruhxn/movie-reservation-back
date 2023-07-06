import { registerAs } from '@nestjs/config';

/**
 * 'email'이라는 토큰으로 ConfigFactory를 등록할 수 있는 함수.
 * 이 함수를 통해 ConfigModule을 동적으로 등록.
 */
export default registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
}));
