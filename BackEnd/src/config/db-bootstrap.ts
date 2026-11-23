import { pool } from './postgres';

export async function bootstrapDatabase(): Promise<void> {
  try {
    console.log('🔄 Inicializando base de datos PostgreSQL de materias universitarias...');

    await pool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Roles (
          id_role SERIAL PRIMARY KEY,
          nombre_role VARCHAR(50) UNIQUE NOT NULL,
          descripcion VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS Usuarios (
          id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          cc VARCHAR(20) UNIQUE NOT NULL,
          id_role INT NOT NULL,
          email VARCHAR(180) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          es_activo BOOLEAN DEFAULT TRUE,
          ultimo_login TIMESTAMP WITH TIME ZONE,
          fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_usuarios_role FOREIGN KEY (id_role) 
              REFERENCES Roles(id_role) ON UPDATE CASCADE ON DELETE RESTRICT
      );

      CREATE TABLE IF NOT EXISTS Estudiantes (
          id_estudiante UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          cc VARCHAR(20) UNIQUE NOT NULL,
          nombres VARCHAR(100) NOT NULL,
          apellidos VARCHAR(100) NOT NULL,
          email_institucional VARCHAR(180) UNIQUE NOT NULL,
          telefono VARCHAR(30),
          sexo VARCHAR(20) DEFAULT 'Masculino',
          ciudadania VARCHAR(50) DEFAULT 'Ciudadano Colombiano',
          contacto_emergencia VARCHAR(150),
          telefono_emergencia VARCHAR(30),
          nivel VARCHAR(50) DEFAULT 'Pregrado',
          semestre VARCHAR(50) DEFAULT 'Sexto Semestre',
          estatus VARCHAR(30) DEFAULT 'Activo',
          campus VARCHAR(80) DEFAULT 'ENGATIVA PRESENCIAL / UMD',
          programa VARCHAR(100) DEFAULT 'INGENIERÍA DE SISTEMAS',
          plan_estudios VARCHAR(100) DEFAULT '1-BGISUM20182-INGENIERIA DE SISTEMAS',
          fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS Materias (
          id_materia SERIAL PRIMARY KEY,
          codigo_materia VARCHAR(30) NOT NULL,
          titulo_curso VARCHAR(150) NOT NULL,
          campus VARCHAR(20) DEFAULT 'UMD',
          calificacion NUMERIC(3,1) DEFAULT 0.0,
          horas_intensidad NUMERIC(4,1) DEFAULT 3.0,
          nrc INT NOT NULL UNIQUE,
          plan_estudios VARCHAR(100) DEFAULT '1-BGISUM20182-INGENIERIA DE SISTEMAS',
          accion VARCHAR(50) DEFAULT 'Componentes',
          es_activa BOOLEAN DEFAULT TRUE,
          fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS Horarios (
          id_horario SERIAL PRIMARY KEY,
          nrc INT NOT NULL,
          dia VARCHAR(20) NOT NULL,
          hora_inicio VARCHAR(10) NOT NULL,
          hora_fin VARCHAR(10) NOT NULL,
          salon VARCHAR(50) NOT NULL,
          edificio VARCHAR(50) NOT NULL,
          CONSTRAINT fk_horario_materia FOREIGN KEY (nrc) REFERENCES Materias(nrc) ON DELETE CASCADE
      );
    `);

    // Sembrar Roles
    await pool.query(`
      INSERT INTO Roles (id_role, nombre_role, descripcion) VALUES 
      (1, 'ADMIN', 'Administrador del sistema académico'),
      (2, 'ESTUDIANTE', 'Estudiante universitario UNIMINUTO'),
      (3, 'DOCENTE', 'Profesor de la facultad de Ingeniería')
      ON CONFLICT (id_role) DO NOTHING;
    `);

    // Sembrar Estudiante Santiago Waltero Olaya
    await pool.query(`
      INSERT INTO Estudiantes (
        cc, nombres, apellidos, email_institucional, sexo, ciudadania, 
        contacto_emergencia, telefono_emergencia, nivel, semestre, estatus, campus, programa, plan_estudios
      ) VALUES (
        '1000000001', 'Santiago', 'Waltero Olaya', 'santiago.waltero@uniminuto.edu.co', 'Masculino', 'Ciudadano Colombiano',
        'Olaya Gamez, Rosalba', '3017206200', 'Pregrado', 'Sexto Semestre', 'Activo', 'ENGATIVA PRESENCIAL / UMD', 'INGENIERÍA DE SISTEMAS', '1-BGISUM20182-INGENIERIA DE SISTEMAS'
      ) ON CONFLICT (email_institucional) DO NOTHING;
    `);

    // Sembrar Usuarios
    await pool.query(`
      INSERT INTO Usuarios (id_usuario, cc, id_role, email, password_hash) VALUES 
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1000000001', 2, 'santiago.waltero@uniminuto.edu.co', crypt('Estudiante123*', gen_salt('bf', 10))),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1000000000', 1, 'admin@uniminuto.edu.co', crypt('Admin123*', gen_salt('bf', 10)))
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
    `);

    // Sembrar las 6 materias exactas de Banner UNIMINUTO
    await pool.query(`
      INSERT INTO Materias (codigo_materia, titulo_curso, campus, calificacion, horas_intensidad, nrc, plan_estudios, accion) VALUES
      ('ISUM BG213, 1', 'Arquitectura de Datos', 'UMD', 3.9, 3.0, 75357, '1-BGISUM20182-INGENIERIA DE SISTEMAS', 'Componentes'),
      ('ISUM BG073, 7', 'Diseño de Algoritmos', 'UMD', 0.0, 2.0, 80892, '1-BGISUM20182-INGENIERIA DE SISTEMAS', 'Componentes'),
      ('ISUM BG223, 3', 'Base de Datos Masivas', 'UMD', 3.1, 3.0, 83378, '1-BGISUM20182-INGENIERIA DE SISTEMAS', 'Componentes'),
      ('ISUM BG053, 8', 'Desarrollo Basado en Plataformas', 'UMD', 4.3, 2.0, 83676, '1-BGISUM20182-INGENIERIA DE SISTEMAS', 'Componentes'),
      ('FISI 1040, 2', 'Física Eléctrica', 'UMD', 3.3, 3.0, 84642, '1-BGISUM20182-INGENIERIA DE SISTEMAS', 'Componentes'),
      ('ISUM BG042, 11', 'Electiva Cmd Ingen Sin Fronteras', 'UMD', 0.0, 3.0, 86376, '1-BGISUM20182-INGENIERIA DE SISTEMAS', 'Componentes')
      ON CONFLICT (nrc) DO UPDATE SET
        calificacion = EXCLUDED.calificacion,
        horas_intensidad = EXCLUDED.horas_intensidad,
        titulo_curso = EXCLUDED.titulo_curso;

      INSERT INTO Horarios (nrc, dia, hora_inicio, hora_fin, salon, edificio) VALUES
      (75357, 'Lunes', '18:15', '20:30', 'Lab 304', 'Edificio B - Ingeniería'),
      (80892, 'Martes', '18:15', '19:45', 'Aula 201', 'Edificio A - Central'),
      (83378, 'Miércoles', '18:15', '20:30', 'Lab 302', 'Edificio B - Ingeniería'),
      (83676, 'Jueves', '18:15', '19:45', 'Lab 305', 'Edificio B - Ingeniería'),
      (84642, 'Viernes', '18:15', '20:30', 'Lab Física', 'Edificio C - Ciencias'),
      (86376, 'Sábado', '08:00', '11:00', 'Aula Virtual', 'Campus Digital')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Esquema y materias universitarias cargadas con éxito en PostgreSQL.');
  } catch (error) {
    console.error('❌ Error en el bootstrap de la base de datos:', error);
  }
}
