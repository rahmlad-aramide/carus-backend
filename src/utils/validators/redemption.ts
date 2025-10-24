import Joi from 'joi'

export const redeemForAirtimeSchema = Joi.object({
  network: Joi.string().valid('mtn', 'glo', 'airtel', '9mobile').required(),
  points: Joi.number().positive().required(),
  phoneNumber: Joi.string().required(),
})

export const redeemForCashSchema = Joi.object({
  points: Joi.number().positive().required(),
  accountNumber: Joi.string().required(),
  bankName: Joi.string().required(),
  accountName: Joi.string().required(),
})
