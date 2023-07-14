import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { databaseConfig } from 'src/config/configuration';
import { SequelizeConfigService } from 'src/config/sequelizeConfig.service';
import { User } from 'src/users/users.model';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as session from 'express-session';
import * as passport from 'passport';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentModule } from 'src/payment/payment.module';

const mockedUser = {
  username: 'Andrey',
  email: 'andrey@gmail.com',
  password: 'aaaa',
};

const mockedPay = {
  status: 'pending',
  amount: { value: '100.00', currency: 'RUB' },
};

describe('Payment controller', () => {
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
        PaymentModule,
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

  afterEach(async () => {
    // Удалю тестового пользователя
    await User.destroy({ where: { username: mockedUser.username } });
  });

  it('Should make payment', async () => {
    const login = await request(app.getHttpServer())
      .post('/users/login')
      .send({ username: mockedUser.username, password: mockedUser.password });

    const response = await request(app.getHttpServer())
      .post('/payment')
      .send({ amount: 100 })
      .set('Cookie', login.headers['set-cookie']);

    // ожидание
    expect(response.body.status).toEqual(mockedPay.status);
    expect(response.body.amount).toEqual(mockedPay.amount);
  });
});
