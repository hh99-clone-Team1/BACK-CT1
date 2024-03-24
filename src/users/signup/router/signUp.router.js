import express from 'express';
import logMiddleware from '../../../middlewares/log.middleware.js';

import { signUpController } from '../controller/signUpController.js';

const router = express.Router();

router.post('/signUp', logMiddleware, signUpController);

export default router;
