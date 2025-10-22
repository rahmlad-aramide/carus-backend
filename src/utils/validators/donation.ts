import Joi from 'joi'

export const createContributionSchema = Joi.object({
  campaignId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
})

export const createCampaignSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  target: Joi.number().positive().required(),
  duration: Joi.date().required(),
  image: Joi.string().uri(),
})

export const updateCampaignSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  target: Joi.number().positive(),
  duration: Joi.date(),
  image: Joi.string().uri(),
})
