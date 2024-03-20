import express from 'express';
import { refreshTokenController } from '../controller/refreshTokenController.js';

const router = express.Router();

router.post('/refresh', refreshTokenController);

export default router;
