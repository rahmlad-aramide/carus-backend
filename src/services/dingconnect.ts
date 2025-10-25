import axios from 'axios'

export class DingConnectService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.DINGCONNECT_API_KEY || ''
  }

  async sendAirtime(
    accountNumber: string,
    amount: number,
    skuCode: string,
  ) {
    return axios.post(
      'https://api.dingconnect.com/api/v1/SendTransfer',
      {
        SkuCode: skuCode,
        SendValue: amount,
        AccountNumber: accountNumber,
        DistributorRef: `ref-${Date.now()}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          api_key: this.apiKey,
        },
      },
    )
  }
}
