import { pool } from '../config/postgres';

export class MateriaModel {
  static async obtenerTodas(): Promise<any[]> {
    const res = await pool.query(`
      SELECT 
        codigo_materia AS "Materia",
        titulo_curso AS "Título del curso",
        campus AS "Campus",
        calificacion::numeric AS "Calificación",
        horas_intensidad::numeric AS "Horas intensidad",
        nrc AS "NRC",
        plan_estudios AS "Plan de estudios",
        accion AS "Acción"
      FROM Materias
      WHERE es_activa = TRUE
      ORDER BY id_materia ASC;
    `);
    return res.rows;
  }

  static async obtenerCalificaciones(): Promise<any[]> {
    const res = await pool.query(`
      SELECT 
        titulo_curso AS "Asignatura",
        nrc AS "NRC",
        calificacion::numeric AS "Nota Definitiva",
        CASE 
          WHEN calificacion >= 3.0 THEN 'Aprobada'
          WHEN calificacion > 0 THEN 'En Riesgo'
          ELSE 'En Curso'
        END AS "Estado",
        horas_intensidad AS "Créditos/Horas"
      FROM Materias
      ORDER BY id_materia ASC;
    `);
    return res.rows;
  }

  static async obtenerHorario(): Promise<any[]> {
    const res = await pool.query(`
      SELECT 
        titulo_curso AS "Título",
        codigo_materia AS "Detalles",
        horas_intensidad::int AS "Horas",
        nrc AS "NRC",
        CASE 
          WHEN titulo_curso ILIKE '%Física%' THEN 'Teórico-Práctico'
          ELSE 'Teórico'
        END AS "Tipo de horario",
        'Calificación Estándar' AS "Modo de calificar",
        'Pregrado' AS "Nivel",
        'Periodo Completo' AS "Parte-de-periodo",
        '1-BGISUM20182-INGE...' AS "Plan de estudios",
        '02/08/2026' AS "Fecha",
        'Inscrito' AS "Status",
        'Inscrito por Web02...' AS "Mensaje"
      FROM Materias
      WHERE es_activa = TRUE
      ORDER BY 
        CASE titulo_curso
          WHEN 'Arquitectura de Datos' THEN 1
          WHEN 'Base de Datos Masivas' THEN 2
          WHEN 'Desarrollo Basado en Plataform' THEN 3
          WHEN 'Diseño de Algoritmos' THEN 4
          WHEN 'Electiva Cmd Ingen Sin Fronter' THEN 5
          WHEN 'Física Eléctrica' THEN 6
          ELSE 7
        END ASC;
    `);
    return res.rows;
  }

  static async obtenerCurriculo(): Promise<any[]> {
    const res = await pool.query(`
      SELECT 
        '1-BGISUM20182-INGENIERIA DE SISTEMAS' AS "Plan de Estudios",
        'Sexto Semestre' AS "Periodo Curricular",
        COUNT(id_materia)::int AS "Total Materias Inscritas",
        SUM(horas_intensidad)::int AS "Total Horas Semanales",
        ROUND(AVG(calificacion), 2) AS "Promedio Actual"
      FROM Materias;
    `);
    return res.rows;
  }

  static async crear(materia: any): Promise<any> {
    const res = await pool.query(
      `INSERT INTO Materias (codigo_materia, titulo_curso, campus, calificacion, horas_intensidad, nrc, plan_estudios, accion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *;`,
      [
        materia.codigo_materia || materia.codigo,
        materia.titulo_curso || materia.titulo,
        materia.campus || 'UMD',
        materia.calificacion || 0.0,
        materia.horas_intensidad || materia.horas || 3.0,
        materia.nrc,
        materia.plan_estudios || '1-BGISUM20182-INGENIERIA DE SISTEMAS',
        materia.accion || 'Componentes',
      ]
    );
    return res.rows[0];
  }
}
