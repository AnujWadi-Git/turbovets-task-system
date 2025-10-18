import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { TasksModule } from '../tasks/tasks.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';

@Module({
  imports: [AuthModule, TasksModule, OrganizationsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}