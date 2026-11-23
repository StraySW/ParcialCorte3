import type { Request, Response, NextFunction } from 'express';
import { MateriaModel } from '../models/materia.model';

export const obtenerMaterias = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const materias = await MateriaModel.obtenerTodas();
    res.status(200).json(materias);
  } catch (error) {
    next(error);
  }
};

export const obtenerCalificaciones = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const calificaciones = await MateriaModel.obtenerCalificaciones();
    res.status(200).json(calificaciones);
  } catch (error) {
    next(error);
  }
};

export const obtenerHorario = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const horario = await MateriaModel.obtenerHorario();
    res.status(200).json(horario);
  } catch (error) {
    next(error);
  }
};

export const obtenerCurriculo = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const curriculo = await MateriaModel.obtenerCurriculo();
    res.status(200).json(curriculo);
  } catch (error) {
    next(error);
  }
};

export const crearMateria = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const nueva = await MateriaModel.crear(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    next(error);
  }
};
