import { ProviderType } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class UserInfo implements Omit<UserEntity, 'password'> {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  provider: ProviderType;
  snsId: string;
  role: number;
  isVerified: boolean;
  createdAt: Date;
}
