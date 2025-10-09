import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'donations' })
export class Donation {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  title?: string

  @Column({ nullable: false, type: 'text' })
  description?: string

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  target?: number

  @Column({ nullable: false })
  duration?: Date

  @Column({ nullable: true, type: 'varchar' })
  image?: string | null

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}