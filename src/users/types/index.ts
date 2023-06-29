import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({ example: 'SomeName' })
  username: string;
  @ApiProperty({ example: 'shfdlkjdshfdi843' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      user: {
        userId: '1',
        username: 'Ivan',
        password: 'aaa',
      },
    },
  })
  user: {
    userId: number;
    username: string;
    password: string;
  };
  @ApiProperty({ example: 'Logged in' })
  msg: string;
}

export class LogoutUserResponse {
  @ApiProperty({ example: 'Session has ended' })
  msg: string;
}

export class LoginCheckResponse {
  @ApiProperty({ example: '2' })
  userId: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({ example: 'ivan@gmail.com' })
  email: string;
}

export class SignupResponse {
  @ApiProperty({ example: '2' })
  id: number;

  @ApiProperty({ example: 'Ivan' })
  username: string;

  @ApiProperty({
    example: 'shdafjasdkjfld;kjdfshjsl;djka;lkdsfhjkldsahfkhsdjfkajuydtgsiuaoi',
  })
  password: string;

  @ApiProperty({ example: 'ivan@gmail.com' })
  email: string;

  @ApiProperty({ example: '2023-09-17T12:23:12:11.502Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-09-17T12:23:12:11.502Z' })
  createdAt: string;
}
