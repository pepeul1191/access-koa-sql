import * as permissionService from '../services/permission_service.js';

/**
 * Obtener permisos por rol
 * GET /apis/v1/permissions/:id
 */
export const fetchRolePermission = async (ctx) => {
  try {
    const { id } = ctx.params; // role_id

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de rol inválido',
        data: null,
        error: '',
      };
      return;
    }

    const permissions = await permissionService.fetchRolePermissions(id);

    ctx.body = {
      success: true,
      message: 'Lista de permisos',
      data: {
        list: permissions,
      },
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

/**
 * Crear / actualizar / eliminar permisos
 * POST /apis/v1/permissions/:id
 */
export const savePermissions = async (ctx) => {
  try {
    const { id } = ctx.params; // role_id

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de rol inválido',
        data: null,
        error: '',
      };
      return;
    }

    const response = await permissionService.savePermissions(id, ctx.request.body);

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
