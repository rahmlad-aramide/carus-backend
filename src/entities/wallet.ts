import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Contribution } from './contribution'
import { Transaction } from './transactions'
import { User } from './user'

@Entity({ name: 'wallet' })
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  points?: number

  @Column({ nullable: true })
  updatedAt?: Date

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  @JoinColumn()
  transactions?: Transaction[]

  @OneToMany(() => Contribution, (contribution) => contribution.wallet)
  @JoinColumn()
  contributions?: Contribution[]
}
