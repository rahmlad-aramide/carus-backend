import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from './user'

@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column()
  message?: string

  @ManyToOne(() => User)
  user?: User

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
