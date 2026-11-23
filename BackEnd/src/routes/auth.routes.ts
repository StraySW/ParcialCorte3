import { Router } from 'express';
import { loginUsuario, registroUsuario } from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginUsuario);
router.post('/registro', registroUsuario);

export default router;
