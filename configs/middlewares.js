// configs/middleware.js
import jwt from 'jsonwebtoken';

export async function notFoundHandler(ctx) {
  const isApiRequest = ctx.path.startsWith('/api/');

  ctx.status = 404;

  if (isApiRequest) {
    ctx.body = {
      success: false,
      message: 'Recurso no encontrado',
      data: null,
      error: 'Error 404'
    };
    return;
  }

  if (ctx.method === 'GET') {
    await ctx.render('404', {
      title: 'Página no encontrada',
      message: 'La página que buscas no existe.'
    });
    return;
  }

  ctx.body = {
    success: false,
    message: 'Recurso no encontrado',
    data: null,
    error: 'Error 404'
  };
}

export function errorHandler(err, ctx) {
  console.error('Error:', err.stack || err);

  const statusCode = err.statusCode || 500;
  const isApiRequest = ctx.path.startsWith('/api/');

  ctx.status = statusCode;

  if (isApiRequest) {
    ctx.body = {
      success: false,
      message: err.message || 'Error interno del servidor',
      data: null,
      error: `Error ${statusCode}`
    };
    return;
  }

  ctx.render('error', {
    title: 'Error',
    message: err.message || 'Ha ocurrido un error inesperado.',
    statusCode
  });
}

export async function requireAuth(ctx, next) {
  const isApiRequest = ctx.path.startsWith('/api/');
  const isAuthenticated =
    ctx.session?.user?.id;

  if (isAuthenticated) {
    await next();
    return;
  }

  if (ctx.path === '/') {
    ctx.redirect('/sign-in');
    return;
  }

  if (isApiRequest || ctx.method !== 'GET') {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: 'Acceso no autorizado',
      data: null,
      error: 'Error 401: No autenticado'
    };
    return;
  }

  ctx.status = 401;
  await ctx.render('401', {
    title: 'Acceso no autorizado',
    message: 'Debes iniciar sesión para acceder a esta página.',
    statusCode: 401
  });
}

export async function redirectIfAuthenticated(ctx, next) {
  const isAuthenticated =
    ctx.session?.user?.id;

  const isAuthRoute = [
    '/sign-in',
    '/sign-up',
    '/login',
    '/register',
    '/reset-password'
  ].includes(ctx.path);

  if (isAuthenticated && isAuthRoute) {
    ctx.redirect('/');
    return;
  }

  await next();
}

export const headers = async (ctx, next) => {
  ctx.set('X-Powered-By', 'Koa'); // Agregar una cabecera personalizada
  ctx.set('Server', 'Ubuntu'); // Identificar el servidor

  // Permitir CORS (la variable CORS_ORIGIN puede ser '*' o lista separada por comas)
  const raw = process.env.CORS_ORIGIN || '*';
  const allowed = raw.split(',').map(s => s.trim()).filter(Boolean);
  const requestOrigin = ctx.get('Origin');

  if (allowed.includes('*')) {
    ctx.set('Access-Control-Allow-Origin', '*');
  } else if (requestOrigin && allowed.includes(requestOrigin)) {
    ctx.set('Access-Control-Allow-Origin', requestOrigin);
  }

  ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // Responder preflight automáticamente
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }

  await next(); // Continuar con la siguiente función middleware o ruta
};

export const authTrigger = async (ctx, next) => {
  const authHeader = ctx.get('X-Auth-Trigger'); // obtiene el header
  const expectedAuth = process.env.AUTH_HEADER;

  // console.log('1 +++++++++++++++++++++++++++');
  // console.log(authHeader);
  // console.log(expectedAuth);
  // console.log('2 +++++++++++++++++++++++++++');

  // Validar existencia y valor
  if (!authHeader || authHeader !== expectedAuth) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: 'Acceso no autorizado',
      data: null,
      error: 'Error 401: No autenticado'
    };
    return;
  }

  // Si todo está OK, continúa
  await next();
};

export async function validateJWT(ctx, next) {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: 'Token no proporcionado',
      data: null,
      error: 'Error 401: No autenticado'
    };
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica el token con la clave secreta
    const SECRET_KEY = process.env.JWT_SECRET || 'tu_secreto';
    const decoded = jwt.verify(token, SECRET_KEY);

    // Guardar información del usuario en ctx.state para rutas siguientes
    ctx.state.user = decoded;

    await next();
  } catch (err) {
    console.error(err);
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: 'Token inválido o expirado',
      data: null,
      error: 'Error 401: No autenticado'
    };
  }
}