import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PostRouter from './posts/router/posts.router.js';
import UserRouter from './users/router/userRouter.js';
import CommentRouter from './comments/router/comments.router.js';
import LikeRouter from './likes/router/likes.router.js';
import ImageRouter from './images/router/images.router.js';

import NodeMailerRouter from './config/sendEmail.js';
import logMiddleware from './middlewares/log.middleware.js';
import { logger } from './config/winston/logger.js';

import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' assert { type: 'json' }; // Swagger JSON 문서 import

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// CORS 미들웨어 설정
app.use(
    cors({
        origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
        credentials: 'true', // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
    }),
);

app.use(logMiddleware);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile)); // Swagger UI 미들웨어 사용

// 라우터 설정
app.use('/', [PostRouter, UserRouter, CommentRouter, LikeRouter, ImageRouter, NodeMailerRouter]);

app.listen(PORT, () => {
    console.log(`${PORT} 포트로 서버가 열렸어요!`);
});

app.get('/', (req, res) => {
    logger.info('GET /');
    res.sendStatus(200);
});

app.get('/error', (req, res) => {
    logger.error('Error message');
    res.sendStatus(500);
});
