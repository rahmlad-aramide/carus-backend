import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1715893756091 implements MigrationInterface {
  name = 'Init1715893756091'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "configurations" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_ef9fc29709cc5fc66610fc6a664" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "points" numeric(10,2) NOT NULL DEFAULT '0', "naira_amount" numeric(10,2) NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP, "userId" uuid, "userEmail" character varying, CONSTRAINT "REL_843025588ded958efd71761885" UNIQUE ("userId", "userEmail"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "address" character varying, "region" character varying, "city" character varying, "phone" numeric, "email" character varying NOT NULL, "password" character varying, "username" character varying, "role" character varying NOT NULL, "avatar" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'INACTIVE', "gender" character varying, "dob" date, "otp" character varying, "otpExpires" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "googleId" character varying, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_f382af58ab36057334fb262efd5" UNIQUE ("googleId"), CONSTRAINT "PK_e752aee509d8f8118c6e5b1d8cc" PRIMARY KEY ("id", "email"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" "public"."schedule_category_enum" NOT NULL DEFAULT 'pickup', "material" "public"."schedule_material_enum" NOT NULL DEFAULT 'plastic', "amount" numeric(10,2) NOT NULL DEFAULT '0', "material_amount" integer NOT NULL, "container_amount" integer NOT NULL, "address" character varying NOT NULL, "lga" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "schedule_date" TIMESTAMP NOT NULL, "transactionId" uuid, "userId" uuid, "userEmail" character varying, CONSTRAINT "REL_a409990e95d746630f49878179" UNIQUE ("transactionId"), CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "amount" numeric(10,2) NOT NULL DEFAULT '0', "charges" numeric(10,2) NOT NULL DEFAULT '0', "date" TIMESTAMP NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "userId" uuid, "userEmail" character varying, "walletId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_843025588ded958efd71761885f" FOREIGN KEY ("userId", "userEmail") REFERENCES "users"("id","email") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD CONSTRAINT "FK_a409990e95d746630f498781790" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD CONSTRAINT "FK_9ddb06c53d6b64a0a3bceb1ebbf" FOREIGN KEY ("userId", "userEmail") REFERENCES "users"("id","email") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_503aff3fbe6e834e47d6f3d600a" FOREIGN KEY ("userId", "userEmail") REFERENCES "users"("id","email") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_503aff3fbe6e834e47d6f3d600a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "schedule" DROP CONSTRAINT "FK_9ddb06c53d6b64a0a3bceb1ebbf"`,
    )
    await queryRunner.query(
      `ALTER TABLE "schedule" DROP CONSTRAINT "FK_a409990e95d746630f498781790"`,
    )
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_843025588ded958efd71761885f"`,
    )
    await queryRunner.query(`DROP TABLE "transaction"`)
    await queryRunner.query(`DROP TABLE "schedule"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "wallet"`)
    await queryRunner.query(`DROP TABLE "configurations"`)
  }
}
