// app/apis/system_api.js

import * as systemService from '../services/system_service.js';

export const fetchAll = async (ctx) => {
  try {
    const { name, description, step = 10, page = 1 } = ctx.query;

    const [systems, counts] = await Promise.all([
      systemService.fetchSystems({ name, description, step, page }),
      systemService.countTotalPages({ name, description, step }),
    ]);

    if (!systems || systems.length === 0) {
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
      message: 'Lista de configuraciones',
      data: {
        list: systems,
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

/**
 * Crear nueva configuración
 */
export const create = async (ctx) => {
  try {
    const { name, description, repository } = ctx.request.body;

    if (!name || !description) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Faltan datos obligatorios',
        data: null,
        error: 'Nombre y descripción son requeridos',
      };
      return;
    }

    const system = await systemService.createSystem({ name, description, repository });

    ctx.status = 201;
    ctx.body = {
      success: true,
      message: 'Configuración creada correctamente',
      data: {
        id: system.id,
        created: system.created,
        updated: system.updated,
        pages: 1,
        total: 1,
        offset: 0,
      },
      error: '',
    };
  } catch (error) {
    console.error(error)
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

/**
 * Actualizar configuración existente
 */
export const update = async (ctx) => {
  try {
    const { id } = ctx.params;
    const { name, description, repository } = ctx.request.body;

    if (name === undefined && description === undefined) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Debe enviar al menos un campo a actualizar',
        data: null,
        error: 'Campos faltantes',
      };
      return;
    }

    const system = await systemService.updateSystem(id, { name, description, repository });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Sistema actualizada correctamente',
      data: {
        updated: system.updated
      },
      error: '',
    };
  } catch (error) {
    ctx.status = error.message === 'Sistema no encontrado' ? 404 : 500;
    ctx.body = {
      success: false,
      message: error.message === 'Sistema no encontrado'
        ? 'Sistema no encontrado'
        : 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

/**
 * Obtener configuración por key
 */
export const fetchByKey = async (ctx) => {
  try {
    const { key } = ctx.params;

    if (!key) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Key es requerida',
        data: null,
        error: 'Key faltante',
      };
      return;
    }

    const system = await systemService.getSystemByKey(key);

    if (!system) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Configuración no encontrada',
        data: null,
        error: 'Error 404',
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Configuración obtenida correctamente',
      data: system,
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

/**
 * Eliminar configuración por ID
 */
export const deleteR = async (ctx) => {
  try {
    const { id } = ctx.params;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de sistema requerido',
        data: null,
        error: 'ID faltante',
      };
      return;
    }

    await systemService.deleteSystem(id);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Sistema eliminada correctamente',
      data: null,
      error: '',
    };
  } catch (error) {
    ctx.status = error.message === 'Sistema no encontrada' ? 404 : 500;
    ctx.body = {
      success: false,
      message: error.message === 'Sistema no encontrada'
        ? 'Sistema no encontrada'
        : 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

export const fetchUsers = async (ctx) => {
  try {
    const { username, email, status,step = 10, page = 1 } = ctx.query;
    const { id } = ctx.params;

    const [users, counts] = await Promise.all([
      systemService.fetchUsers({ systemId: id, username, email, status, step, page }),
      systemService.countTotalUsersPages({ systemId: id, username, email, status, step }),
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
      message: 'Lista de usuarios del sistema',
      data: {
        list: users,
        pages: counts.totalPages,
        total: counts.totalRecords,
        offset: (Number(page) - 1) * step,
      },
      error: '',
    };
  } catch (error) {
    console.error(error)
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      data: null,
      error: error.message,
    };
  }
};

export const saveUsers = async (ctx) => {
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

    const response = await systemService.saveUsers(id, ctx.request.body);

    ctx.body = {
      success: true,
      message: 'Usuarios guardados correctamente',
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