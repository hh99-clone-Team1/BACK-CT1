import express from 'express';
import imageUploader from '../../middlewares/imageUploader.js';
import ProfileController from '../controller/ProfileController.js';


const router = express.Router();


router.post('/images', imageUploader.single('image'), ProfileController)


export default router;
