const Joi = require('joi');

const createTaskSchema = Joi.object({
    title: Joi.string().trim().max(200).required().messages({
        'any.required': 'Title is required.',
        'string.max': 'Title cannot exceed 200 characters.',
    }),
    description: Joi.string().trim().max(2000).allow('').empty('').optional(),
    dueDate: Joi.date().iso().allow(null).empty('').optional().messages({
        'date.format': 'Due date must be a valid ISO 8601 date string.',
    }),
    status: Joi.string().valid('pending', 'completed').empty('').optional().messages({
        'any.only': 'Status must be either pending or completed.',
    }),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().trim().max(200).optional(),
    description: Joi.string().trim().max(2000).allow('').empty('').optional(),
    dueDate: Joi.date().iso().allow(null).empty('').optional().messages({
        'date.format': 'Due date must be a valid ISO 8601 date string.',
    }),
    status: Joi.string().valid('pending', 'completed').empty('').optional().messages({
        'any.only': 'Status must be either pending or completed.',
    }),
})
    .min(1)
    .messages({
        'object.min': 'At least one field must be provided for update.',
    });

module.exports = { createTaskSchema, updateTaskSchema };
