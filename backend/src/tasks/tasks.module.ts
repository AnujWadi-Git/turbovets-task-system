import { Module, forwardRef } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [forwardRef(() => OrganizationsModule)],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}