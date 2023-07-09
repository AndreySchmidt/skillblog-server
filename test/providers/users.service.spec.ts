import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

describe('Users service', () => {
  // экземпляр приложения
  let app: INestApplication;
  let usersService: UsersService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({ load: [databaseConfig] }),
        UsersModule,
      ],
    }).compile();

    usersService = testModule.get<UsersService>(UsersService);
    app = testModule.createNestApplication();
    await app.init();
  });

  // Удалю тестового пользователя
  afterEach(async () => {
    await User.destroy({ where: { username: 'Andrey1' } });
  });

  it('Should create user', async () => {
    const newMockedUser = {
      username: 'Andrey1',
      email: 'andrey1@gmail.com',
      password: 'aaaa1',
    };

    const user = (await usersService.create(newMockedUser)) as User;

    // на этот момент должен создасться пользователь
    const passwordIsValid = await bcrypt.compare(
      newMockedUser.password,
      user.password,
    );

    // ожидание
    expect(user.username).toBe(newMockedUser.username);
    expect(user.email).toBe(newMockedUser.email);
    expect(passwordIsValid).toBe(true);
  });
});
