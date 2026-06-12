import express from 'express';
import { realizarLogin, registrarUsuario } from '../controllers/authController.js';
import { obterPerfilUsuario } from '../controllers/profileController.js';

const router = express.Router();

// RF01 - Realizar Login
router.post('/login', realizarLogin);
router.post('/register', registrarUsuario);

// RF02 - Perfil do usuário
router.get('/profile/:uid', obterPerfilUsuario);

export default router;
