import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from 'src/entities/user'

import { AppDataSource } from '../../data-source'
import { Wallet } from '../../entities/wallet'
import {
  generalResponse,
  returnSuccess,
  userNotFound,
} from '../../helpers/constants'
import catchController from '../../utils/catchControllerAsyncs'

export const getWallet = catchController(
  async (req: Request, res: Response) => {
    const user: User | undefined = req.user

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
    }

    const walletRepository = AppDataSource.getRepository(Wallet)

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

    res.status(StatusCodes.OK).json(
      generalResponse(
        StatusCodes.OK,
        {
          id: wallet?.id,
          naira_amount: wallet?.naira_amount,
          points: wallet?.points,
          last_transaction_time: wallet?.updatedAt,
        },
        [],
        returnSuccess,
      ),
    )
  },
)
