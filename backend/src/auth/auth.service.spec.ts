import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@turbovets-task-system/shared';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return user and token for valid credentials', async () => {
      const result = await service.login('owner@turbovets.com', 'owner123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe('owner@turbovets.com');
      expect(result.user.role).toBe(Role.OWNER);
      expect(result.accessToken).toBe('mock-jwt-token');
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      await expect(
        service.login('invalid@email.com', 'password')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      await expect(
        service.login('owner@turbovets.com', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should include organizationId in response', async () => {
      const result = await service.login('admin@turbovets.com', 'admin123');

      expect(result.user.organizationId).toBeDefined();
      expect(result.user.organizationId).toBe('2');
    });
  });

  describe('validateUser', () => {
    it('should return user for valid userId', async () => {
      const user = await service.validateUser('1');

      expect(user).toBeDefined();
      expect(user.id).toBe('1');
      expect(user.email).toBe('owner@turbovets.com');
    });

    it('should return undefined for invalid userId', async () => {
      const user = await service.validateUser('999');

      expect(user).toBeUndefined();
    });
  });
});