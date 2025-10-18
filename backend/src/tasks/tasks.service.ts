import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Task, TaskStatus, Role } from '@turbovets-task-system/shared';
import { OrganizationsService } from '../organizations/organizations.service';

// Mock tasks with organizations
let TASKS_DB: Task[] = [
  {
    id: '1',
    title: 'Setup authentication system',
    description: 'Implement JWT auth with role-based access control',
    status: TaskStatus.DONE,
    assigneeId: '2',
    creatorId: '1',
    organizationId: '2', // Engineering
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Build task management UI',
    description: 'Create Angular components for task CRUD operations',
    status: TaskStatus.IN_PROGRESS,
    assigneeId: '3',
    creatorId: '2',
    organizationId: '2', // Engineering
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Create marketing campaign',
    description: 'Q1 2024 product launch campaign',
    status: TaskStatus.TODO,
    assigneeId: '4',
    creatorId: '5',
    organizationId: '3', // Marketing
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

@Injectable()
export class TasksService {
  constructor(
    @Inject(forwardRef(() => OrganizationsService))
    private organizationsService: OrganizationsService
  ) {}

  findAll(user: any): Task[] {
    const accessibleOrgIds =
      this.organizationsService.getUserAccessibleOrgs(user);

    // Filter tasks by accessible organizations
    let tasks = TASKS_DB.filter((task) =>
      accessibleOrgIds.includes(task.organizationId)
    );

    // Further filter based on role
    if (user.role === Role.VIEWER) {
      // Viewers only see tasks assigned to them
      tasks = tasks.filter((task) => task.assigneeId === user.userId);
    } else if (user.role === Role.USER) {
      // Users see tasks they created or are assigned to
      tasks = tasks.filter(
        (task) =>
          task.assigneeId === user.userId || task.creatorId === user.userId
      );
    }
    // Owner and Admin see all tasks in their accessible orgs

    return tasks;
  }

  findOne(id: string, user: any): Task {
    const task = TASKS_DB.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check organization access
    const accessibleOrgIds =
      this.organizationsService.getUserAccessibleOrgs(user);
    if (!accessibleOrgIds.includes(task.organizationId)) {
      throw new ForbiddenException('Access denied to this organization');
    }

    // Check role-based access
    if (
      user.role !== Role.OWNER &&
      user.role !== Role.ADMIN &&
      task.assigneeId !== user.userId &&
      task.creatorId !== user.userId
    ) {
      throw new ForbiddenException('Access denied to this task');
    }

    return task;
  }

  create(data: Partial<Task>, user: any): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title || '',
      description: data.description || '',
      status: TaskStatus.TODO,
      assigneeId: data.assigneeId || user.userId,
      creatorId: user.userId,
      organizationId: user.organizationId, // Task belongs to user's org
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    TASKS_DB.push(newTask);
    return newTask;
  }

  update(id: string, data: Partial<Task>, user: any): Task {
    const taskIndex = TASKS_DB.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException('Task not found');
    }

    const task = TASKS_DB[taskIndex];

    // Check organization access
    const accessibleOrgIds =
      this.organizationsService.getUserAccessibleOrgs(user);
    if (!accessibleOrgIds.includes(task.organizationId)) {
      throw new ForbiddenException('Access denied to this organization');
    }

    // Check permission
    if (
      user.role !== Role.OWNER &&
      user.role !== Role.ADMIN &&
      task.creatorId !== user.userId &&
      task.assigneeId !== user.userId
    ) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    TASKS_DB[taskIndex] = {
      ...task,
      ...data,
      updatedAt: new Date(),
    };
    return TASKS_DB[taskIndex];
  }

  delete(id: string, user: any): void {
    const taskIndex = TASKS_DB.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException('Task not found');
    }

    const task = TASKS_DB[taskIndex];

    // Check organization access
    const accessibleOrgIds =
      this.organizationsService.getUserAccessibleOrgs(user);
    if (!accessibleOrgIds.includes(task.organizationId)) {
      throw new ForbiddenException('Access denied to this organization');
    }

    // Only Owner, Admin, or task creator can delete
    if (
      user.role !== Role.OWNER &&
      user.role !== Role.ADMIN &&
      task.creatorId !== user.userId
    ) {
      throw new ForbiddenException('Only owner, admin or task creator can delete');
    }

    TASKS_DB.splice(taskIndex, 1);
  }
}