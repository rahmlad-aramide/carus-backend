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
  status: string
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
}

export const isWeekend = (date: Date): boolean => {
  const dateString = new Date(date)
  const dayOfWeek = dateString.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}
