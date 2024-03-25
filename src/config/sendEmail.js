// sendEmail.js
import nodemailer from 'nodemailer';

const sendWelcomeEmail = async (email) => {
    // 메일 발신자 설정
    const transporter = nodemailer.createTransport({
        service: 'naver', // 이메일 서비스 제공자
        host: 'smtp.naver.com',
        port: 587,
        auth: {
            user: `${process.env.NAVER_USER}`, // 귀하의 이메일 주소
            pass: `${process.env.NAVER_PASS}`, // 이메일 비밀번호 또는 앱 비밀번호
        },
    });

    // 메일 보내기 옵션 설정
    const mailOptions = {
        from: `"hanghae19" <${process.env.NAVER_USER}>`, // 보내는 사람 이메일 주소
        to: email, // 수신자 주소, 여기에서는 회원가입한 사용자의 이메일
        subject: '회원가입이 완료되었습니다.',
        text: '회원가입을 축하드립니다!🎉 \n\n이용해 주셔서 감사합니다😊', // 일반 텍스트 본문
    };

    // 메일 전송
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

export default sendWelcomeEmail;
