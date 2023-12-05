import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'asd@asd.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email,
        password: 'asd',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'test@test.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email,
        password: 'test',
      })
      .expect(201);

    // get the cookie
    const cookie = res.get('Set-Cookie');

    const {body} = await request(app.getHttpServer())
    .get('/auth/currentUser')
    .set("Cookie",cookie)
    .expect(200)

    expect(body.email).toEqual(email)
  });
});
