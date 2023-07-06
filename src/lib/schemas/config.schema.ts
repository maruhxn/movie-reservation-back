import * as Joi from 'joi';

export const ConfigValidationSchhma = Joi.object({
  DATABASE_URL: Joi.string().required(),
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri(),
  JWT_SECRET: Joi.string().required(),
  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_CALLBACK_URL: Joi.string().uri().required(),
  MOVIE_API_KEY: Joi.string().required(),
  CLIENT_URL: Joi.string().uri().required(),
});
