import { Request, Response } from 'express'
import fs from 'fs/promises'
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

const donationIdFromSql = 'donation.id'

export const createCampaign = catchController(
  async (req: Request, res: Response) => {
    const { error } = createCampaignSchema.validate(req.body)
    if (error) {
      if (req.file) {
        await fs.unlink(req.file.path)
      }
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

    const { title, description, target, duration } = req.body

    const donationRepository = AppDataSource.getRepository(Donation)
    const newCampaign = new Donation()
    newCampaign.title = title
    newCampaign.description = description
    newCampaign.target = target
    newCampaign.duration = duration
    if (req.file) {
      newCampaign.image = req.file.path
    }
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
      if (req.file) {
        await fs.unlink(req.file.path)
      }
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
      if (req.file) {
        await fs.unlink(req.file.path)
      }
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

    const campaigns = await donationRepository
      .createQueryBuilder('donation')
      .select([
        donationIdFromSql,
        'donation.title',
        'donation.description',
        'donation.target',
        'donation.duration',
        'donation.image',
        'donation.createdAt',
        'donation.updatedAt',
      ])
      .addSelect('COALESCE(SUM(contribution.amount), 0)', 'amountRaised')
      .addSelect('COUNT(DISTINCT contribution.user_id)', 'numberOfDonors')
      .leftJoin('donation.contributions', 'contribution')
      .groupBy(donationIdFromSql)
      .getRawMany()

    const formattedCampaigns = campaigns.map((campaign) => ({
      id: campaign.donation_id,
      title: campaign.donation_title,
      description: campaign.donation_description,
      target: campaign.donation_target,
      duration: campaign.donation_duration,
      image: campaign.donation_image,
      createdAt: campaign.donation_created_at,
      updatedAt: campaign.donation_updated_at,
      amountRaised: Number(campaign.amountRaised),
      numberOfDonors: Number(campaign.numberOfDonors),
    }))

    res
      .status(StatusCodes.OK)
      .json(
        generalResponse(StatusCodes.OK, formattedCampaigns, [], returnSuccess),
      )
  },
)

export const getCampaign = catchController(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const donationRepository = AppDataSource.getRepository(Donation)

    const campaign = await donationRepository
      .createQueryBuilder('donation')
      .select([
        donationIdFromSql,
        'donation.title',
        'donation.description',
        'donation.target',
        'donation.duration',
        'donation.image',
        'donation.createdAt',
        'donation.updatedAt',
      ])
      .addSelect('COALESCE(SUM(contribution.amount), 0)', 'amountRaised')
      .addSelect('COUNT(DISTINCT contribution.user_id)', 'numberOfDonors')
      .leftJoin('donation.contributions', 'contribution')
      .where('donation.id = :id', { id })
      .groupBy(donationIdFromSql)
      .getRawOne()

    if (!campaign) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], donationNotFound))
    }

    const formattedCampaign = {
      id: campaign.donation_id,
      title: campaign.donation_title,
      description: campaign.donation_description,
      target: campaign.donation_target,
      duration: campaign.donation_duration,
      image: campaign.donation_image,
      createdAt: campaign.donation_created_at,
      updatedAt: campaign.donation_updated_at,
      amountRaised: Number(campaign.amountRaised),
      numberOfDonors: Number(campaign.numberOfDonors),
    }

    res
      .status(StatusCodes.OK)
      .json(
        generalResponse(StatusCodes.OK, formattedCampaign, [], returnSuccess),
      )
  },
)
