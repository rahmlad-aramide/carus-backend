import { Paystack } from 'paystack-sdk'

import { AppDataSource } from '../data-source'
import { Configurations } from '../entities/configurations'

export class PaystackService {
  private paystack: Paystack
  private configurationRepository = AppDataSource.getRepository(Configurations)
  constructor() {
    this.paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY || '')
  }

  async verifyAccountNumber(accountNumber: string, bankCode: string) {
    return this.paystack.verification.resolveAccount({
      account_number: accountNumber,
      bank_code: bankCode,
    })
  }

  async createTransferRecipient(
    name: string,
    accountNumber: string,
    bankCode: string,
  ) {
    return this.paystack.transferRecipients.create({
      name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN',
    })
  }

  async initiateTransfer(amount: number, recipient: string, reason: string) {
    return this.paystack.transfers.initiate({
      source: 'balance',
      amount,
      recipient,
      reason,
    })
  }
}
