export const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.{8,})/

export const generalResponse = (
  status: number,
  data: object | string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any[],
  message: string,
) => {
  return {
    status: status,
    data: data,
    error: error,
    message: message,
  }
}

export const returnSuccess = 'Operation was successful'
export const emailVerificationSuccess = 'Your email has been verified'
export const invalidCredentials = 'Invalid credentials'
export const userNotFound = 'User not found'
export const invalidTransaction = 'Invalid transaction'
export const donationNotFound = 'Donation not found'
export const insufficientPoints = 'Insuffiecient points'
