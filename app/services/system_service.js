import { Op } from 'sequelize';

import { formatDateTime } from '../configs/helpers.js';
import sequelize from '../../configs/database.js';
import System from '../models/system.js';
import User from '../models/user.js';

/**
 * Construye el where dinámico
 */
const buildWhere = ({ name, description }) => {
  const where = {};

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
  }

  if (description) {
    where.description = {
      [Op.like]: `%${description}%`,
    };
  }

  return where;
};
/**
 * Obtener configuraciones con paginación
 */
export const fetchSystems = async ({
  name,
  description,
  step = 10,
  page = 1,
}) => {
  const where = buildWhere({ name, description });

  const limit = Number(step);
  const offset = (Number(page) - 1) * limit;

  const systems = await System.findAll({
    where,
    limit,
    offset,
    // order: [['created', 'DESC']],
    attributes: [
      'id',
      'name',
      'description',
      'repository',
      'created',
      'updated',
    ],
  });

  return systems.map(system => {
    const data = system.toJSON();

    return {
      ...data,
      created: formatDateTime(data.created),
      updated: formatDateTime(data.updated),
    };
  });
};

/**
 * Total de páginas
 */
export const countTotalPages = async ({
  name, description, 
  step = 10,
}) => {
  const where = buildWhere({ name, description });

  const totalRecords = await System.count({ where });
  const totalPages = Math.ceil(totalRecords / Number(step));

  return { totalPages, totalRecords };
};

/**
 * Crear una nueva configuración
 */
export const createSystem = async ({
  name = null,
  description = null,
  repository = null,
}) => {
  if (!name || !description) {
    throw new Error('La clave (key) es requerida');
  }

  const newSystem = await System.create({
    name,
    description,
    repository
  });

  const data = newSystem.toJSON();

  return {
    ...data,
    created: formatDateTime(data.created),
    updated: formatDateTime(data.updated),
  };
};

/**
 * Actualizar una configuración existente
 */
export const updateSystem = async (id, {
  name,
  description,
  repository
}) => {
  const system = await System.findByPk(id);

  if (!system) {
    throw new Error('Configuración no encontrada');
  }

  if (name !== undefined) system.name = name;
  if (description !== undefined) system.description = description;
  if (repository !== undefined) system.repository = repository;

  system.updated = new Date();
  await system.save();

  const data = system.toJSON();

  return {
    ...data,
    created: formatDateTime(data.created),
    updated: formatDateTime(data.updated),
  };
};

export const deleteSystem = async (id) => {
  const system = await System.findByPk(id);

  if (!system) {
    throw new Error('Usuario no encontrado');
  }

  await system.destroy();

  return true;
};

export const fetchUsers = async ({
  systemId,
  username,
  email,
  status,
  step = 10,
  page = 1,
}) => {
  if (!systemId) {
    throw new Error('systemId es obligatorio');
  }

  const limit = Number(step);
  const offset = (Number(page) - 1) * limit;

  let where = 'WHERE 1=1';
  const replacements = {
    systemId,
    limit,
    offset,
  };

  // 🔹 Filtros opcionales
  if (typeof username === 'string' && username.trim() !== '') {
    where += ' AND users.username LIKE :username';
    replacements.username = `%${username.trim()}%`;
  }

  if (typeof email === 'string' && email.trim() !== '') {
    where += ' AND users.email LIKE :email';
    replacements.email = `%${email.trim()}%`;
  }

  if (status === '1') {
    where += ' AND su.user_id IS NOT NULL';
  } else if (status === '0') {
    where += ' AND su.user_id IS NULL';
  }

  const query = `
    SELECT
      users.id,
      users.username,
      users.email,
      users.activated,
      CASE
        WHEN su.user_id IS NOT NULL THEN 1
        ELSE 0
      END AS association_status
    FROM users
    LEFT JOIN systems_users su
      ON users.id = su.user_id
      AND su.system_id = :systemId
    ${where}
    LIMIT :limit OFFSET :offset
  `;

  return sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT,
  });
};

export const countTotalUsersPages = async ({
  systemId,
  username,
  email,
  status,
  step = 10,
}) => {
  if (!systemId) {
    throw new Error('systemId es obligatorio');
  }

  let where = 'WHERE 1=1';
  const replacements = { systemId };

  if (typeof username === 'string' && username.trim() !== '') {
    where += ' AND users.username LIKE :username';
    replacements.username = `%${username.trim()}%`;
  }

  if (typeof email === 'string' && email.trim() !== '') {
    where += ' AND users.email LIKE :email';
    replacements.email = `%${email.trim()}%`;
  }

  if (status === '1') {
    where += ' AND su.user_id IS NOT NULL';
  } else if (status === '0') {
    where += ' AND su.user_id IS NULL';
  }

  const countQuery = `
    SELECT COUNT(DISTINCT users.id) AS total
    FROM users
    LEFT JOIN systems_users su
      ON users.id = su.user_id
      AND su.system_id = :systemId
    ${where}
  `;

  const [result] = await sequelize.query(countQuery, {
    replacements,
    type: sequelize.QueryTypes.SELECT,
  });

  const totalRecords = result.total;
  const totalPages = Math.ceil(totalRecords / Number(step));

  return { totalPages, totalRecords };
};

