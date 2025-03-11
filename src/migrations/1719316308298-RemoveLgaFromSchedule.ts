import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveLgaFromSchedule1719316308298 implements MigrationInterface {
  name = 'RemoveLgaFromSchedule1719316308298'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "lga"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "lga" character varying NOT NULL`,
    )
  }
}
