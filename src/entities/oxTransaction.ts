import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { OxSchedule } from './oxSchedule'

@Entity({ name: 'oxTransaction' })
export class OxTransaction {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  type?: string //pickup or dropoff or withdrawal

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 7,
    default: 0,
  })
  amount?: number

  @Column({ nullable: false })
  oxAddress?: string

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  charges?: number

  @Column({ nullable: false })
  createdAt?: Date

  @Column({ nullable: true })
  acceptedAt?: Date

  @Column({ nullable: true })
  fulfilledAt?: Date

  @Column({ nullable: true })
  cancelledAt?: Date

  @Column({ nullable: false, default: 'pending' })
  status?: string //fulfilled or cancelled

  @OneToOne(() => OxSchedule, (schedule) => schedule.transaction)
  schedule?: OxSchedule
}
