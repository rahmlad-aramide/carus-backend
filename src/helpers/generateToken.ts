import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserRow } from 'src/@types/user'

const generateToken = function (
  userId: UserRow['id'],
  type: 'access' | 'refresh',
): { token: string; token_expires: number } {
  const token = jwt.sign(
    { id: userId, type },
    process.env.JWT_SECRET as string,
    {
      expiresIn: type === 'access' ? '24h' : '1y',
    },
  )

  const tokens: JwtPayload | string | null = jwt.decode(token)
  let token_expires = 0
  if (tokens && typeof tokens !== 'string') {
    const { exp } = tokens
    token_expires = exp ? exp * 1000 : 0
  }

  return { token, token_expires }
}

export default generateToken
