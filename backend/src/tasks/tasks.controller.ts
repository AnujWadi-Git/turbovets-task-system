import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@turbovets-task-system/shared';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

@Get('audit-log')
@Roles(Role.OWNER, Role.ADMIN)
getAuditLog() {
  return {
    message: 'Audit logs are being recorded in the server console',
    note: 'Check your backend terminal to see all logged actions',
    example: '[AUDIT] 2025-01-15T10:30:45.123Z - admin@test.com - POST /api/tasks'
  };
}

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user);
  }

 @Post()
@Roles(Role.OWNER, Role.ADMIN, Role.MANAGER, Role.USER)
create(@Body() data: any, @Request() req) {
  return this.tasksService.create(data, req.user);
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.tasksService.update(id, data, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  delete(@Param('id') id: string, @Request() req) {
    return this.tasksService.delete(id, req.user);
  }
}