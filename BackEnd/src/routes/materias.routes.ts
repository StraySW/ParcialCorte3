import { Router } from 'express';
import { 
  obtenerMaterias, 
  obtenerCalificaciones, 
  obtenerHorario, 
  obtenerCurriculo, 
  crearMateria 
} from '../controllers/materias.controller';

const router = Router();

router.get('/', obtenerMaterias);
router.get('/calificaciones', obtenerCalificaciones);
router.get('/horario', obtenerHorario);
router.get('/curriculo', obtenerCurriculo);
router.post('/', crearMateria);

export default router;
