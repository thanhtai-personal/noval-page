import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '@/schemas/user.schema';
import { Role } from '@/schemas/role.schema';
import { RoleSlug } from '@/constants/role.enum';
import { DBNames } from '@/utils/database';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userModel: Model<User>;
  let roleModel: Model<Role>;

  const testUser = {
    email: 'e2e_user@example.com',
    password: 'test123',
    name: 'E2E User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name, DBNames.ums));
    roleModel = moduleFixture.get<Model<Role>>(getModelToken(Role.name, DBNames.ums));

    let readerRole = await roleModel.findOne({ slug: RoleSlug.READER });
    if (!readerRole) {
      readerRole = await roleModel.create({ slug: RoleSlug.READER, name: 'Reader' });
    }

    const hashed = await bcrypt.hash(testUser.password, 10);
    await userModel.create({
      email: testUser.email,
      name: testUser.name,
      password: hashed,
      role: readerRole._id,
    });
  });

  afterAll(async () => {
    await userModel.deleteMany({ email: testUser.email });
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(201);

    expect(res.body).toMatchObject({
      message: 'Login successful',
      user: {
        email: testUser.email,
        name: testUser.name,
        role: RoleSlug.READER,
      },
    });
  });

  it('/auth/login (POST) - invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: 'wrong' })
      .expect(401);
  });
});
