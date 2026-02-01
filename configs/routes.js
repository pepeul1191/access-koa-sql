// configs/routes.js
import Router from 'koa-router';
import * as appController from '../app/controllers/application_controller.js';
import * as userApis from '../app/apis/user_api.js';
import * as systemApis from '../app/apis/system_api.js';
import { requireAuth, redirectIfAuthenticated } from './middlewares.js';

const router = new Router();

/* ======================
   Rutas web
====================== */

// application
router.get('/', requireAuth, appController.home);
router.get('/systems', requireAuth, appController.home);
router.get('/users', requireAuth, appController.home);
// login
router.get('/sign-in', redirectIfAuthenticated, appController.signIn);
router.post('/sign-in', redirectIfAuthenticated, appController.login);
router.get('/sign-out', requireAuth, appController.logout);
// api/users
router.get('/api/v1/users', requireAuth, userApis.fetchAll);
router.post('/api/v1/users', requireAuth, userApis.create);
router.put('/api/v1/users/:id', requireAuth, userApis.update);
router.put('/api/v1/users/:id/password', requireAuth, userApis.updatePassword);
router.put('/api/v1/users/:id/activated', requireAuth, userApis.updateActivated);
router.put('/api/v1/users/:id/activation-key', requireAuth, userApis.updateActivationKey);
router.put('/api/v1/users/:id/reset-key', requireAuth, userApis.updateResetKey);
router.delete('/api/v1/users/:id', requireAuth, userApis.deleteR);
// api/systems
router.get('/api/v1/systems', requireAuth, systemApis.fetchAll);
router.post('/api/v1/systems', requireAuth, systemApis.create);
router.put('/api/v1/systems/:id', requireAuth, systemApis.update);
router.delete('/api/v1/systems/:id', requireAuth, systemApis.deleteR);

export default router;
