import express from 'express';
import nodeMailer from 'nodemailer';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 메일 발송 서비스에 대한 환경 설정
const transporter = nodeMailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    // secure: true,
    auth: {
        user: `${process.env.NAVER_USER}`,
        pass: `${process.env.NAVER_PASS}`,
    },
});

router.post('/sendEmail', async (req, res) => {
    const { email } = req.body; // 받는 사람 이메일 주소
    try {
        // 이메일 옵션 설정
        const random_code = Math.floor(Math.random() * 1000000); // 6자기 인증코드 랜덤 추출

        // 메일을 받을 유저 설정
        const mailOptions = {
            from: `"hanghae19" <${process.env.NAVER_USER}>`, // 보내는 사람 이메일 주소
            to: email, // 받는 사람 이메일 주소, 사용자가 입력한 이메일
            subject: '이메일 인증', // 메일 제목
            text: '이메일 인증을 위한 메시지', // 메일 내용
            //인증코드를 위한 간단한 html 양식
            html: `
                <html lang="kr">
                <body>
                    <div>
                        <div style="margin-top: 30px;">
                            <p style="font-size: 14px; color: #222222;">인증코드를 확인해주세요.</p>
                            <h3 style="font-size: 20px;">[${random_code}]</h3>
                            <p style="font-size: 14px; color: #222222;"> 이메일 인증코드를 발급해드립니다.</p>
                        </div>
					</div>
                </body>
				</html>
            `,
        };

        console.log('메일 인증번호 : ', random_code);

        // 이메일 전송
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('인증 요청한 이메일📧 : ', info.accepted);

        // 성공 응답
        return res.status(200).json({
            info: info.accepted[0],
            message: '인증 이메일을 성공적으로 보냈습니다.',
        });
    } catch (error) {
        console.error('이메일 전송 에러:', error);
        res.status(500).send('이메일 전송에 실패했습니다.');
    }
});

export default router;
