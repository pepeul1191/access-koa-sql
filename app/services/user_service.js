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
      'activated',
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

export const updateUser = async (id, { username, email }) => {
  // Buscar el usuario por id
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Actualizar solo si vienen datos
  if (username) user.username = username;
  if (email) user.email = email;

  user.updated = new Date(); // actualizar la fecha
  await user.save();

  const data = user.toJSON();

  return {
    ...data,
    created: formatDateTime(data.created),
    updated: formatDateTime(data.updated),
  };
};

export const updateUserPassword = async (id, password) => {
  // Buscar el usuario por id
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Actualizar solo si vienen datos
  if (password) user.password = await bcrypt.hash(password, 10);

  user.updated = new Date(); // actualizar la fecha
  await user.save();

  const data = user.toJSON();

  return {
    ...data,
    updated: formatDateTime(data.updated),
  };
};

export const updateActivated = async (id, activated) => {
  // Buscar el usuario por id
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Actualizar solo si vienen datos
  user.activated = activated;

  user.updated = new Date(); // actualizar la fecha
  await user.save();

  const data = user.toJSON();

  return {
    ...data,
    updated: formatDateTime(data.updated),
  };
};

export const updateActivationKey = async (id) => {
  // Buscar el usuario por id
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Actualizar solo si vienen datos
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  user.activation_key = Array.from({ length: 30 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  user.updated = new Date(); // actualizar la fecha
  await user.save();

  const data = user.toJSON();

  return {
    ...data,
    updated: formatDateTime(data.updated),
  };
};

export const updateResetKey = async (id) => {
  // Buscar el usuario por id
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Actualizar solo si vienen datos
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  user.reset_key = Array.from({ length: 30 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  user.updated = new Date(); // actualizar la fecha
  await user.save();

  const data = user.toJSON();

  return {
    ...data,
    updated: formatDateTime(data.updated),
  };
};

export const sendResetKeyEmail = async (user) => {
  // Buscar el usuario por id
  console.log(user);
  console.log('ENVIAR CORREO TODO');
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await user.destroy();

  return true;
};