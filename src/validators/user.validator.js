const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
    }),
    password: Joi.string().min(6).max(128).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.max': 'Password cannot exceed 128 characters.',
        'any.required': 'Password is required.',
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required.',
    }),
});

module.exports = { registerSchema, loginSchema };
