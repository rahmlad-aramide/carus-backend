import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { CityEnum, RegionEnum } from '../../@types/user'
import { AppDataSource } from '../../data-source'
import { Configurations } from '../../entities/configurations'
import { generalResponse, returnSuccess } from '../../helpers/constants'
import catchController from '../../utils/catchControllerAsyncs'

const configurationRepository = AppDataSource.getRepository(Configurations)

const updatePointToNairaSchema = Joi.object({
  value: Joi.number().positive().required(),
})

export const createConfiguration = catchController(
  async (req: Request, res: Response) => {
    const { type, value } = req.body

    const requiredFields = ['type', 'value']

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Please make sure that you pass all the required fields',
          ),
        )
    }

    const newConfiguration = configurationRepository.create({
      type: type,
      value: value,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    })

    await configurationRepository.save(newConfiguration)

    return res
      .status(StatusCodes.CREATED)
      .json(
        generalResponse(
          StatusCodes.CREATED,
          {},
          [],
          `New configuration ${type} has been created`,
        ),
      )
  },
)

export const getConfigurations = catchController(
  async (req: Request, res: Response) => {
    const configurations = await configurationRepository.find()

    res.status(StatusCodes.OK).json(
      generalResponse(
        StatusCodes.OK,
        configurations.map((configuration) => ({
          name: configuration.type,
          value: configuration.value,
        })),
        [],
        returnSuccess,
      ),
    )
  },
)

export const getLocationDetails = catchController(
  async (req: Request, res: Response) => {
    const regionList = Object.values(RegionEnum)
    const cityList = Object.values(CityEnum)

    res.status(StatusCodes.OK).json(
      generalResponse(
        StatusCodes.OK,
        {
          regions: regionList,
          lga: cityList,
        },
        [],
        returnSuccess,
      ),
    )
  },
)

export const updatePointToNaira = catchController(
  async (req: Request, res: Response) => {
    const { error } = updatePointToNairaSchema.validate(req.body)
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            error.message,
            [],
            error.details,
          ),
        )
    }

    const { value } = req.body

    let pointToNaira = await configurationRepository.findOne({
      where: { type: 'point_to_naira' },
    })

    if (pointToNaira) {
      pointToNaira.value = value
    } else {
      pointToNaira = configurationRepository.create({
        type: 'point_to_naira',
        value: value,
      })
    }

    await configurationRepository.save(pointToNaira)

    res
      .status(StatusCodes.OK)
      .json(generalResponse(StatusCodes.OK, pointToNaira, [], returnSuccess))
  },
)
