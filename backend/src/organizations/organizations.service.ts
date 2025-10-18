import { Injectable } from '@nestjs/common';
import { Organization } from '@turbovets-task-system/shared';

// Mock organizations database
const ORGANIZATIONS_DB: Organization[] = [
  {
    id: '1',
    name: 'TurboVets HQ',
    parentId: null,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Engineering Department',
    parentId: '1',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Marketing Department',
    parentId: '1',
    createdAt: new Date('2024-01-01'),
  },
];

@Injectable()
export class OrganizationsService {
  findAll(): Organization[] {
    return ORGANIZATIONS_DB;
  }

  findOne(id: string): Organization | undefined {
    return ORGANIZATIONS_DB.find((org) => org.id === id);
  }

  findChildren(parentId: string): Organization[] {
    return ORGANIZATIONS_DB.filter((org) => org.parentId === parentId);
  }

  isParentOrg(orgId: string, potentialParentId: string): boolean {
    const org = this.findOne(orgId);
    if (!org) return false;
    if (org.parentId === potentialParentId) return true;
    if (org.parentId === null) return false;
    return this.isParentOrg(org.parentId, potentialParentId);
  }

  getUserAccessibleOrgs(user: any): string[] {
    const userOrg = this.findOne(user.organizationId);
    if (!userOrg) return [];

    // Owner sees entire org tree
    if (user.role === 'owner') {
      const topLevelOrg = this.getTopLevelOrg(userOrg);
      return this.getAllOrgIdsInTree(topLevelOrg.id);
    }

    // Admin sees their org and children
    if (user.role === 'admin') {
      return this.getAllOrgIdsInTree(user.organizationId);
    }

    // User and Viewer only see their own org
    return [user.organizationId];
  }

  private getTopLevelOrg(org: Organization): Organization {
    if (org.parentId === null) return org;
    const parent = this.findOne(org.parentId);
    return parent ? this.getTopLevelOrg(parent) : org;
  }

  private getAllOrgIdsInTree(orgId: string): string[] {
    const children = this.findChildren(orgId);
    const childIds = children.flatMap((child) =>
      this.getAllOrgIdsInTree(child.id)
    );
    return [orgId, ...childIds];
  }
}