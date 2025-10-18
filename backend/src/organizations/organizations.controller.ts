import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationsService } from './organizations.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@turbovets-task-system/shared';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get('my-access')
  getMyAccessibleOrgs(@Request() req) {
    const orgIds = this.organizationsService.getUserAccessibleOrgs(req.user);
    return {
      organizationIds: orgIds,
      organizations: orgIds.map((id) =>
        this.organizationsService.findOne(id)
      ),
    };
  }
}