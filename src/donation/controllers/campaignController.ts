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
import { formatJoiError } from '../../utils/helper'
import {
  createCampaignSchema,
  updateCampaignSchema,
} from '../../utils/validators/donation'

const getCampaignStats = (campaign: Donation) => {
  const amountRaised = campaign.contributions
    ? campaign.contributions.reduce(
        (sum, contribution) => sum + (contribution.amount || 0),
        0,
      )
    : 0
  const numberOfDonors = campaign.contributions
    ? new Set(campaign.contributions.map((c) => c.user?.id)).size
    : 0
  return { ...campaign, amountRaised, numberOfDonors }
}

export const createCampaign = catchController(
  async (req: Request, res: Response) => {
    const { error } = createCampaignSchema.validate(req.body)
    if (error) {
      const { details, message } = formatJoiError(error)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            error.message,
            details,
            message,
          ),
        )
    }

    const { title, description, target, duration, image } = req.body

    const donationRepository = AppDataSource.getRepository(Donation)
    const newCampaign = new Donation()
    newCampaign.title = title
    newCampaign.description = description
    newCampaign.target = target
    newCampaign.duration = duration
    newCampaign.image = image
    await donationRepository.save(newCampaign)

    res
      .status(StatusCodes.CREATED)
      .json(
        generalResponse(StatusCodes.CREATED, newCampaign, [], returnSuccess),
      )
  },
)

export const updateCampaign = catchController(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { error } = updateCampaignSchema.validate(req.body)
    if (error) {
      const { details, message } = formatJoiError(error)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            error.message,
            details,
            message,
          ),
        )
    }

    const donationRepository = AppDataSource.getRepository(Donation)
    const campaign = await donationRepository.findOne({ where: { id } })
    if (!campaign) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], donationNotFound))
    }

    Object.assign(campaign, req.body)
    await donationRepository.save(campaign)

    res
      .status(StatusCodes.OK)
      .json(generalResponse(StatusCodes.OK, campaign, [], returnSuccess))
  },
)

export const deleteCampaign = catchController(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const donationRepository = AppDataSource.getRepository(Donation)
    const campaign = await donationRepository.findOne({ where: { id } })
    if (!campaign) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], donationNotFound))
    }

    await donationRepository.remove(campaign)
    res
      .status(StatusCodes.OK)
      .json(generalResponse(StatusCodes.OK, {}, [], returnSuccess))
  },
)

export const getCampaigns = catchController(
  async (req: Request, res: Response) => {
    const donationRepository = AppDataSource.getRepository(Donation)
    const campaigns = await donationRepository.find({
      relations: ['contributions'],
    })
    const campaignsWithStats = campaigns.map(getCampaignStats)

    res
      .status(StatusCodes.OK)
      .json(
        generalResponse(StatusCodes.OK, campaignsWithStats, [], returnSuccess),
      )
  },
)

export const getCampaign = catchController(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const donationRepository = AppDataSource.getRepository(Donation)
    const campaign = await donationRepository.findOne({
      where: { id },
      relations: ['contributions'],
    })
    if (!campaign) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], donationNotFound))
    }

    const campaignWithStats = getCampaignStats(campaign)

    res
      .status(StatusCodes.OK)
      .json(
        generalResponse(StatusCodes.OK, campaignWithStats, [], returnSuccess),
      )
  },
)
