import { CityEnum } from './user'

export interface ScheduleRow {
  id: string
  category: CategoryEnum
  material: MaterialEnum
  material_amount: number
  container_amount: number
  address: string
  lga: CityEnum
  date: Date
  status: ScheduleStatusEnum
  scheduleDate: Date
  oxAddress?: string
  country_code?: string
  phone?: string
}

export enum CategoryEnum {
  PICKUP = 'pickup',
  DROPOFF = 'dropoff',
}

export enum MaterialEnum {
  PLASTIC = 'plastic',
  PAPER = 'paper',
  E_WASTE = 'e-waste',
  ORGANIC = 'organic',
  METAL = 'metal',
  GLASS = 'glass',
  MIXED_WASTE = 'mixed-waste',
}

export enum ScheduleStatusEnum {
  PENDING = 'pending',
  MISSED = 'missed',
  COMPLETED = 'completed',
}

export const isWeekend = (date: Date): boolean => {
  const dateString = new Date(date)
  const dayOfWeek = dateString.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}
