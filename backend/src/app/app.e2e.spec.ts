import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';

describe('API Integration Tests (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // Login as owner
    const ownerResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'owner@turbovets.com',
        password: 'owner123',
      });
    ownerToken = ownerResponse.body.accessToken;

    // Login as user
    const userResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'user@turbovets.com',
        password: 'user123',
      });
    userToken = userResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/api/auth/login (POST) - should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'owner@turbovets.com',
          password: 'owner123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('owner@turbovets.com');
        });
    });

    it('/api/auth/login (POST) - should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'owner@turbovets.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Tasks - RBAC Authorization', () => {
    it('/api/tasks (GET) - should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/tasks')
        .expect(401);
    });

    it('/api/tasks (GET) - should return tasks for authenticated user', () => {
      return request(app.getHttpServer())
        .get('/api/tasks')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

it('/api/tasks (POST) - owner should create task', () => {
  return request(app.getHttpServer())
    .post('/api/tasks')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({
      title: 'E2E Test Task',
      description: 'Created by integration test',
    })
    .expect(201)
    .expect((res) => {
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('E2E Test Task');
    });
});

    it('/api/tasks (POST) - user should create task', () => {
      return request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'User Task',
          description: 'Created by regular user',
        })
        .expect(201);
    });
  });

  describe('Organizations', () => {
    it('/api/organizations (GET) - should return all organizations', () => {
      return request(app.getHttpServer())
        .get('/api/organizations')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/api/organizations/my-access (GET) - should return user accessible orgs', () => {
      return request(app.getHttpServer())
        .get('/api/organizations/my-access')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('organizationIds');
          expect(Array.isArray(res.body.organizationIds)).toBe(true);
        });
    });
  });

  describe('Audit Log', () => {
    it('/api/tasks/audit-log (GET) - admin should access audit log', () => {
      return request(app.getHttpServer())
        .get('/api/tasks/audit-log')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200);
    });

    it('/api/tasks/audit-log (GET) - user should be denied', () => {
      return request(app.getHttpServer())
        .get('/api/tasks/audit-log')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});