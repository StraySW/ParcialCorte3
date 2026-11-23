import { Router } from 'express';
import { obtenerPerfilEstudiante, obtenerHistoricoEstudiante } from '../controllers/estudiante.controller';

const router = Router();

router.get('/perfil', obtenerPerfilEstudiante);
router.get('/historico', obtenerHistoricoEstudiante);

export default router;
