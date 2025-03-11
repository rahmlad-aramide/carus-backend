import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'configurations' })
export class Configurations {
  @PrimaryGeneratedColumn('rowid')
  id?: string

  @Column({ nullable: false })
  type?: string

  @Column({ nullable: false })
  createdAt?: Date

  @Column({ nullable: false })
  updatedAt?: Date

  @Column({ nullable: false })
  value?: string
}
