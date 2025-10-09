import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppDataSource } from '../../data-source'
import { Configurations } from '../../entities/configurations'
import { Schedule } from '../../entities/schedule'
import { Transaction } from '../../entities/transactions'
import { User } from '../../entities/user'
import { Wallet } from '../../entities/wallet'
import { Donation } from '../../entities/donation'
import {
  generalResponse,
  invalidCredentials,
  returnSuccess,
  userNotFound,
} from '../../helpers/constants'
import generateToken from '../../helpers/generateToken'
import catchController from '../../utils/catchControllerAsyncs'

const scheduleRepository = AppDataSource.getRepository(Schedule)
const userRepository = AppDataSource.getRepository(User)
const walletRepository = AppDataSource.getRepository(Wallet)

export const loginAdmin = catchController(
  async (req: Request, res: Response) => {
    const { identifier, password }: { identifier: string; password: string } =
      req.body

    //Check if both fields are passed
    if (!identifier) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Please provide a username or an email address',
          ),
        )
    }
    if (!password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Password field cannot be empty',
          ),
        )
    }

    // Check if the client's identifier (username or email) is contained in the database
    const user = await userRepository.findOne({
      where: { email: identifier },
    })
    //check if user is an admin
    if (!(String(user?.role) === 'admin')) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            'User with this email or username does not exist',
          ),
        )
    }

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            'User with this email or username does not exist',
          ),
        )
    }

    //Check if the password is a valid string and not undefined or null
    if (!user.password || typeof user.password !== 'string') {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(StatusCodes.NOT_FOUND, {}, [], invalidCredentials),
        )
    }

    //Compare the client's password with the one in the db
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(StatusCodes.NOT_FOUND, {}, [], invalidCredentials),
        )
    }

    //What to do if the authentication is successful
    if (isPasswordValid && user.id) {
      const { token: refresh_token, token_expires: refresh_token_expires } =
        generateToken(user.id, 'refresh')
      const { token: access_token, token_expires: access_token_expires } =
        generateToken(user.id, 'access')
      res.status(StatusCodes.OK).json(
        generalResponse(
          StatusCodes.OK,
          {
            username: user.username,
            email: user.email,
            status: user.status,
            refresh_token: refresh_token,
            refresh_token_expires: refresh_token_expires,
            access_token: access_token,
            access_token_expires: access_token_expires,
          },
          [],
          'User logged in successfully',
        ),
      )
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Something went wrong',
          ),
        )
    }
  },
)

export const acceptSchedule = catchController(
  async (req: Request, res: Response) => {
    const scheduleId = req.params.id

    const scheduleRepository = AppDataSource.getRepository(Schedule)
    // const transactionRepository = AppDataSource.getRepository(Transaction)

    const existingSchedule = await scheduleRepository.findOne({
      where: { id: scheduleId },
    })

    if (!existingSchedule) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(StatusCodes.NOT_FOUND, {}, [], 'invalid schedule'),
        )
    }

    if (
      existingSchedule.status === 'accepted' ||
      existingSchedule.status === 'cancelled' ||
      existingSchedule.status === 'fulfilled'
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'schedule has already been accepted, cancelled, or fulfilled',
          ),
        )
    }

    // const transaction = await transactionRepository.findOne({
    //     relations: {
    //         schedule: true
    //     },
    //     where: {
    //         schedule: {
    //             id: existingSchedule.id
    //         }
    //     }
    // })

    // if (!transaction) {
    //     return res.status(StatusCodes.NOT_FOUND).json(generalResponse(StatusCodes.NOT_FOUND, {}, [], 'transaction not found'));
    // }

    // transaction.status = 'accepted'
    // await transactionRepository.save(transaction)

    existingSchedule.status = 'accepted'
    await scheduleRepository.save(existingSchedule)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(
          StatusCodes.OK,
          {},
          [],
          `schedule has been accepted, awaiting ${existingSchedule.category} `,
        ),
      )
  },
)

export const cancelSchedule = catchController(
  async (req: Request, res: Response) => {
    const scheduleId = req.params.id
    // const transactionRepository = AppDataSource.getRepository(Transaction)

    const existingSchedule = await scheduleRepository.findOne({
      where: { id: scheduleId },
    })

    if (!existingSchedule) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(StatusCodes.NOT_FOUND, {}, [], 'invalid schedule id'),
        )
    }

    if (
      existingSchedule.status === 'cancelled' ||
      existingSchedule.status === 'fulfilled' ||
      existingSchedule.status === 'missed'
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'schedule has already been cancelled, or fulfilled',
          ),
        )
    }

    // const transaction = await transactionRepository.findOne({
    //     relations: {
    //         schedule: true
    //     },
    //     where: {
    //         schedule: {
    //             id: existingSchedule.id
    //         }
    //     }
    // })

    // if (!transaction) {
    //     return res.status(StatusCodes.NOT_FOUND).json(generalResponse(StatusCodes.NOT_FOUND, {}, [], 'transaction not found'));
    // }

    // transaction.status = 'cancelled'
    // await transactionRepository.save(transaction)

    existingSchedule.status = 'missed'
    await scheduleRepository.save(existingSchedule)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(StatusCodes.OK, {}, [], `schedule has been cancelled `),
      )
  },
)

export const fulfillSchedule = catchController(
  async (req: Request, res: Response) => {
    //fetch schedule id from parameters
    const scheduleId = req.params.id

    const { material_amount, material } = req.body

    const parsedMaterialAmount = parseInt(material_amount, 10)
    //check if material amount and materials are passed
    if (!material_amount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Please provide a material amount',
          ),
        )
    }
    if (!material) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Please provide a material',
          ),
        )
    }

    if (material !== 'plastic') {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            'no configuration was set for this material',
          ),
        )
    }

    const scheduleRepository = AppDataSource.getRepository(Schedule)
    const walletRepository = AppDataSource.getRepository(Wallet)
    const transactionRepository = AppDataSource.getRepository(Transaction)
    const configurationRepository = AppDataSource.getRepository(Configurations)

    const point_to_plastic = await configurationRepository.findOne({
      where: { type: 'point_to_plastic' },
    })

    if (!point_to_plastic?.value) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            'configuration not found',
          ),
        )
    }

    const parsedPointToPlastic = Number(point_to_plastic?.value)

    const point_to_naira = await configurationRepository.findOne({
      where: { type: 'point_to_naira' },
    })

    if (!point_to_naira?.value) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            'configuration not found',
          ),
        )
    }

    const parsedPointToNaira = Number(point_to_naira.value)

    //find schedule with the scheduleId
    const existingSchedule = await scheduleRepository.findOne({
      where: { id: scheduleId },
    })

    if (!existingSchedule) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(StatusCodes.NOT_FOUND, {}, [], 'invalid schedule id'),
        )
    }

    //find user with the schedule
    const user = await userRepository.findOne({
      relations: {
        orders: true,
      },
      where: {
        orders: {
          id: existingSchedule.id,
        },
      },
    })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, {}, [], userNotFound))
    }

    //ensure that the schedule has been accepted first
    if (existingSchedule.status !== 'accepted') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'schedule has not been accepted, it cannot be fulfilled',
          ),
        )
    }

    // find the user's corresponding wallet
    const wallet = await walletRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
    })

    if (!wallet?.points || !wallet.naira_amount) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(StatusCodes.NOT_FOUND, {}, [], 'wallet not found'),
        )
    }

    const calculatedPoints = Number(
      Number(parsedMaterialAmount) * Number(parsedPointToPlastic),
    )

    wallet.points = Number(wallet.points) + calculatedPoints

    const calculatedNairaAmount =
      Number(calculatedPoints) / Number(parsedPointToNaira)
    wallet.naira_amount = Number(wallet.naira_amount) + calculatedNairaAmount

    await walletRepository.save(wallet)

    // const transaction = await transactionRepository.findOne({
    //     relations: {
    //         schedule: true
    //     },
    //     where: {
    //         schedule: {
    //             id: existingSchedule.id
    //         }
    //     }
    // })

    // if (!transaction) {
    //     return res.status(StatusCodes.NOT_FOUND).json(generalResponse(StatusCodes.NOT_FOUND, {}, [], 'transaction not found'));
    // }

    // transaction.amount = calculatedNairaAmount
    // transaction.charges = 0
    // transaction.status = 'fulfilled'
    // await transactionRepository.save(transaction)

    const transaction = new Transaction()
    transaction.user = user
    transaction.date = new Date(Date.now())
    transaction.type = existingSchedule.category
    transaction.wallet = wallet
    transaction.schedule = existingSchedule
    transaction.amount = calculatedNairaAmount
    transaction.charges = 0
    transaction.status = 'completed'

    transactionRepository.save(transaction)

    existingSchedule.status = 'completed'
    existingSchedule.amount = calculatedNairaAmount

    await scheduleRepository.save(existingSchedule)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(
          StatusCodes.OK,
          {},
          [],
          `schedule has been completed, user's wallet will be credited with ₦${calculatedNairaAmount.toLocaleString()}`,
        ),
      )
  },
)

export const getAllSchedules = catchController(
  async (req: Request, res: Response) => {
    const schedules = await scheduleRepository.find({
      relations: {
        user: true,
        transaction: true,
      },
    })

    res.status(StatusCodes.OK).json(
      generalResponse(
        StatusCodes.OK,
        schedules.map((schedule) => ({
          id: schedule.id,
          address: schedule.address,
          amount: schedule.amount,
          category: schedule.category,
          container_amount: schedule.container_amount,
          date: schedule.date,
          material: schedule.material,
          material_amount: schedule.material_amount,
          schedule_date: schedule.schedule_date,
          status: schedule.status,
          transaction_id: schedule.transaction?.id,
          user_id: schedule.user?.id,
          user_email: schedule.user?.email,
          user_phone: schedule.user?.phone,
        })),
        [],
        returnSuccess,
      ),
    )
  },
)

export * from './donationController'

export const getAllAccounts = catchController(
  async (req: Request, res: Response) => {
    const users = await userRepository.find({
      relations: {
        wallet: true,
      },
      where: {
        role: 'user',
      },
    })

    res.status(StatusCodes.OK).json(
      generalResponse(
        StatusCodes.OK,
        users.map((user) => ({
          id: user.id,
          google_id: user.googleId,
          address: `${user.address} ${user.city} ${user.region}`,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          dob: user.dob,
          gender: user.gender,
          phone: user.phone,
          status: user.status,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          wallet: user.wallet,
        })),
        [],
        returnSuccess,
      ),
    )
  },
)

export const getTotalWalletAmount = catchController(
  async (req: Request, res: Response) => {
    const wallets = await walletRepository.find()

    const totalAmount = wallets.reduce((acc, wallet) => {
      return acc + Number(wallet.naira_amount)
    }, 0)

    res.status(StatusCodes.OK).json(
      generalResponse(
        StatusCodes.OK,
        {
          total_naira_amount: totalAmount,
        },
        [],
        returnSuccess,
      ),
    )
  },
)
