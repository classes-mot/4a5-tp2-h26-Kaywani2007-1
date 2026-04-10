import express from 'express';
import checkAuth from '../middleware/check-auth.js';
import { addJeu, getJeux, getUnJeu, modifierJeu, deleteJeu } from '../controller/jeux-controller.js';

const router = express.Router();

router.get(`/readJeux`, getJeux);
router.get(`/readUnJeu/:id`, getUnJeu);

router.post(`/addJeux`,checkAuth, addJeu);
router.patch(`/modifierJeu/:id`,checkAuth, modifierJeu);
router.delete(`/deleteJeu/:id`,checkAuth, deleteJeu);

export default router;