import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    example: '황규하',
    description: '닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: '1234',
    description: '비밀번호',
  })
  password: string;
}
