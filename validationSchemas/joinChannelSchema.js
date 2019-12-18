const Joi = require('@hapi/joi')

const schema = Joi.object().keys({
    link: Joi.string().required(),
    private: Joi.boolean()
})

module.exports = schema