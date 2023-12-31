import { ApiProperty } from '@nestjs/swagger';
import { ProviderType, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ReservationEntity } from 'src/reservations/entities/reservation.entity';
export class UserEntity implements User {
  constructor({ reservations, ...data }: Partial<UserEntity>) {
    Object.assign(this, data);
    if (reservations)
      this.reservations = reservations.map(
        (reservation) => new ReservationEntity(reservation),
      );
  }
  @ApiProperty({
    description: '고유 유저 아이디',
  })
  id: string;
  @ApiProperty({
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    description: '유저 이메일',
  })
  email: string;
  @ApiProperty({
    description: '유저 전화번호',
  })
  phone: string;

  @ApiProperty({
    description: '유저 비밀번호, OAuth 로그인 시 null',
  })
  @Exclude()
  password: string | null;

  @ApiProperty({
    description: '유저 프로필 이미지',
  })
  image: string | null;

  @ApiProperty({
    description: '로그인 타입',
  })
  provider: ProviderType;

  @ApiProperty({
    description: 'OAuth 로그인 시 SNS ID',
  })
  snsId: string;

  @ApiProperty({
    description: '유저 권한 정보',
  })
  role: number;

  @ApiProperty({
    description: '이메일 인증 여부',
  })
  isVerified = false;

  @ApiProperty({
    description: '계정 생성 시각',
  })
  createdAt: Date;

  @ApiProperty({
    nullable: true,
    required: false,
    description: '예매 내역',
  })
  reservations?: ReservationEntity[];
}
