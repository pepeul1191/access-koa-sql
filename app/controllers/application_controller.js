// web/controllers.js
//import * as webService from './services.js';

export async function home(ctx) {
  //const data = webService.getHomeData();

  await ctx.render('application', {
    title: 'Innova ULima'
  });
}

export async function signIn(ctx) {
  console.log('Flash error set:', ctx.flash('error'));

  await ctx.render('login', {
    title: 'Iniciar Sesión'
  });
}

export async function login(ctx) {
  const { user, password } = ctx.request.body;

  const validUser = process.env.DEFAULT_USER || 'admin';
  const validPassword = process.env.DEFAULT_PASSWORD || '123';

  if (user === validUser && password === validPassword) {
    ctx.session.user = {
      id: 1,
      username: user,
      email: `${user}@ejemplo.com`,
      role: 'admin'
    };

    ctx.flash('success', '¡Bienvenido! Has iniciado sesión correctamente.');

    ctx.redirect('/');
    return;
  }

  // ❌ credenciales incorrectas
  ctx.flash('error', 'Credenciales incorrectas');

  // ✅ Extraer flash messages manualmente antes de renderizar
  const success_messages = ctx.flash('success');
  const error_messages = ctx.flash('error');
  const warning_messages = ctx.flash('warning');
  const info_messages = ctx.flash('info');

  const hasFlashMessages =
    success_messages.length > 0 ||
    error_messages.length > 0 ||
    warning_messages.length > 0 ||
    info_messages.length > 0;

  await ctx.render('login', {
    title: 'Iniciar Sesión',
    user, // Mantener el usuario en el formulario

    // Flash explícito (igual que en Express)
    success_messages,
    error_messages,
    warning_messages,
    info_messages,
    hasFlashMessages
  });
}

export async function logout(ctx) {
  try {
    ctx.session = null; // 🔥 así se destruye la sesión en Koa
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  }

  ctx.redirect('/sign-in');
}
