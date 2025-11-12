import axios from 'axios'
import crypto from 'crypto'

export class InterswitchService {
  private clientId: string
  private clientSecret: string
  private terminalId: string
  private baseUrl: string

  constructor() {
    this.clientId = process.env.INTERSWITCH_CLIENT_ID || ''
    this.clientSecret = process.env.INTERSWITCH_CLIENT_SECRET || ''
    this.terminalId = process.env.INTERSWITCH_TERMINAL_ID || ''
    this.baseUrl = 'https://qa.interswitchng.com/quicktellerservice/api/v5'
  }

  private async getAccessToken() {
    const response = await axios.post(
      `${this.baseUrl}/token`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`,
          ).toString('base64')}`,
        },
      },
    )
    return response.data.access_token
  }

  async validateAccountNumber(accountNumber: string, bankCode: string) {
    const accessToken = await this.getAccessToken()
    return axios.get(
      `${this.baseUrl}/transactions/DoAccountNameInquiry`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          TerminalId: this.terminalId,
          bankCode,
          accountId: accountNumber,
        },
      },
    )
  }

  async transfer(
    amount: number,
    accountNumber: string,
    bankCode: string,
    senderName: string,
    beneficiaryName: string,
  ) {
    const accessToken = await this.getAccessToken()
    const transferCode = `03000${Date.now()}`
    const mac = crypto
      .createHash('sha512')
      .update(
        `${amount}566CA${amount}566AC${bankCode}${accountNumber}NG`,
      )
      .digest('hex')
    return axios.post(
      `${this.baseUrl}/transactions/TransferFunds`,
      {
        transferCode,
        mac,
        termination: {
          amount,
          accountReceivable: {
            accountNumber,
            accountType: '00',
          },
          entityCode: bankCode,
          currencyCode: '566',
          paymentMethodCode: 'AC',
          countryCode: 'NG',
        },
        sender: {
          lastname: senderName,
          othernames: '',
        },
        initiatingEntityCode: 'PBL',
        initiation: {
          amount,
          currencyCode: '566',
          paymentMethodCode: 'CA',
          channel: '7',
        },
        beneficiary: {
          lastname: beneficiaryName,
          othernames: '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          TerminalId: this.terminalId,
        },
      },
    )
  }

  async getBillerCategories() {
    const accessToken = await this.getAccessToken()
    return axios.get(`${this.baseUrl}/services/categories`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        TerminalId: this.terminalId,
      },
    })
  }

  async getBillersByCategory(categoryId: string) {
    const accessToken = await this.getAccessToken()
    return axios.get(
      `${this.baseUrl}/services?categoryId=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          TerminalId: this.terminalId,
        },
      },
    )
  }

  async getBillerPaymentItems(billerId: string) {
    const accessToken = await this.getAccessToken()
    return axios.get(
      `${this.baseUrl}/services/options?serviceid=${billerId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          TerminalId: this.terminalId,
        },
      },
    )
  }

  async purchaseAirtime(
    paymentCode: string,
    customerId: string,
    amount: number,
  ) {
    const accessToken = await this.getAccessToken()
    const requestReference = `1194${Date.now()}`
    return axios.post(
      `${this.baseUrl}/transactions`,
      {
        TerminalId: this.terminalId,
        paymentCode,
        customerId,
        customerMobile: customerId,
        customerEmail: '',
        amount,
        requestReference,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          TerminalId: this.terminalId,
        },
      },
    )
  }
}
