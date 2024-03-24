import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Test API',
            version: '1.0.0',
            description: 'Test API with express',
        },
        basePath: '/',
    },
    apis: ['./src/routes/*.js', './src/db/models/*.js'],
};
const specs = swaggerJsdoc(options);
export { swaggerUi, specs };
