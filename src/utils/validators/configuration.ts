import Joi from 'joi'

export const updateConfigurationSchema = Joi.object({
  value: Joi.string().required(),
})
