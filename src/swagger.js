import swaggerAutogen from 'swagger-autogen';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'a REST API using swagger and express.',
        },
        basePath: '/',
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: [],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
        },
    },
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, options);
