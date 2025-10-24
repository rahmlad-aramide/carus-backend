import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AppDataSource } from '../../data-source'
import { Contact } from '../../entities/contact'
import { User } from '../../entities/user'
import { generalResponse, Pagination } from '../../helpers/constants'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { emailService } from '../../helpers/emailService'

export const createAdmin = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          'All fields are required',
        ),
      )
  }

  try {
    const userRepository = AppDataSource.getRepository(User)
    const existingUser = await userRepository.findOne({ where: { email } })

    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(
          generalResponse(
            StatusCodes.CONFLICT,
            {},
            [],
            'User with this email already exists',
          ),
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User()
    newUser.first_name = first_name
    newUser.last_name = last_name
    newUser.email = email
    newUser.password = hashedPassword
    newUser.role = 'admin'
    newUser.avatar = '' // Add a default avatar or handle it as needed
    newUser.status = 'ACTIVE' // Or 'INACTIVE' until email verification

    const savedUser = await userRepository.save(newUser)

    return res
      .status(StatusCodes.CREATED)
      .json(
        generalResponse(
          StatusCodes.CREATED,
          savedUser,
          [],
          'Admin created successfully',
        ),
      )
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        generalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          {},
          [],
          'An error occurred',
        ),
      )
  }
}

export const toggleUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, {}, [], 'User not found'))
    }

    user.isDisabled = !user.isDisabled
    const updatedUser = await userRepository.save(user)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(
          StatusCodes.OK,
          updatedUser,
          [],
          `User has been ${
            updatedUser.isDisabled ? 'disabled' : 'enabled'
          }`,
        ),
      )
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        generalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          {},
          [],
          'An error occurred',
        ),
      )
  }
}

export const viewComplaints = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10 } = req.query
    const contactRepository = AppDataSource.getRepository(Contact)
    const [complaints, totalCount] = await contactRepository.findAndCount({
      relations: ['user'],
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    })

    const pagination: Pagination = {
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / Number(pageSize)),
      pageSize: Number(pageSize),
      totalCount,
    }
    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(
          StatusCodes.OK,
          complaints,
          [],
          'Complaints fetched successfully',
          pagination,
        ),
      )
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        generalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          {},
          [],
          'An error occurred',
        ),
      )
  }
}

export const adminResetPassword = async (req: Request, res: Response) => {
  const { token } = req.params
  const { password } = req.body

  if (!password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          'Password is required',
        ),
      )
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  try {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({
      where: {
        otp: hashedToken,
      },
    })

    if (!user || !user.otpExpires || user.otpExpires < new Date()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Token is invalid or has expired',
          ),
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.otp = null
    user.otpExpires = null
    await userRepository.save(user)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(StatusCodes.OK, {}, [], 'Password reset successful'),
      )
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        generalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          {},
          [],
          'An error occurred',
        ),
      )
  }
}

export const adminForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(StatusCodes.BAD_REQUEST, {}, [], 'Email is required'),
      )
  }

  try {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({
      where: { email, role: 'admin' },
    })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            'Admin with this email not found',
          ),
        )
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    user.otp = passwordResetToken
    user.otpExpires = passwordResetExpires
    await userRepository.save(user)

    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/admin/reset-password/${resetToken}`
    const message = `We have received a password reset request. Please use the link below to reset your password. This link is valid for 10 minutes.\n\n${resetUrl}`

    try {
      await emailService.sendEmail({
        email: user.email,
        subject: 'Password change request received',
        message,
      })
      return res
        .status(StatusCodes.OK)
        .json(
          generalResponse(
            StatusCodes.OK,
            {},
            [],
            'Password reset link sent to your email',
          ),
        )
    } catch (err) {
      user.otp = null
      user.otpExpires = null
      await userRepository.save(user)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          generalResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            {},
            [],
            'Error sending email',
          ),
        )
    }
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        generalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          {},
          [],
          'An error occurred',
        ),
      )
  }
}

export const removeAdmin = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, {}, [], 'User not found'))
    }

    user.role = 'user'
    const updatedUser = await userRepository.save(user)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(
          StatusCodes.OK,
          updatedUser,
          [],
          'Admin role removed successfully',
        ),
      )
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        generalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          {},
          [],
          'An error occurred',
        ),
      )
  }
}

export const assignAdmin = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, {}, [], 'User not found'))
    }

    user.role = 'admin'
    const updatedUser = await userRepository.save(user)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(
          StatusCodes.OK,
          updatedUser,
          [],
          'Admin role assigned successfully',
        ),
      )
  } catch (error) {
    console.error(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        generalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          {},
          [],
          'An error occurred',
        ),
      )
  }
}
