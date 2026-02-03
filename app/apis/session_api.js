// app/apis/session_api.js

export const getSession = async (ctx) => {
  try {
    const user = ctx.session.user;

    if (!user) {
      ctx.status = 401; // No autenticado
      ctx.body = {
        success: false,
        message: 'Usuario no autenticado',
        data: null,
        error: 'Error 401: No se encuentra la sesión',
      };
      return;
    }

    ctx.body = {
      success: true,
      message: 'Sesión activa',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        jwt: ctx.session.jwt,
      },
      error: '',
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};
