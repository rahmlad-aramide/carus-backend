import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppDataSource } from '../../data-source'
import { Contact } from '../../entities/contact'
import { User } from '../../entities/user'
import {
  anErrorOccurred,
  generalResponse,
  Pagination,
  userNotFound,
} from '../../helpers/constants'

export const toggleUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({ where: { id } })

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, {}, [], userNotFound))
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
          `User has been ${updatedUser.isDisabled ? 'disabled' : 'enabled'}`,
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
          anErrorOccurred,
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
          anErrorOccurred,
        ),
      )
  }
}
