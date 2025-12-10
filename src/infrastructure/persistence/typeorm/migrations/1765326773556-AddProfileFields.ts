import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileFields1765326773556 implements MigrationInterface {
    name = 'AddProfileFields1765326773556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" ADD "photoUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "students" ADD "phoneNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "photoUrl"`);
    }

}
