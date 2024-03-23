import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import PostRouter from './posts/router/posts.router.js';
import SignUpRouter from './users/signup/router/signUp.router.js';
import LogInRouter from './users/login/router/login.router.js';
import RefreshTokenRouter from './users/login/router/refreshToken.router.js';

import pinRouter from './pins/router/pins.router.js'

import CommentRouter from './comments/router/comments.router.js';
import LikeRouter from './likes/router/likes.router.js';
import ImageRouter from './images/router/images.router.js';

import NodeMailerRouter from './config/email.js';

import logMiddleware from './middlewares/log.middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// CORS 미들웨어 설정
app.use(
    cors({
        origin: '*',       // 모든 출처 허용 옵션. true 를 써도 된다.
        credentials: 'true' // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
    }),
);

app.use(logMiddleware);

// 라우터 설정
app.use('/', [PostRouter, SignUpRouter, LogInRouter, RefreshTokenRouter, CommentRouter, LikeRouter, ImageRouter, pinRouter]);

app.listen(PORT, () => {
    console.log(`${PORT} 포트로 서버가 열렸어요!`);
});
