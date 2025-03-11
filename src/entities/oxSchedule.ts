import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { OxTransaction } from './oxTransaction'
import { CategoryEnum, MaterialEnum } from '../@types/schedule'

@Entity({ name: 'oxSchedule' })
export class OxSchedule {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  oxAddress?: string

  @Column({
    type: 'enum',
    enum: CategoryEnum,
    nullable: false,
    default: CategoryEnum.PICKUP,
  })
  category?: CategoryEnum //pickup or dropoff

  @Column({
    type: 'enum',
    enum: MaterialEnum,
    nullable: false,
    default: MaterialEnum.PLASTIC,
  })
  material?: MaterialEnum

  @Column({ type: 'decimal', precision: 10, scale: 7, default: 0 })
  amount?: number

  @Column({ nullable: false })
  material_amount?: number

  @Column({ nullable: false })
  container_amount?: number

  @Column({ nullable: false })
  phone?: string

  @Column({ nullable: false })
  country_code?: string

  @Column({ nullable: false })
  address?: string

  @Column({ nullable: false })
  date?: Date

  @Column({ nullable: false })
  status?: string

  @Column({ nullable: false })
  schedule_date?: Date

  @OneToOne(() => OxTransaction, (transaction) => transaction.schedule)
  @JoinColumn()
  transaction?: OxTransaction
}
