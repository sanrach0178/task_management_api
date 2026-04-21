/**
 * Joi validation middleware factory.
 * Takes a Joi schema and returns middleware that validates req.body.
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, ''),
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors,
            });
        }

        req.body = value; // use the sanitised/coerced value
        next();
    };
};

module.exports = { validate };
