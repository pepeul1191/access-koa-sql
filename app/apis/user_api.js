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

export const update = async (ctx) => {
  try {
    const { id } = ctx.params;
    const { username, email } = ctx.request.body;

    if (!username && !email) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Debe enviar al menos un campo a actualizar',
        data: null,
        error: 'Campos faltantes',
      };
      return;
    }

    await userService.updateUser(id, { username, email });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Usuario actualizado correctamente',
      data: null,
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

export const updatePassword = async (ctx) => {
  try {
    const { id } = ctx.params;
    const { password } = ctx.request.body;

    if (!password) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Debe enviar la contraseña para actualizar',
        data: null,
        error: 'Campos faltantes',
      };
      return;
    }

    await userService.updateUserPassword(id, password);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Usuario actualizado correctamente',
      data: null,
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

export const updateActivated = async (ctx) => {
  try {
    const { id } = ctx.params;
    const { activated } = ctx.request.body;

    if (typeof activated !== 'boolean') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Debe enviar la contraseña para actualizar',
        data: null,
        error: 'Campos faltantes',
      };
      return;
    }

    await userService.updateActivated(id, activated);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Estado de usuario actualizado correctamente',
      data: activated,
      error: '',
    };
  } catch (error) {
    console.error(error.stack);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

export const updateActivationKey = async (ctx) => {
  try {
    const { id } = ctx.params;

    await userService.updateActivationKey(id);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Código de activación de usuario actualizado correctamente',
      data: null,
      error: '',
    };
  } catch (error) {
    console.error(error.stack);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

export const updateResetKey = async (ctx) => {
  try {
    const { id } = ctx.params;

    const user = await userService.updateResetKey(id);
    await userService.sendResetKeyEmail(user);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Correo de cambio de contraseña usuario enviado',
      data: null,
      error: '',
    };
  } catch (error) {
    console.error(error.stack);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

export const deleteR = async (ctx) => {
  try {
    const { id } = ctx.params;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de usuario requerido',
        data: null,
        error: 'ID faltante',
      };
      return;
    }

    await userService.deleteUser(id);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Usuario eliminado correctamente',
      data: null,
      error: '',
    };
  } catch (error) {
    ctx.status = error.message === 'Usuario no encontrado' ? 404 : 500;
    ctx.body = {
      success: false,
      message: error.message === 'Usuario no encontrado'
        ? 'Usuario no encontrado'
        : 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

export const assignPermissions = async (ctx) => {
  try {
    const { id } = ctx.params; // system_id

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de sistema inválido',
        data: null,
        error: '',
      };
      return;
    }

    const response = await userService.assignPermissions(id, ctx.request.body);

    ctx.body = {
      success: true,
      message: 'Permisos asignados correctamente',
      data: response,
      error: '',
    };
  } catch (error) {
    console.error(error)
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message || 'Error interno del servidor',
      data: null,
      error: error.error || error.message,
    };
  }
};

export const signInByUsername = async (ctx) => {
  try {
    const { username, password, system_id } = ctx.request.body;

    console.log(ctx.request.body)

    const response = await userService.signInByUsername({
      username,
      password,
      system_id,
    });

    ctx.body = {
      success: true,
      message: 'Inicio de sesión exitoso',
      data: response,
      error: '',
    };
  } catch (error) {
    console.error(error);
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message || 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};