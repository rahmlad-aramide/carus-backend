import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from './user'

export enum RedemptionType {
  AIRTIME = 'airtime',
  CASH = 'cash',
}

@Entity({ name: 'redemptions' })
export class Redemption {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({
    type: 'enum',
    enum: RedemptionType,
  })
  type?: RedemptionType

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount?: number

  @Column({ nullable: true })
  network?: string

  @Column({ nullable: true })
  phoneNumber?: string

  @Column({ nullable: true })
  accountNumber?: string

  @Column({ nullable: true })
  bankName?: string

  @Column({ nullable: true })
  accountName?: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @ManyToOne(() => User, (user) => user.redemptions)
  user?: User
}
