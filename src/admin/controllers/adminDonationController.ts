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
    const donationRepository = AppDataSource.getRepository(Donation)
    const campaigns = await donationRepository.find({
      relations: ['contributions', 'contributions.user'],
    })

    res
      .status(StatusCodes.OK)
      .json(generalResponse(StatusCodes.OK, campaigns, [], returnSuccess))
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
