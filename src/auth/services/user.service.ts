import { AppDataSource } from '../../data-source'
import { User } from '../../entities/user'

export class UserService {
  private userRepository = AppDataSource.getRepository(User)

  async findByEmailOrNumber(identifier: string): Promise<User | null> {
    const normalizedIdentifier = this.normalizePhoneNumber(identifier)

    return this.userRepository.findOne({
      where: [{ email: identifier }, { phone: normalizedIdentifier }],
    })
  }

  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove leading '+' if present
    let normalizedNumber =
      phoneNumber.startsWith('+') || phoneNumber.startsWith('0')
        ? phoneNumber.slice(1)
        : phoneNumber
    // Remove leading '234' if present
    if (normalizedNumber.startsWith('234')) {
      normalizedNumber = normalizedNumber.slice(3)
    }
    return normalizedNumber
  }
}
