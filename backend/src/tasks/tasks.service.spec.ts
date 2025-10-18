import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { Role, TaskStatus } from '@turbovets-task-system/shared';

describe('TasksService', () => {
  let service: TasksService;
  let orgsService: OrganizationsService;

  const mockOrgsService = {
    getUserAccessibleOrgs: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: OrganizationsService,
          useValue: mockOrgsService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    orgsService = module.get<OrganizationsService>(OrganizationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all tasks for owner', () => {
      const ownerUser = {
        userId: '1',
        role: Role.OWNER,
        organizationId: '1',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['1', '2', '3']);

      const tasks = service.findAll(ownerUser);

      expect(tasks.length).toBeGreaterThan(0);
      expect(mockOrgsService.getUserAccessibleOrgs).toHaveBeenCalledWith(ownerUser);
    });

    it('should filter tasks by organization for admin', () => {
      const adminUser = {
        userId: '2',
        role: Role.ADMIN,
        organizationId: '2',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['2']);

      const tasks = service.findAll(adminUser);

      expect(tasks.every(task => task.organizationId === '2')).toBe(true);
    });

    it('should return only assigned tasks for viewer', () => {
      const viewerUser = {
        userId: '4',
        role: Role.VIEWER,
        organizationId: '3',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['3']);

      const tasks = service.findAll(viewerUser);

      expect(tasks.every(task => task.assigneeId === '4')).toBe(true);
    });

    it('should return own tasks for regular user', () => {
      const regularUser = {
        userId: '3',
        role: Role.USER,
        organizationId: '2',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['2']);

      const tasks = service.findAll(regularUser);

      expect(
        tasks.every(
          task => task.assigneeId === '3' || task.creatorId === '3'
        )
      ).toBe(true);
    });
  });

  describe('create', () => {
    it('should create task with user organizationId', () => {
      const user = {
        userId: '2',
        role: Role.ADMIN,
        organizationId: '2',
      };

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const task = service.create(taskData, user);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe('Test Task');
      expect(task.organizationId).toBe('2');
      expect(task.creatorId).toBe('2');
      expect(task.status).toBe(TaskStatus.TODO);
    });
  });

  describe('update', () => {
    it('should update task if user is owner', () => {
      const ownerUser = {
        userId: '1',
        role: Role.OWNER,
        organizationId: '1',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['1', '2', '3']);

      const updated = service.update('1', { status: TaskStatus.DONE }, ownerUser);

      expect(updated.status).toBe(TaskStatus.DONE);
    });

    it('should throw ForbiddenException if user not authorized', () => {
      const user = {
        userId: '999',
        role: Role.USER,
        organizationId: '2',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['2']);

      expect(() => service.update('1', { status: TaskStatus.DONE }, user)).toThrow(
        ForbiddenException
      );
    });

    it('should throw NotFoundException if task does not exist', () => {
      const user = {
        userId: '1',
        role: Role.OWNER,
        organizationId: '1',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['1', '2', '3']);

      expect(() => service.update('999', { status: TaskStatus.DONE }, user)).toThrow(
        NotFoundException
      );
    });
  });

  describe('delete', () => {
    it('should allow owner to delete any task', () => {
      const ownerUser = {
        userId: '1',
        role: Role.OWNER,
        organizationId: '1',
      };

      mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['1', '2', '3']);

      expect(() => service.delete('1', ownerUser)).not.toThrow();
    });

it('should throw ForbiddenException if user not creator or owner', () => {
  const user = {
    userId: '999',
    role: Role.USER,
    organizationId: '2',
  };

  mockOrgsService.getUserAccessibleOrgs.mockReturnValue(['2']);

  // Use task ID '2' which exists in the org
  expect(() => service.delete('2', user)).toThrow(ForbiddenException);
});
  });
});