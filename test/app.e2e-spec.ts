import { AuthDto } from './../src/auth/dto/auth.dto';
import { INestApplication, ValidationPipe, Post } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import * as pactum from 'pactum';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333/');
  });

  afterAll(() => {
    app.close();
  });
  const dto: AuthDto = {
    email: 'abdur4082@gmail.com',
    password: '123',
  };
  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should sigin', () => {
        return pactum.spec().post('auth/signin').withBody(dto);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {});

    describe('Edit User', () => {});
  });

  describe('Bookmarks', () => {});
});
