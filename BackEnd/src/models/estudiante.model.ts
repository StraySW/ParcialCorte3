import { pool } from '../config/postgres';

export class EstudianteModel {
  static async obtenerPerfil(): Promise<any> {
    const res = await pool.query(`
      SELECT 
        e.nombres,
        e.apellidos,
        CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
        e.email_institucional AS email,
        e.telefono,
        e.sexo,
        e.ciudadania,
        e.contacto_emergencia,
        e.telefono_emergencia,
        e.nivel,
        e.semestre,
        e.estatus,
        e.campus,
        e.programa,
        e.plan_estudios
      FROM Estudiantes e
      LIMIT 1;
    `);
    return res.rows[0] || null;
  }

  static async obtenerHistorico(): Promise<any[]> {
    return [
      {
        "Periodo Académico": "Pregrado Presencial 2026-1",
        "Nivel": "Pregrado",
        "Estado": "Estado Acad. Regular",
        "Campus": "ENGATIVA PRESENCIAL / UMD",
        "Materias Cursadas": 6,
        "Promedio Ponderado": 3.65
      },
      {
        "Periodo Académico": "Pregrado Presencial 2025-2",
        "Nivel": "Pregrado",
        "Estado": "Aprobado",
        "Campus": "ENGATIVA PRESENCIAL / UMD",
        "Materias Cursadas": 6,
        "Promedio Ponderado": 3.92
      },
      {
        "Periodo Académico": "Pregrado Presencial 2025-1",
        "Nivel": "Pregrado",
        "Estado": "Aprobado",
        "Campus": "ENGATIVA PRESENCIAL / UMD",
        "Materias Cursadas": 5,
        "Promedio Ponderado": 4.10
      },
      {
        "Periodo Académico": "Pregrado Presencial 2023-1",
        "Nivel": "Pregrado",
        "Estado": "Ingreso Regular",
        "Campus": "ENGATIVA PRESENCIAL / UMD",
        "Materias Cursadas": 5,
        "Promedio Ponderado": 4.25
      }
    ];
  }
}
