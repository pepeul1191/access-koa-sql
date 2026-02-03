// configs/routes.js
import Router from 'koa-router';
import * as appController from '../app/controllers/application_controller.js';
import * as userApis from '../app/apis/user_api.js';
import * as systemApis from '../app/apis/system_api.js';
import * as roleApis from '../app/apis/role_api.js';
import * as permissionApis from '../app/apis/permission_api.js';
import { requireAuth, redirectIfAuthenticated } from './middlewares.js';

const router = new Router();

// application
router.get('/', requireAuth, appController.home);
router.get('/systems', requireAuth, appController.home);
router.get('/users', requireAuth, appController.home);
router.get('/systems/:id/users', requireAuth, appController.home);
// login
router.get('/sign-in', redirectIfAuthenticated, appController.signIn);
router.post('/sign-in', redirectIfAuthenticated, appController.login);
router.get('/sign-out', requireAuth, appController.logout);
// users
router.get('/api/v1/users', requireAuth, userApis.fetchAll);
router.post('/api/v1/users', requireAuth, userApis.create);
router.put('/api/v1/users/:id', requireAuth, userApis.update);
router.put('/api/v1/users/:id/password', requireAuth, userApis.updatePassword);
router.put('/api/v1/users/:id/activated', requireAuth, userApis.updateActivated);
router.put('/api/v1/users/:id/activation-key', requireAuth, userApis.updateActivationKey);
router.put('/api/v1/users/:id/reset-key', requireAuth, userApis.updateResetKey);
router.post('/api/v1/users/:id/permissions', requireAuth, userApis.assignPermissions);
router.delete('/api/v1/users/:id', requireAuth, userApis.deleteR);
// systems
router.get('/api/v1/systems', requireAuth, systemApis.fetchAll);
router.post('/api/v1/systems', requireAuth, systemApis.create);
router.put('/api/v1/systems/:id', requireAuth, systemApis.update);
router.delete('/api/v1/systems/:id', requireAuth, systemApis.deleteR);
router.get('/api/v1/systems/:id/users', requireAuth, systemApis.fetchUsers);
router.post('/api/v1/systems/:id/users', requireAuth, systemApis.saveUsers);
router.get('/api/v1/systems/:id/roles', requireAuth, roleApis.fetchSystemRoles);
// permissions
router.post('/api/v1/permissions/:id', requireAuth, permissionApis.savePermissions);
// roles
router.get('/api/v1/roles/:id/permissions', requireAuth, permissionApis.fetchRolePermission);
router.post('/api/v1/roles/:id', requireAuth, roleApis.saveRoles);
router.get('/api/v1/roles/:role_id/users/:user_id', requireAuth, permissionApis.listUserPermissionsByRole)


export default router;
