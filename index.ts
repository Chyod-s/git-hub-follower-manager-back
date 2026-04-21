import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './src/controllers/RegisterRoutes';
import { swaggerSpec } from './src/config/swagger';

const server: Application = express();
const port = process.env.PORT || 3000;

server.use(express.json());

// Swagger UI disponível em /api-docs
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

RegisterRoutes(server);

server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
