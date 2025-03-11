import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Schedule } from './schedule'
import { User } from './user'
import { Wallet } from './wallet'

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  type?: string //pickup or dropoff or withdrawal

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  amount?: number

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  charges?: number

  @Column({ nullable: false })
  date?: Date

  @Column({ nullable: false, default: 'pending' })
  status?: string //fulfilled or cancelled

  @OneToOne(() => Schedule, (schedule) => schedule.transaction)
  schedule?: Schedule

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'SET NULL' })
  @JoinColumn()
  user?: User

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet?: Wallet
}
