// app/services/user_service.js
import { Op } from 'sequelize';
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

  return User.findAll({
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
