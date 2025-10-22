import { Request, Response } from 'express'

import { AppDataSource } from '../../data-source'
import { Donation } from '../../entities/donation'

export const getDonations = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const startIndex = (page - 1) * limit

  try {
    const donationRepository = AppDataSource.getRepository(Donation)
    const [donations, total] = await donationRepository.findAndCount({
      skip: startIndex,
      take: limit,
    })

    res.status(200).json({
      data: donations,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error })
  }
}
