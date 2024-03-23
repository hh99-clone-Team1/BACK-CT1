import express from 'express';
import authmiddleware from '../../middlewares/auth.middleware.js';
import { createPinController, listPinsController, deletePinController } from '../controller/pinController.js';


// node js 화이팅

const router = express.Router();
// 핀생성 API
router.post('/pins/:postId', authmiddleware, createPinController)

// 핀조회 API
router.get('/pins/:userId', authmiddleware, listPinsController)

// 핀삭제 API
  router.delete('/pins/:pinId', authmiddleware, deletePinController)



export default router;
