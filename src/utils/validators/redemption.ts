import Joi from 'joi'

export const redeemForAirtimeSchema = Joi.object({
  network: Joi.string().valid('mtn', 'glo', 'airtel', '9mobile').required(),
  amount: Joi.number().positive().required(),
  phoneNumber: Joi.string().required(),
})

export const redeemForCashSchema = Joi.object({
  amount: Joi.number().positive().required(),
  accountNumber: Joi.string().required(),
  bankName: Joi.string().required(),
  accountName: Joi.string().required(),
})
