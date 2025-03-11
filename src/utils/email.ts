export const emailFormat = (email: string) => {
  const atIndex = email.indexOf('@')

  const username = email[0] + '****' + email[atIndex - 1]
  const domain = email[atIndex + 1] + '****' + email[email.length - 1]

  return `${username}@${domain}`
}
