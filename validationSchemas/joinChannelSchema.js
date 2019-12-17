const Joi = require('@hapi/joi')

const schema = Joi.object().keys({
    link: Joi.string().alphanum().min(3).max(30).required(),
    private: Joi.boolean()
})

module.exports = schema