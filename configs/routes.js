// configs/routes.js
import Router from 'koa-router';
import * as appController from '../app/controllers/application_controller.js';
import * as userApis from '../app/apis/user_api.js';
import { requireAuth, redirectIfAuthenticated } from './middlewares.js';

const router = new Router();

/* ======================
   Rutas web
====================== */

router.get('/', requireAuth, appController.home);
router.get('/systems', requireAuth, appController.home);
router.get('/sign-in', redirectIfAuthenticated, appController.signIn);
router.post('/sign-in', redirectIfAuthenticated, appController.login);
router.get('/sign-out', requireAuth, appController.logout);
// api/user
router.get('/api/v1/users', requireAuth, userApis.fetchAll);
router.post('/api/v1/users', requireAuth, userApis.create);
router.put('/api/v1/users/:id', requireAuth, userApis.update);
router.delete('/api/v1/users/:id', requireAuth, userApis.deleteR);

export default router;
