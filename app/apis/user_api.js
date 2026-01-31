// app/apis/user_api.js
import * as userService from '../services/user_service.js';

export const fetchAll = async (ctx) => {
  try {
    const {
      name,
      email,
      step = 10,
      page = 1,
    } = ctx.query;

    const [users, counts] = await Promise.all([
      userService.fetchUsers({ name, email, step, page }),
      userService.countTotalPages({ name, email, step }),
    ]);

    if (!users || users.length === 0) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Recurso no encontrado',
        data: null,
        error: 'Error 404',
      };
      return;
    }

    ctx.body = {
      success: true,
      message: 'Lista de usuario',
      data: {
        list: users,
        pages: counts.totalPages,
        total: counts.totalRecords,
        offset: (Number(page) - 1) * step,
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

export const create = async (ctx) => {
  try {
    const { username, email } = ctx.request.body;

    if (!username || !email) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Faltan datos obligatorios',
        data: null,
        error: 'Username y email son requeridos',
      };
      return;
    }

    const user = await userService.createUser({ username, email });

    ctx.status = 201;
    ctx.body = {
      success: true,
      message: 'Usuario creado correctamente',
      data: {
        id: user.id,
        pages: 1,
        total: 1,
        offset: 0,
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
