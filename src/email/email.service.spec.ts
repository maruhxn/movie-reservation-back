import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import authConfig from 'src/config/auth.config';
import emailConfig from 'src/config/email.config';
import movieConfig from 'src/config/movie.config';
import { ConfigValidationSchhma } from 'src/lib/schemas/config.schema';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [emailConfig, authConfig, movieConfig],
          isGlobal: true,
          validationSchema: ConfigValidationSchhma,
        }),
      ],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
