export declare enum Role {
    OWNER = "owner",
    ADMIN = "admin",
    USER = "user",
    VIEWER = "viewer"
}
export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done"
}
export interface Organization {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: Date;
}
export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assigneeId: string;
    creatorId: string;
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId: string;
    result: 'success' | 'failure';
    timestamp: Date;
    metadata?: any;
}
//# sourceMappingURL=types.d.ts.map