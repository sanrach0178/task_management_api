const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'A RESTful API for managing tasks with real-time notifications and external integration.',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token obtained from /api/auth/login',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        email: { type: 'string', example: 'user@example.com' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Work on project' },
                        description: { type: 'string', example: 'Finish the backend API' },
                        dueDate: { type: 'string', format: 'date-time', nullable: true },
                        status: { type: 'string', enum: ['pending', 'completed'] },
                        categoryId: { type: 'integer', nullable: true },
                        tags: { type: 'array', items: { type: 'integer' } },
                        userId: { type: 'integer' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        userId: { type: 'integer' },
                    },
                },
                Tag: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        userId: { type: 'integer' },
                    },
                },
                CreateTaskRequest: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string', example: 'New Task' },
                        description: { type: 'string' },
                        dueDate: { type: 'string', format: 'date-time' },
                        status: { type: 'string', enum: ['pending', 'completed'] },
                        categoryId: { type: 'integer' },
                        tags: { type: 'array', items: { type: 'integer' } },
                    },
                },
                UpdateTaskRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        dueDate: { type: 'string', format: 'date-time', nullable: true },
                        status: { type: 'string', enum: ['pending', 'completed'] },
                        categoryId: { type: 'integer', nullable: true },
                        tags: { type: 'array', items: { type: 'integer' } },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        errors: { type: 'array', items: { type: 'object' } },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
