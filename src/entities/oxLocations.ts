import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'oxLocations' })
export class oxLocations {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ nullable: false })
  address?: string

  @Column({ nullable: false })
  region?: string

  @Column({ nullable: false })
  state?: string

  @Column({ nullable: false })
  country?: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
