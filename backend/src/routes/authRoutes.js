import express from 'express';
import { realizarLogin, registrarUsuario } from '../controllers/authController.js';
import { obterPerfilUsuario } from '../controllers/profileController.js';

const router = express.Router();

// RF01 - Realizar Login
router.post('/login', realizarLogin);
router.post('/cadastro', registrarUsuario);

// RF02 - Perfil do usuário
router.get('/perfil/:uid', obterPerfilUsuario);

export default router;
