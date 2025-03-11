import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { User } from 'src/entities/user'

import { AppDataSource } from '../../data-source'
import { Transaction } from '../../entities/transactions'
import {
  generalResponse,
  returnSuccess,
  userNotFound,
} from '../../helpers/constants'
import catchController from '../../utils/catchControllerAsyncs'

export const getTransactions = catchController(
  async (req: Request, res: Response) => {
    const user: User | undefined = req.user

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
    }

    const transactionRepository = AppDataSource.getRepository(Transaction)

    const transactions = await transactionRepository.find({
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
        transactions.map((transaction) => ({
          transaction_id: transaction.id,
          amount: transaction.amount,
          charges: transaction.charges,
          date: transaction.date,
          type: transaction.type,
          status: transaction.status,
        })),
        [],
        returnSuccess,
      ),
    )
  },
)
