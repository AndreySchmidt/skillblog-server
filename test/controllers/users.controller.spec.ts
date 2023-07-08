import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest'; // для запроса к эндпойнтам

const mockedUser = {
  username: 'Andrey',
  email: 'andrey@gmail.com',
  password: 'aaaa',
};

describe('Users controller', () => {
  // экземпляр приложения
  let app: INestApplication;

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

    app = testModule.createNestApplication();
    await app.init();
  });

  // создаю тестового пользователя в бд
  beforeEach(async () => {
    const user = new User();

    const hashedPassword = await bcrypt.hash(mockedUser.password, 10);

    user.username = mockedUser.username;
    user.email = mockedUser.email;
    user.password = hashedPassword;

    return user.save();
  });

  // Удалю тестового пользователя
  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
    await User.destroy({ where: { username: 'Andrey1' } });
  });

  it('Should create user', async () => {
    const newMockedUser = {
      username: 'Andrey1',
      email: 'andrey1@gmail.com',
      password: 'aaaa1',
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newMockedUser);

    // на этот момент должен создасться пользователь

    const passwordIsValid = await bcrypt.compare(
      newMockedUser.password,
      response.body.password,
    );

    // ожидание
    expect(response.body.username).toBe(newMockedUser.username);
    expect(response.body.email).toBe(newMockedUser.email);
    expect(passwordIsValid).toBe(true);
  });
});
