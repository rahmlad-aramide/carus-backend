import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppDataSource } from '../../data-source'
import { Donation } from '../../entities/donation'
import {
  donationNotFound,
  generalResponse,
  returnSuccess,
} from '../../helpers/constants'
import catchController from '../../utils/catchControllerAsyncs'

export const getDonations = catchController(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const startIndex = (page - 1) * limit

    const donationRepository = AppDataSource.getRepository(Donation)
    const [donations, total] = await donationRepository.findAndCount({
      skip: startIndex,
      take: limit,
      relations: ['contributions', 'contributions.user'],
    })

    res.status(StatusCodes.OK).json(
      generalResponse(StatusCodes.OK, donations, [], returnSuccess, {
        totalCount: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      }),
    )
  },
)

export const getDonation = catchController(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const donationRepository = AppDataSource.getRepository(Donation)
    const campaign = await donationRepository.findOne({
      where: { id },
      relations: ['contributions', 'contributions.user'],
    })
    if (!campaign) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], donationNotFound))
    }

    res
      .status(StatusCodes.OK)
      .json(generalResponse(StatusCodes.OK, campaign, [], returnSuccess))
  },
)
