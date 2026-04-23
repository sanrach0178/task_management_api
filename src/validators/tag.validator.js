const Joi = require('joi');

const tagSchema = Joi.object({
    name: Joi.string().trim().max(100).required()
});

module.exports = {
    tagSchema,
};
