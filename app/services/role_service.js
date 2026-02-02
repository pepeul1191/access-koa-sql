// app/services/role_service.js
import { formatDateTime } from '../configs/helpers.js';
import sequelize from '../../configs/database.js';
import Role from '../models/role.js';
import System from '../models/system.js';

export const fetchSystemRoles = async (systemId) => {
  if (!systemId) {
    throw new Error('El parámetro systemId es obligatorio');
  }

  const roles = await Role.findAll({
    where: { system_id: systemId },
    //order: [['created', 'DESC']],
    attributes: ['id', 'name', 'system_id', 'created', 'updated'],
    include: [
      {
        model: System,
        attributes: ['id', 'name'],
      },
    ],
  });

  return roles;
};

export const saveRoles = async (systemId, payload) => {
  const transaction = await sequelize.transaction();

  try {
    const response = [];

    const { news = [], edits = [], deletes = [] } = payload;

    // 1. Crear nuevos roles
    for (const incoming of news) {
      const role = await Role.create(
        {
          name: incoming.name,
          system_id: systemId,
          created: new Date(),
          updated: new Date(),
        },
        { transaction }
      );

      response.push({
        tmp: incoming.id,
        id: role.id.toString(),
      });
    }

    // 2. Actualizar roles existentes
    for (const incoming of edits) {
      const role = await Role.findByPk(incoming.id, { transaction });

      if (!role) {
        throw {
          status: 404,
          message: 'Permiso no encontrado',
          error: `ID ${incoming.id}`,
        };
      }

      await role.update(
        {
          name: incoming.name,
          updated: new Date(),
        },
        { transaction }
      );
    }

    // 3. Eliminar roles
    for (const idToDelete of deletes) {
      const role = await Role.findByPk(idToDelete, { transaction });

      if (!role) {
        throw {
          status: 404,
          message: 'Permiso no encontrado',
          error: `ID ${idToDelete}`,
        };
      }

      await role.destroy({ transaction });
    }

    await transaction.commit();
    return response;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
