import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCountryCode1735737434596 implements MigrationInterface {
    name = 'AddCountryCode1735737434596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "country_code" character varying NOT NULL DEFAULT '+234'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country_code"`);
    }

}
