// app/services/user_service.js
import { Op } from 'sequelize';
import bcrypt from 'bcrypt'; // si quieres generar password hash
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { formatDateTime } from '../configs/helpers.js';
import User from '../models/user.js';
import sequelize from '../../configs/database.js';
import UserPermission from '../models/user_permission.js';
import VwSystemUsers from '../models/vw_system_users.js';
import VwUserRolesPermissions from '../models/vw_user_roles_permissions.js';

const SECRET_KEY = process.env.JWT_SECRET || 'tu_secreto';

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

  if (!password) {
    password = Math.random().toString(36).slice(-8);
  }

  const pepper = process.env.CRYPTO;
  if (!pepper) {
    throw new Error('CRYPTO no está definido en el .env');
  }

  // 🔐 password + pepper
  const hashedPassword = await bcrypt.hash(password + pepper, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    activated: false,
  });

  const data = newUser.toJSON();

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
  if (!password) {
    throw new Error('La contraseña es requerida');
  }

  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const pepper = process.env.CRYPTO;
  if (!pepper) {
    throw new Error('CRYPTO no está definido en el .env');
  }

  // 🔐 password + pepper
  user.password = await bcrypt.hash(password + pepper, 10);
  user.updated = new Date();

  await user.save();

  const data = user.toJSON();
  delete data.password; // nunca devolver el hash

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

export const assignPermissions = async (userId, payload) => {
  const transaction = await sequelize.transaction();

  try {
    const response = [];
    const { edits = [] } = payload;

    for (const incoming of edits) {
      const {
        id: permissionId,
        is_assigned,
      } = incoming;

      if (is_assigned === true) {
        // 🔹 Crear asociación si no existe
        const [association, created] = await UserPermission.findOrCreate({
          where: {
            user_id: userId,
            permission_id: permissionId,
          },
          defaults: {
            created: new Date(),
          },
          transaction,
        });

        if (created) {
          response.push({
            tmp: incoming.tmp || null,
            id: association.id.toString(),
          });
        }

      } else if (is_assigned === false) {
        // 🔹 Eliminar asociación si existe
        await UserPermission.destroy({
          where: {
            user_id: userId,
            permission_id: permissionId,
          },
          transaction,
        });
      }
    }

    await transaction.commit();
    return response;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const signInByUsername = async ({ username, password, system_id }) => {
  if (!username || !password || !system_id) {
    const error = new Error('Datos incompletos');
    error.status = 400;
    throw error;
  }

  const user = await VwSystemUsers.findOne({
    where: {
      username,
      system_id,
      activated: true,
    },
  });

  if (!user) {
    const error = new Error(
      'Usuario no registrado en el sistema o inactivo'
    );
    error.status = 401;
    throw error;
  }

  const PEPPER = process.env.CRYPTO;
  if (!PEPPER) {
    const error = new Error('Configuración de seguridad inválida');
    error.status = 500;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password + PEPPER, user.password);

  if (!isValidPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  let data = {};
  
  data.user = user.toJSON();
  delete data.user.password;
  delete data.user.system_id;
  delete data.user.activated;

  const roles = await getUserRolesPermissions(data.user.id, system_id);

  data.roles = roles;

  // 🔐 Generamos JWT
  // Payload puede incluir id, username y roles (solo los ids y nombres)
  const tokenPayload = {
    id: data.user.id,
    username: data.user.username,
    roles: data.roles.map(r => ({ id: r.id, name: r.name }))
  };

  const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1h' });

  data.jwt = token;

  return data;
};

const getUserRolesPermissions = async (user_id, system_id) => {
  // Traemos todos los registros que correspondan
  const records = await VwUserRolesPermissions.findAll({
    where: { user_id, system_id },
    raw: true, // devuelve objetos planos
    order: [['role_id', 'ASC'], ['permission_id', 'ASC']],
  });

  // Agrupamos por rol
  const rolesMap = {};

  for (const r of records) {
    if (!rolesMap[r.role_id]) {
      rolesMap[r.role_id] = {
        id: r.role_id,
        name: r.role_name,
        permissions: [],
      };
    }

    rolesMap[r.role_id].permissions.push({
      id: r.permission_id,
      name: r.permission_name,
    });
  }

  // Convertimos el map a array
  return Object.values(rolesMap);
};