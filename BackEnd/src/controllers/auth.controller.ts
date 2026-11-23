import type { Request, Response, NextFunction } from 'express';
import { pool } from '../config/postgres';

export const loginUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Correo institucional y contraseña requeridos' });
      return;
    }

    const resultado = await pool.query(
      `
      SELECT 
        u.id_usuario AS id,
        u.cc,
        u.email,
        r.nombre_role AS rol,
        COALESCE(e.nombres, split_part(u.email, '@', 1)) AS nombre,
        COALESCE(e.apellidos, '') AS apellido
      FROM Usuarios u
      JOIN Roles r ON u.id_role = r.id_role
      LEFT JOIN Estudiantes e ON u.cc = e.cc
      WHERE LOWER(u.email) = LOWER($1) 
        AND u.password_hash = crypt($2, u.password_hash)
        AND u.es_activo = TRUE;
      `,
      [email, password]
    );

    if (resultado.rowCount === 0) {
      res.status(401).json({ message: 'Credenciales inválidas o usuario inactivo' });
      return;
    }

    const usuario = resultado.rows[0];

    try {
      await pool.query(
        `UPDATE Usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id_usuario = $1;`,
        [usuario.id]
      );
    } catch {
      // Ignorar si la columna no existe
    }

    res.status(200).json({
      mensaje: 'Autenticación exitosa',
      usuario: {
        id: usuario.id,
        cc: usuario.cc,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registroUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cc, nombre, apellido, email, password } = req.body;

    if (!cc || !nombre || !email || !password) {
      res.status(400).json({ message: 'Todos los campos obligatorios deben completarse' });
      return;
    }

    await pool.query(
      `INSERT INTO Estudiantes (cc, nombres, apellidos, email_institucional)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email_institucional) DO NOTHING;`,
      [cc, nombre, apellido || '', email]
    );

    await pool.query(
      `INSERT INTO Usuarios (cc, id_role, email, password_hash)
       VALUES ($1, 2, $2, crypt($3, gen_salt('bf', 10)))
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;`,
      [cc, email, password]
    );

    res.status(201).json({
      mensaje: 'Estudiante registrado con éxito',
      usuario: { cc, email, nombre, apellido },
    });
  } catch (error) {
    next(error);
  }
};
