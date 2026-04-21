const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description:
                'A RESTful API for managing tasks with JWT authentication, built with Node.js, Express.js, and PostgreSQL.',
            contact: {
                name: 'API Support',
            },
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
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Complete project report' },
                        description: { type: 'string', example: 'Finish the quarterly report by end of week' },
                        dueDate: { type: 'string', format: 'date-time', example: '2026-05-01T00:00:00.000Z', nullable: true },
                        status: { type: 'string', enum: ['pending', 'completed'], example: 'pending' },
                        userId: { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        password: { type: 'string', minLength: 6, example: 'secret123' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        password: { type: 'string', example: 'secret123' },
                    },
                },
                CreateTaskRequest: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        title: { type: 'string', maxLength: 200, example: 'Buy groceries' },
                        description: { type: 'string', maxLength: 2000, example: 'Milk, eggs, bread' },
                        dueDate: { type: 'string', format: 'date-time', example: '2026-05-01T00:00:00.000Z' },
                        status: { type: 'string', enum: ['pending', 'completed'], default: 'pending' },
                    },
                },
                UpdateTaskRequest: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', maxLength: 200 },
                        description: { type: 'string', maxLength: 2000 },
                        dueDate: { type: 'string', format: 'date-time', nullable: true },
                        status: { type: 'string', enum: ['pending', 'completed'] },
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
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
