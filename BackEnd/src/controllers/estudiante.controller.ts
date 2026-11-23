import type { Request, Response, NextFunction } from 'express';
import { EstudianteModel } from '../models/estudiante.model';

export const obtenerPerfilEstudiante = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const perfil = await EstudianteModel.obtenerPerfil();
    res.status(200).json(perfil);
  } catch (error) {
    next(error);
  }
};

export const obtenerHistoricoEstudiante = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const historico = await EstudianteModel.obtenerHistorico();
    res.status(200).json(historico);
  } catch (error) {
    next(error);
  }
};
