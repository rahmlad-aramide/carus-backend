import { Request, Response } from 'express'
import fs from 'fs/promises'
import { StatusCodes } from 'http-status-codes'
import { User } from 'src/entities/user'

import {
  CategoryEnum,
  MaterialEnum,
  ScheduleRow,
  ScheduleStatusEnum,
} from '../../@types/schedule'
import { AppDataSource } from '../../data-source'
import { Schedule } from '../../entities/schedule'
import { Wallet } from '../../entities/wallet'
import {
  generalResponse,
  returnSuccess,
  userNotFound,
} from '../../helpers/constants'
import catchController from '../../utils/catchControllerAsyncs'

const passRequredFieldsMessage =
  'Please make sure you pass all the required fields'
const scheduleRepository = AppDataSource.getRepository(Schedule)
const walletRepository = AppDataSource.getRepository(Wallet)
const statusList = Object.values(ScheduleStatusEnum).join(', ')

// eslint-disable-next-line sonarjs/cognitive-complexity
const schedulePickup = catchController(async (req: Request, res: Response) => {
  const {
    material,
    material_amount,
    container_amount,
    address,
    status = 'pending',
    category,
  } = req.body as ScheduleRow

  //Check if all fields are passed
  const requiredFields = [
    'material',
    'material_amount',
    'container_amount',
    'date',
    'address',
  ]
  if (requiredFields.some((field) => !req.body[field])) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          passRequredFieldsMessage,
        ),
      )
  }

  //validate the material
  if (material && !Object.values(MaterialEnum).includes(material)) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          `Invalid material. The accepted materials are: [${Object.values(
            MaterialEnum,
          ).join(', ')}]`,
        ),
      )
  }

  //validate the category
  if (category && !Object.values(CategoryEnum).includes(category)) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          `Invalid category. The accepted categories are: [${Object.values(
            CategoryEnum,
          ).join(', ')}]`,
        ),
      )
  }

  //validate material amount
  if (material_amount < 50 || material_amount > 10000) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          'Material must be between 50 and 10,000',
        ),
      )
  }

  //validate container amount
  if (container_amount < 1 || container_amount > 50) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          'Container must be between 1 and 50',
        ),
      )
  }

  const user: User | undefined = req.user

  if (!user) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
  }

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

  if (!address) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          'Input a valid address',
        ),
      )
  }

  // const lga = user.city

  //validate date orrrrr... vali-DATE :)))
  const dateString = new Date(req.body.date)
  if (dateString < new Date(Date.now())) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        generalResponse(
          StatusCodes.BAD_REQUEST,
          {},
          [],
          'The indicated date has elapsed',
        ),
      )
  }

  const date = dateString

  if (!wallet) {
    if (req.file) {
      await fs.unlink(req.file.path)
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(generalResponse(StatusCodes.NOT_FOUND, {}, [], 'Wallet not found'))
  }

  const newSchedule = scheduleRepository.create({
    address: address,
    category: category,
    date: date,
    container_amount: container_amount,
    material: material,
    material_amount: material_amount,
    status: status,
    user: user,
    schedule_date: new Date(Date.now()),
    image: req.file?.path,
  })

  await scheduleRepository.save(newSchedule)

  return res
    .status(StatusCodes.OK)
    .json(
      generalResponse(
        StatusCodes.OK,
        {},
        [],
        `Pickup scheduled, see you on ${date.toDateString()}`,
      ),
    )
})

const updatePickupSchedule = catchController(
  async (req: Request, res: Response) => {
    const user: User | undefined = req.user

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
    }

    const { status: newScheduleStatus } = req.body as ScheduleRow
    const scheduleId = String(req.params.id)

    if (!scheduleId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'Schedule id not specified',
          ),
        )
    }

    if (!newScheduleStatus) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            'New schedule status not specified',
          ),
        )
    }

    if (
      newScheduleStatus &&
      !Object.values(ScheduleStatusEnum).includes(newScheduleStatus)
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          generalResponse(
            StatusCodes.BAD_REQUEST,
            {},
            [],
            `Invalid schedule status, valid statuses are: ${statusList}`,
          ),
        )
    }

    const schedules = await scheduleRepository.find({
      relations: {
        user: true,
        transaction: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
    })

    const schedule = schedules.find(
      (matchedSchedule) => matchedSchedule.id === scheduleId,
    )

    if (!schedule) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            `Schedule with the id ${scheduleId} does not exist'`,
          ),
        )
    }

    schedule.status = newScheduleStatus
    schedule.date = new Date(Date.now())

    await scheduleRepository.save(schedule)
    return res.status(StatusCodes.OK).json(
      generalResponse(
        StatusCodes.OK,
        {
          id: schedule.id,
          address: schedule.address,
          amount: schedule.amount,
          category: schedule.category,
          container_amount: schedule.container_amount,
          date: schedule.date,
          material: schedule.material,
          material_amount: schedule.material_amount,
          schedule_date: schedule.schedule_date,
          status: schedule.status,
          transaction_id: schedule.transaction?.id,
        },
        [],
        returnSuccess,
      ),
    )
  },
)

const getSchedules = catchController(async (req: Request, res: Response) => {
  const user: User | undefined = req.user

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
  }

  const schedules = await scheduleRepository.find({
    relations: {
      user: true,
      transaction: true,
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
      schedules.map((schedule) => ({
        id: schedule.id,
        address: schedule.address,
        amount: schedule.amount,
        category: schedule.category,
        container_amount: schedule.container_amount,
        date: schedule.date,
        material: schedule.material,
        material_amount: schedule.material_amount,
        schedule_date: schedule.schedule_date,
        status: schedule.status,
        transaction_id: schedule.transaction?.id,
      })),
      [],
      returnSuccess,
    ),
  )
})

const getScheduleById = catchController(async (req: Request, res: Response) => {
  const user: User | undefined = req.user

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
  }

  const scheduleId = String(req.params.id)

  const schedules = await scheduleRepository.find({
    relations: {
      transaction: true,
    },
    where: {
      user: {
        id: user.id,
      },
    },
  })

  const schedule = schedules.find(
    (matchedSchedule) => matchedSchedule.id === scheduleId,
  )

  if (!schedule) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        generalResponse(
          StatusCodes.NOT_FOUND,
          {},
          [],
          'Schedule with this id does not exist',
        ),
      )
  }

  res.status(StatusCodes.OK).json(
    generalResponse(
      StatusCodes.OK,
      {
        id: schedule.id,
        address: schedule.address,
        amount: schedule.amount,
        category: schedule.category,
        container_amount: schedule.container_amount,
        date: schedule.date,
        material: schedule.material,
        material_amount: schedule.material_amount,
        schedule_date: schedule.schedule_date,
        status: schedule.status,
        transaction_id: schedule.transaction?.id,
      },
      [],
      returnSuccess,
    ),
  )
})

const deleteScheduleById = catchController(
  async (req: Request, res: Response) => {
    const user: User | undefined = req.user

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(generalResponse(StatusCodes.NOT_FOUND, '', [], userNotFound))
    }

    const scheduleId = String(req.params.id)

    const schedule = await scheduleRepository.findOne({
      where: {
        id: scheduleId,
        user: { id: user.id },
      },
    })

    if (!schedule) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          generalResponse(
            StatusCodes.NOT_FOUND,
            {},
            [],
            'Schedule with this id does not exist',
          ),
        )
    }

    await scheduleRepository.remove(schedule)

    return res
      .status(StatusCodes.OK)
      .json(
        generalResponse(
          StatusCodes.OK,
          {},
          [],
          'Schedule deleted successfully',
        ),
      )
  },
)

export {
  deleteScheduleById,
  getScheduleById,
  getSchedules,
  schedulePickup,
  updatePickupSchedule,
}
