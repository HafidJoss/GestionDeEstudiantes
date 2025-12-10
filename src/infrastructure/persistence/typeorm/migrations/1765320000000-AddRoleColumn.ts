import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumn1765319000000 implements MigrationInterface {
    name = 'AddRoleColumn1765319000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" ADD "role" character varying NOT NULL DEFAULT 'student'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "role"`);
    }
}
