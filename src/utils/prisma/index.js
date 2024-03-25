import { PrismaClient } from '@prisma/client';

// export const prisma = new PrismaClient({
//     // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력해줍니다.
//     log: ['query', 'info', 'warn', 'error'],

//     // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력해줍니다.
//     errorFormat: 'pretty',
// }); // PrismaClient 인스턴스를 생성합니다.

export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
});

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
});
