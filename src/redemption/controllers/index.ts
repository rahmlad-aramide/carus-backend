import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppDataSource } from '../../data-source'
import { Configurations } from '../../entities/configurations'
import { Redemption, RedemptionType } from '../../entities/redemption'
import { User } from '../../entities/user'
import { Wallet } from '../../entities/wallet'
import {
  generalResponse,
  insufficientNairaAmount,
  insufficientPoints,
  returnSuccess,
  userNotFound,
} from '../../helpers/constants'
import catchController from '../../utils/catchControllerAsyncs'
import { DingConnectService } from '../../services/dingconnect'
import { PaystackService } from '../../services/paystack'
import { formatJoiError } from '../../utils/helper'
import {
  redeemForAirtimeSchema,
  redeemForCashSchema,
} from '../../utils/validators/redemption'

export const redeemForAirtime = catchController(
  async (req: Request, res: Response) => {
    const user: User | undefined = req.user
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
    }

    const { error } = redeemForAirtimeSchema.validate(req.body)
    if (error) {
      const { details, message } = formatJoiError(error)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(generalResponse(StatusCodes.BAD_REQUEST, {}, details, message))
    }

    const { network, points, phoneNumber } = req.body

    const walletRepository = AppDataSource.getRepository(Wallet)
    const redemptionRepository = AppDataSource.getRepository(Redemption)
    const configurationRepository = AppDataSource.getRepository(Configurations)

    const pointToNaira = await configurationRepository.findOne({
      where: { type: 'point_to_naira' },
    })

    if (!pointToNaira?.value) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            '',
            [],
            'Point to naira not set',
          ),
        )
    }

    const wallet = await walletRepository.findOne({
      where: { user: { id: user.id } },
    })
    if (!wallet || (wallet.points || 0) < points) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(StatusCodes.BAD_REQUEST, '', [], insufficientPoints),
        )
    }

    const wallet = await walletRepository.findOne({
      where: { user: { id: user.id } },
    })
    if (!wallet || (wallet.points || 0) < points) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(StatusCodes.BAD_REQUEST, '', [], insufficientPoints),
        )
    }

    const nairapoints = points * Number(pointToNaira?.value)

    const dingConnectService = new DingConnectService()

    await dingConnectService.sendAirtime(
      phoneNumber,
      nairapoints,
      'MTN_NG_AIRTIME',
    )

    wallet.points = (wallet.points || 0) - points
    await walletRepository.save(wallet)

    const newRedemption = new Redemption()
    newRedemption.type = RedemptionType.AIRTIME
    newRedemption.amount = points
    newRedemption.network = network
    newRedemption.phoneNumber = phoneNumber
    newRedemption.user = user
    await redemptionRepository.save(newRedemption)

    res
      .status(StatusCodes.CREATED)
      .json(
        generalResponse(
          StatusCodes.CREATED,
          newRedemption,
          [],
          `${returnSuccess}, you'll be credited with ${nairapoints} airtime soon.`,
        ),
      )
  },
)

export const redeemForCash = catchController(
  async (req: Request, res: Response) => {
    const user: User | undefined = req.user
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
    }

    const { error } = redeemForCashSchema.validate(req.body)
    if (error) {
      const { details, message } = formatJoiError(error)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(generalResponse(StatusCodes.BAD_REQUEST, {}, details, message))
    }

    const { points, accountNumber, bankName, accountName } = req.body

    const walletRepository = AppDataSource.getRepository(Wallet)
    const redemptionRepository = AppDataSource.getRepository(Redemption)
    const configurationRepository = AppDataSource.getRepository(Configurations)

    const pointToNaira = await configurationRepository.findOne({
      where: { type: 'point_to_naira' },
    })

    if (!pointToNaira?.value) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            '',
            [],
            'Point to naira not set',
          ),
        )
    }

    const wallet = await walletRepository.findOne({
      where: { user: { id: user.id } },
    })
    if (!wallet || (wallet.points || 0) < points) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(StatusCodes.BAD_REQUEST, '', [], insufficientPoints),
        )
    }

    const nairapoints = points * Number(pointToNaira?.value)

    const paystackService = new PaystackService()

    const {
      data: { account_name: resolvedAccountName },
    } = await paystackService.verifyAccountNumber(accountNumber, bankName)

    if (resolvedAccountName.toLowerCase() !== accountName.toLowerCase()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            '',
            [],
            'Account name does not match',
          ),
        )
    }

    const {
      data: { recipient_code: recipientCode },
    } = await paystackService.createTransferRecipient(
      accountName,
      accountNumber,
      bankName,
    )

    const transfer = await paystackService.initiateTransfer(
      nairapoints,
      recipientCode,
      'Cash redemption',
    )

    if (transfer.status) {
      wallet.points = (wallet.points || 0) - points
      await walletRepository.save(wallet)
    }

    const newRedemption = new Redemption()
    newRedemption.type = RedemptionType.CASH
    newRedemption.amount = points
    newRedemption.accountNumber = accountNumber
    newRedemption.bankName = bankName
    newRedemption.accountName = accountName
    newRedemption.user = user
    await redemptionRepository.save(newRedemption)

    res
      .status(StatusCodes.CREATED)
      .json(
        generalResponse(
          StatusCodes.CREATED,
          newRedemption,
          [],
          `${returnSuccess}, you'll be credited with #${nairapoints} soon.`,
        ),
      )
  },
)
