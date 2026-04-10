import express from 'express';
import { addUser, loginUser } from '../controller/users-controller.js';

const router = express.Router();

router.post(`/addUser`, addUser);
router.post(`/login`, loginUser);

export default router;