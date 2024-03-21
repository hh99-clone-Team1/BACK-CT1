import multer from 'multer';

// Multer middleware with memory storage
const multerMiddleware = multer({
    storage: multer.memoryStorage(),
});

export default multerMiddleware;
