import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '@turbovets-task-system/shared';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    const context = createMockExecutionContext({
      user: { userId: '1', role: Role.USER },
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user has required role', () => {
    const context = createMockExecutionContext({
      user: { userId: '1', role: Role.ADMIN },
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when user does not have required role', () => {
    const context = createMockExecutionContext({
      user: { userId: '1', role: Role.USER },
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should allow owner to access admin-only routes', () => {
    const context = createMockExecutionContext({
      user: { userId: '1', role: Role.OWNER },
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.OWNER, Role.ADMIN]);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny viewer access to user routes', () => {
    const context = createMockExecutionContext({
      user: { userId: '1', role: Role.VIEWER },
    });

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.USER, Role.ADMIN]);

    expect(guard.canActivate(context)).toBe(false);
  });

  function createMockExecutionContext(request: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;
  }
});