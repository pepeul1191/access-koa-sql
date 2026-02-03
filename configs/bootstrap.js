// configs/bootstrap.js
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import morgan from 'koa-morgan';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import views from 'koa-views';
import serve from 'koa-static';
import flash from 'koa-connect-flash';

import appRoutes from './routes.js';
import { notFoundHandler, errorHandler, headers } from './middlewares.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function bootstrap(app) {
  /* ======================
     Config base
  ====================== */
  app.keys = [
    process.env.SESSION_SECRET ||
    'secreto-super-seguro-cambiar-en-produccion'
  ];

  /* ======================
     Logs y headers
  ====================== */
  app.use(morgan('dev'));
  app.use(headers);

  /* ======================
     Body parsers
  ====================== */
  app.use(bodyParser());

  /* ======================
     Sesiones
  ====================== */
  app.use(session({
    key: 'koa:sess',
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    renew: false
  }, app));

  app.use(flash());

  /* ======================
     Flash → vistas
  ====================== */
  app.use(async (ctx, next) => {
    ctx.state.success_messages = ctx.flash('success');
    ctx.state.error_messages = ctx.flash('error');
    ctx.state.warning_messages = ctx.flash('warning');
    ctx.state.info_messages = ctx.flash('info');

    ctx.state.hasFlashMessages =
      ctx.state.success_messages.length > 0 ||
      ctx.state.error_messages.length > 0 ||
      ctx.state.warning_messages.length > 0 ||
      ctx.state.info_messages.length > 0;

    await next();
  });

  /* ======================
     Vistas (EJS)
  ====================== */
  app.use(views(
    path.join(__dirname, '../views'),
    { extension: 'ejs' }
  ));

  /* ======================
     Archivos estáticos
  ====================== */
  app.use(serve(
    path.join(__dirname, '../public')
  ));

  /* ======================
     Variables globales
  ====================== */
  app.context.siteTitle =
    process.env.SITE_TITLE || 'Mi sitio web';

  app.context.adminEmail =
    process.env.ADMIN_EMAIL || 'admin@ejemplo.com';

  /* ======================
     Rutas
  ====================== */
  app.use(appRoutes.routes());
  app.use(appRoutes.allowedMethods());

  /* ======================
     404 + errores
  ====================== */
  app.use(notFoundHandler);
  app.on('error', errorHandler);
}
