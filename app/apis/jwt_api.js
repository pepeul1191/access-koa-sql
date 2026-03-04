// app/apis/token_api.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'tu_secreto';

export const translate = async (ctx) => {
  try {
    const authHeader = ctx.headers.authorization;

    if (!authHeader) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'Token no proporcionado',
      };
      return;
    }

    // Quitamos "Bearer "
    const token = authHeader.split(' ')[1];

    if (!token) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: 'Formato de token inválido',
      };
      return;
    }

    // 🔐 Verificamos y decodificamos
    const decoded = jwt.verify(token, SECRET_KEY);

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Token válido',
      data: decoded, // ← payload del JWT
    };

  } catch (error) {
    console.log(error);
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: 'Token inválido o expirado',
      error: error.message,
    };
  }
};
