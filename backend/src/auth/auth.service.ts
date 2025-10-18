import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@turbovets-task-system/shared';

// Mock users with organizations
const USERS_DB = [
  {
    id: '1',
    email: 'owner@turbovets.com',
    password: 'owner123',
    firstName: 'Owner',
    lastName: 'User',
    role: Role.OWNER,
    organizationId: '1', // TurboVets HQ
  },
  {
    id: '2',
    email: 'admin@turbovets.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: Role.ADMIN,
    organizationId: '2', // Engineering Department
  },
  {
    id: '3',
    email: 'user@turbovets.com',
    password: 'user123',
    firstName: 'Regular',
    lastName: 'User',
    role: Role.USER,
    organizationId: '2', // Engineering Department
  },
  {
    id: '4',
    email: 'viewer@turbovets.com',
    password: 'viewer123',
    firstName: 'Viewer',
    lastName: 'User',
    role: Role.VIEWER,
    organizationId: '3', // Marketing Department
  },
  {
    id: '5',
    email: 'marketing-admin@turbovets.com',
    password: 'admin123',
    firstName: 'Marketing',
    lastName: 'Admin',
    role: Role.ADMIN,
    organizationId: '3', // Marketing Department
  },
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = USERS_DB.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
      accessToken: token,
    };
  }

  async validateUser(userId: string) {
    return USERS_DB.find((u) => u.id === userId);
  }
}