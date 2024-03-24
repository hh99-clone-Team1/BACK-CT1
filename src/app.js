import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PostRouter from './posts/router/posts.router.js';
import UserRouter from './users/router/userRouter.js';
import pinRouter from './pins/router/pins.router.js';
import CommentRouter from './comments/router/comments.router.js';
import LikeRouter from './likes/router/likes.router.js';
import ImageRouter from './images/router/images.router.js';

import NodeMailerRouter from './config/sendEmail.js';
import logMiddleware from './middlewares/log.middleware.js';
import { logger } from './config/winston/logger.js';

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

// 라우터 설정
app.use('/', [PostRouter, UserRouter, CommentRouter, LikeRouter, ImageRouter, pinRouter, NodeMailerRouter]);

app.listen(PORT, () => {
    console.log(`${PORT} 포트로 서버가 열렸어요!`);
});

app.get('/', (req, res) => {
    logger.info('GET /');
    res.sendStatus(200);
});

// 테스트용 API 라우터 추가
app.get('/test', (req, res) => {
    res.send('This is a test endpoint');
});

// 테스트용 API 라우터 추가
app.get('/hi', (req, res) => {
    res.send('hehe');
});

app.get('/error', (req, res) => {
    logger.error('Error message');
    res.sendStatus(500);
});
