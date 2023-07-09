import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest'; // для запроса к эндпойнтам
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthModule } from 'src/auth/auth.module';

const mockedUser = {
  username: 'Andrey',
  email: 'andrey@gmail.com',
  password: 'aaaa',
};

describe('Auth controller', () => {
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
        AuthModule,
      ],
    }).compile();

    app = testModule.createNestApplication();

    app.use(
      session({
        secret: 'somesecretstring',
        resave: false,
        saveUninitialized: false,
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

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
  });

  it('Should login user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    // на этот момент должен создасться пользователь

    // ожидание
    expect(response.body.user.username).toBe(mockedUser.username);
    expect(response.body.user.email).toBe(mockedUser.email);
    expect(response.body.msg).toBe('Logged in');
  });

  it('Should login check', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const loginCheck = await request(app.getHttpServer())
      .get('/users/login-check')
      .set('Cookie', login.headers['set-cookie']);

    // на этот момент должен создасться пользователь

    // ожидание
    expect(loginCheck.body.username).toBe(mockedUser.username);
    expect(loginCheck.body.email).toBe(mockedUser.email);
  });

  it('Should logout', async () => {
    const response = await request(app.getHttpServer()).get('/users/logout');

    // ожидание
    expect(response.body.msg).toBe('session has ended');
  });
});
