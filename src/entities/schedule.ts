import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Transaction } from './transactions'
import { User } from './user'
import { CategoryEnum, MaterialEnum } from '../@types/schedule'

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id?: string

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

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount?: number

  @Column({ nullable: false })
  material_amount?: number

  @Column({ nullable: false })
  container_amount?: number

  @Column({ nullable: false })
  address?: string

  @Column({ nullable: false })
  date?: Date

  @Column({ nullable: false })
  status?: string

  @Column({ nullable: false })
  schedule_date?: Date

  @OneToOne(() => Transaction, (transaction) => transaction.schedule)
  @JoinColumn()
  transaction?: Transaction

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
  @JoinColumn()
  user?: User
}
