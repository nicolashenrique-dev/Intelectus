import express from 'express';
import { realizarLogin, registrarUsuario } from '../controllers/authController.js';
import { obterPerfilUsuario } from '../controllers/profileController.js';
import roadmapRoutes from './roadmapRoutes.js';
import iaRoutes from './iaRoutes.js';
import itensRoutes from './itensRoutes.js';

const router = express.Router();

router.post('/login', realizarLogin);
router.post('/register', registrarUsuario);
router.get('/profile/:uid', obterPerfilUsuario);

router.use('/roadmap', roadmapRoutes);
router.use('/ia', iaRoutes);
router.use('/itens', itensRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
