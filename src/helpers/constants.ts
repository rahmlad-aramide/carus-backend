export const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.{8,})/

export interface Pagination {
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
}

export const generalResponse = (
  status: number,
  data: object | string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any[],
  message: string,
  pagination?: Pagination,
) => {
  return {
    status,
    data,
    error,
    message,
    pagination,
  }
}

export const returnSuccess = 'Operation was successful'
export const emailVerificationSuccess = 'Your email has been verified'
export const invalidCredentials = 'Invalid credentials'
export const userNotFound = 'User not found'
export const invalidTransaction = 'Invalid transaction'
export const insufficientPoints = 'Insufficient points'
export const donationNotFound = 'Donation not found'
export const insufficientNairaAmount = 'Insufficient naira amount'
export const anErrorOccurred = 'An error occurred'
