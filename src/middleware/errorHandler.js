const errorHandler = (err, req, res, _next) => {
    console.error('Error:', err);

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return res.status(400).json({
            success: false,
            message: 'Validation error.',
            errors,
        });
    }

    if (err.name === 'SequelizeDatabaseError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid request data.',
        });
    }

    if (err.name === 'ValidationError' && err.errors) {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return res.status(400).json({
            success: false,
            message: 'Validation error.',
            errors,
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid value for ${err.path}: ${err.value}`,
        });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === 'development'
                ? err.message
                : 'Internal server error.',
    });
};

module.exports = { errorHandler };
