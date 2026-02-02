// app/apis/role_api.js

import * as roleService from '../services/role_service.js';

export const fetchSystemRoles = async (ctx) => {
  try {
    const { id } = ctx.params; // system_id

    const roles = await roleService.fetchSystemRoles(id);

    ctx.body = {
      success: true,
      message: 'Lista de configuraciones',
      data: {
        list: roles
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

export const saveRoles = async (ctx) => {
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

    const response = await roleService.saveRoles(id, ctx.request.body);

    ctx.body = {
      success: true,
      message: 'Permisos guardados correctamente',
      data: response,
      error: '',
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      success: false,
      message: error.message || 'Error interno del servidor',
      data: null,
      error: error.error || error.message,
    };
  }
};