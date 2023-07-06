import { registerAs } from '@nestjs/config';

export default registerAs('movie', () => ({
  movieApi: process.env.MOVIE_API_KEY,
}));
