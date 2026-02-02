import sequelize from '../../configs/database.js';
import Permission from '../models/permission.js';
import Role from '../models/role.js';

/**
 * Obtener permisos por rol
 */
export const fetchRolePermissions = async (roleId) => {
  if (!roleId) {
    throw new Error('El parámetro roleId es obligatorio');
  }

  const permissions = await Permission.findAll({
    where: { role_id: roleId },
    attributes: ['id', 'name', 'role_id', 'created', 'updated'],
    include: [
      {
        model: Role,
        attributes: ['id', 'name'],
      },
    ],
  });

  return permissions;
};

/**
 * Crear / editar / eliminar permisos
 */
export const savePermissions = async (roleId, payload) => {
  const transaction = await sequelize.transaction();

  try {
    const response = [];
    const { news = [], edits = [], deletes = [] } = payload;

    // 1. Crear nuevos permisos
    for (const incoming of news) {
      const permission = await Permission.create(
        {
          name: incoming.name,
          role_id: roleId,
          created: new Date(),
          updated: new Date(),
        },
        { transaction }
      );

      response.push({
        tmp: incoming.id,
        id: permission.id.toString(),
      });
    }

    // 2. Actualizar permisos existentes
    for (const incoming of edits) {
      const permission = await Permission.findByPk(incoming.id, { transaction });

      if (!permission) {
        throw {
          status: 404,
          message: 'Permiso no encontrado',
          error: `ID ${incoming.id}`,
        };
      }

      await permission.update(
        {
          name: incoming.name,
          updated: new Date(),
        },
        { transaction }
      );
    }

    // 3. Eliminar permisos
    for (const idToDelete of deletes) {
      const permission = await Permission.findByPk(idToDelete, { transaction });

      if (!permission) {
        throw {
          status: 404,
          message: 'Permiso no encontrado',
          error: `ID ${idToDelete}`,
        };
      }

      await permission.destroy({ transaction });
    }

    await transaction.commit();
    return response;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
