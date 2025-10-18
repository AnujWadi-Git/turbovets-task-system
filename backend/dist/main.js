/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const auth_module_1 = __webpack_require__(5);
const tasks_module_1 = __webpack_require__(13);
const organizations_module_1 = __webpack_require__(19);
const audit_interceptor_1 = __webpack_require__(21);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, tasks_module_1.TasksModule, organizations_module_1.OrganizationsModule],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
        ],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(7);
const auth_controller_1 = __webpack_require__(8);
const auth_service_1 = __webpack_require__(9);
const jwt_strategy_1 = __webpack_require__(11);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'turbovets-secret-key-2025',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(9);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        return this.authService.login(body.email, body.password);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(6);
const shared_1 = __webpack_require__(10);
// Mock users with organizations
const USERS_DB = [
    {
        id: '1',
        email: 'owner@turbovets.com',
        password: 'owner123',
        firstName: 'Owner',
        lastName: 'User',
        role: shared_1.Role.OWNER,
        organizationId: '1', // TurboVets HQ
    },
    {
        id: '2',
        email: 'admin@turbovets.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: shared_1.Role.ADMIN,
        organizationId: '2', // Engineering Department
    },
    {
        id: '3',
        email: 'user@turbovets.com',
        password: 'user123',
        firstName: 'Regular',
        lastName: 'User',
        role: shared_1.Role.USER,
        organizationId: '2', // Engineering Department
    },
    {
        id: '4',
        email: 'viewer@turbovets.com',
        password: 'viewer123',
        firstName: 'Viewer',
        lastName: 'User',
        role: shared_1.Role.VIEWER,
        organizationId: '3', // Marketing Department
    },
    {
        id: '5',
        email: 'marketing-admin@turbovets.com',
        password: 'admin123',
        firstName: 'Marketing',
        lastName: 'Admin',
        role: shared_1.Role.ADMIN,
        organizationId: '3', // Marketing Department
    },
];
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async login(email, password) {
        const user = USERS_DB.find((u) => u.email === email && u.password === password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async validateUser(userId) {
        return USERS_DB.find((u) => u.id === userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@turbovets-task-system/shared");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(7);
const passport_jwt_1 = __webpack_require__(12);
const auth_service_1 = __webpack_require__(9);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'turbovets-secret-key-2025',
        });
        this.authService = authService;
    }
    async validate(payload) {
        const user = await this.authService.validateUser(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            organizationId: payload.organizationId,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const tasks_controller_1 = __webpack_require__(14);
const tasks_service_1 = __webpack_require__(15);
const organizations_module_1 = __webpack_require__(19);
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => organizations_module_1.OrganizationsModule)],
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService],
    })
], TasksModule);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(7);
const tasks_service_1 = __webpack_require__(15);
const roles_guard_1 = __webpack_require__(17);
const roles_decorator_1 = __webpack_require__(18);
const shared_1 = __webpack_require__(10);
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    findAll(req) {
        return this.tasksService.findAll(req.user);
    }
    getAuditLog() {
        return {
            message: 'Audit logs are being recorded in the server console',
            note: 'Check your backend terminal to see all logged actions',
            example: '[AUDIT] 2025-01-15T10:30:45.123Z - admin@test.com - POST /api/tasks'
        };
    }
    findOne(id, req) {
        return this.tasksService.findOne(id, req.user);
    }
    create(data, req) {
        return this.tasksService.create(data, req.user);
    }
    update(id, data, req) {
        return this.tasksService.update(id, data, req.user);
    }
    delete(id, req) {
        return this.tasksService.delete(id, req.user);
    }
};
exports.TasksController = TasksController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('audit-log'),
    (0, roles_decorator_1.Roles)(shared_1.Role.OWNER, shared_1.Role.ADMIN),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "getAuditLog", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(shared_1.Role.OWNER, shared_1.Role.ADMIN, shared_1.Role.MANAGER, shared_1.Role.USER),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.Role.ADMIN, shared_1.Role.MANAGER, shared_1.Role.USER),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TasksController.prototype, "delete", null);
exports.TasksController = TasksController = tslib_1.__decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof tasks_service_1.TasksService !== "undefined" && tasks_service_1.TasksService) === "function" ? _a : Object])
], TasksController);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const shared_1 = __webpack_require__(10);
const organizations_service_1 = __webpack_require__(16);
// Mock tasks with organizations
let TASKS_DB = [
    {
        id: '1',
        title: 'Setup authentication system',
        description: 'Implement JWT auth with role-based access control',
        status: shared_1.TaskStatus.DONE,
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
        status: shared_1.TaskStatus.IN_PROGRESS,
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
        status: shared_1.TaskStatus.TODO,
        assigneeId: '4',
        creatorId: '5',
        organizationId: '3', // Marketing
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
    },
];
let TasksService = class TasksService {
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    findAll(user) {
        const accessibleOrgIds = this.organizationsService.getUserAccessibleOrgs(user);
        // Filter tasks by accessible organizations
        let tasks = TASKS_DB.filter((task) => accessibleOrgIds.includes(task.organizationId));
        // Further filter based on role
        if (user.role === shared_1.Role.VIEWER) {
            // Viewers only see tasks assigned to them
            tasks = tasks.filter((task) => task.assigneeId === user.userId);
        }
        else if (user.role === shared_1.Role.USER) {
            // Users see tasks they created or are assigned to
            tasks = tasks.filter((task) => task.assigneeId === user.userId || task.creatorId === user.userId);
        }
        // Owner and Admin see all tasks in their accessible orgs
        return tasks;
    }
    findOne(id, user) {
        const task = TASKS_DB.find((t) => t.id === id);
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        // Check organization access
        const accessibleOrgIds = this.organizationsService.getUserAccessibleOrgs(user);
        if (!accessibleOrgIds.includes(task.organizationId)) {
            throw new common_1.ForbiddenException('Access denied to this organization');
        }
        // Check role-based access
        if (user.role !== shared_1.Role.OWNER &&
            user.role !== shared_1.Role.ADMIN &&
            task.assigneeId !== user.userId &&
            task.creatorId !== user.userId) {
            throw new common_1.ForbiddenException('Access denied to this task');
        }
        return task;
    }
    create(data, user) {
        const newTask = {
            id: Date.now().toString(),
            title: data.title || '',
            description: data.description || '',
            status: shared_1.TaskStatus.TODO,
            assigneeId: data.assigneeId || user.userId,
            creatorId: user.userId,
            organizationId: user.organizationId, // Task belongs to user's org
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        TASKS_DB.push(newTask);
        return newTask;
    }
    update(id, data, user) {
        const taskIndex = TASKS_DB.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
            throw new common_1.NotFoundException('Task not found');
        }
        const task = TASKS_DB[taskIndex];
        // Check organization access
        const accessibleOrgIds = this.organizationsService.getUserAccessibleOrgs(user);
        if (!accessibleOrgIds.includes(task.organizationId)) {
            throw new common_1.ForbiddenException('Access denied to this organization');
        }
        // Check permission
        if (user.role !== shared_1.Role.OWNER &&
            user.role !== shared_1.Role.ADMIN &&
            task.creatorId !== user.userId &&
            task.assigneeId !== user.userId) {
            throw new common_1.ForbiddenException('You can only update your own tasks');
        }
        TASKS_DB[taskIndex] = {
            ...task,
            ...data,
            updatedAt: new Date(),
        };
        return TASKS_DB[taskIndex];
    }
    delete(id, user) {
        const taskIndex = TASKS_DB.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
            throw new common_1.NotFoundException('Task not found');
        }
        const task = TASKS_DB[taskIndex];
        // Check organization access
        const accessibleOrgIds = this.organizationsService.getUserAccessibleOrgs(user);
        if (!accessibleOrgIds.includes(task.organizationId)) {
            throw new common_1.ForbiddenException('Access denied to this organization');
        }
        // Only Owner, Admin, or task creator can delete
        if (user.role !== shared_1.Role.OWNER &&
            user.role !== shared_1.Role.ADMIN &&
            task.creatorId !== user.userId) {
            throw new common_1.ForbiddenException('Only owner, admin or task creator can delete');
        }
        TASKS_DB.splice(taskIndex, 1);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => organizations_service_1.OrganizationsService))),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof organizations_service_1.OrganizationsService !== "undefined" && organizations_service_1.OrganizationsService) === "function" ? _a : Object])
], TasksService);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
// Mock organizations database
const ORGANIZATIONS_DB = [
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
let OrganizationsService = class OrganizationsService {
    findAll() {
        return ORGANIZATIONS_DB;
    }
    findOne(id) {
        return ORGANIZATIONS_DB.find((org) => org.id === id);
    }
    findChildren(parentId) {
        return ORGANIZATIONS_DB.filter((org) => org.parentId === parentId);
    }
    isParentOrg(orgId, potentialParentId) {
        const org = this.findOne(orgId);
        if (!org)
            return false;
        if (org.parentId === potentialParentId)
            return true;
        if (org.parentId === null)
            return false;
        return this.isParentOrg(org.parentId, potentialParentId);
    }
    getUserAccessibleOrgs(user) {
        const userOrg = this.findOne(user.organizationId);
        if (!userOrg)
            return [];
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
    getTopLevelOrg(org) {
        if (org.parentId === null)
            return org;
        const parent = this.findOne(org.parentId);
        return parent ? this.getTopLevelOrg(parent) : org;
    }
    getAllOrgIdsInTree(orgId) {
        const children = this.findChildren(orgId);
        const childIds = children.flatMap((child) => this.getAllOrgIdsInTree(child.id));
        return [orgId, ...childIds];
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], OrganizationsService);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return requiredRoles.some((role) => user?.role === role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(1);
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const organizations_controller_1 = __webpack_require__(20);
const organizations_service_1 = __webpack_require__(16);
let OrganizationsModule = class OrganizationsModule {
};
exports.OrganizationsModule = OrganizationsModule;
exports.OrganizationsModule = OrganizationsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [organizations_controller_1.OrganizationsController],
        providers: [organizations_service_1.OrganizationsService],
        exports: [organizations_service_1.OrganizationsService],
    })
], OrganizationsModule);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationsController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(7);
const organizations_service_1 = __webpack_require__(16);
const roles_guard_1 = __webpack_require__(17);
let OrganizationsController = class OrganizationsController {
    constructor(organizationsService) {
        this.organizationsService = organizationsService;
    }
    findAll() {
        return this.organizationsService.findAll();
    }
    getMyAccessibleOrgs(req) {
        const orgIds = this.organizationsService.getUserAccessibleOrgs(req.user);
        return {
            organizationIds: orgIds,
            organizations: orgIds.map((id) => this.organizationsService.findOne(id)),
        };
    }
};
exports.OrganizationsController = OrganizationsController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], OrganizationsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('my-access'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getMyAccessibleOrgs", null);
exports.OrganizationsController = OrganizationsController = tslib_1.__decorate([
    (0, common_1.Controller)('organizations'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof organizations_service_1.OrganizationsService !== "undefined" && organizations_service_1.OrganizationsService) === "function" ? _a : Object])
], OrganizationsController);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditInterceptor = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const operators_1 = __webpack_require__(22);
let AuditInterceptor = class AuditInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, user } = request;
        const timestamp = new Date().toISOString();
        console.log(`[AUDIT] ${timestamp} - ${user?.email || 'Anonymous'} - ${method} ${url}`);
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                console.log(`[AUDIT] ${timestamp} - SUCCESS - ${method} ${url}`);
            },
            error: (error) => {
                console.log(`[AUDIT] ${timestamp} - FAILED - ${method} ${url} - ${error.message}`);
            },
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AuditInterceptor);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*', // Allow all origins for demo
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const port = 3000; // Changed from 3000 to 3333
    await app.listen(port);
    common_1.Logger.log(`🚀 Backend running on: http://localhost:${port}/api`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map