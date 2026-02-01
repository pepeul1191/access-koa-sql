import { Op } from 'sequelize';

import { formatDateTime } from '../configs/helpers.js';
import System from '../models/system.js';

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