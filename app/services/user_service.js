// app/services/user_service.js
import { Op } from 'sequelize';
import bcrypt from 'bcrypt'; // si quieres generar password hash

import { formatDateTime } from '../configs/helpers.js';
import User from '../models/user.js';

const buildWhere = ({ name, email }) => {
  const where = {};

  if (name) {
    where.username = {
      [Op.like]: `%${name}%`,
    };
  }

  if (email) {
    where.email = {
      [Op.like]: `%${email}%`,
    };
  }

  return where;
};

export const fetchUsers = async ({
  name,
  email,
  step = 10,
  page = 1,
}) => {
  const where = buildWhere({ name, email });

  const limit = Number(step);
  const offset = (Number(page) - 1) * limit;

  const users = await User.findAll({
    where,
    limit,
    offset,
    //order: [['created', 'DESC']],
    attributes: [
      'id',
      'username',
      'email',
      'created',
      'updated',
    ],
  });

  return users.map(user => {
    const data = user.toJSON();

    return {
      ...data,
      created: formatDateTime(data.created),
      updated: formatDateTime(data.updated),
    };
  });
};


export const countTotalPages = async ({
  name,
  email,
  step = 10,
}) => {
  const where = buildWhere({ name, email });

  const totalRecords = await User.count({ where });
  const totalPages = Math.ceil(totalRecords / Number(step));
  return {totalPages, totalRecords};
};

export const createUser = async ({ username, email, password = null }) => {
  if (!username || !email) {
    throw new Error('Username y email son requeridos');
  }

  // Generar password random si no viene
  if (!password) {
    password = Math.random().toString(36).slice(-8); // 8 chars random
  }

  // Hash opcional con bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    activated: false,
  });

  const data = newUser.toJSON();

  // Devolver el formato igual a fetchAll
  return {
    ...data,
    created: formatDateTime(data.created),
    updated: formatDateTime(data.updated),
  };
};