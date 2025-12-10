import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClassrooms1765320500000 implements MigrationInterface {
    name = 'CreateClassrooms1765320500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classrooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying(6) NOT NULL, "teacherId" uuid, CONSTRAINT "UQ_code" UNIQUE ("code"), CONSTRAINT "PK_classrooms" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classrooms_students_students" ("classroomsId" uuid NOT NULL, "studentsId" uuid NOT NULL, CONSTRAINT "PK_classrooms_students" PRIMARY KEY ("classroomsId", "studentsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_classrooms_students_classroomsId" ON "classrooms_students_students" ("classroomsId")`);
        await queryRunner.query(`CREATE INDEX "IDX_classrooms_students_studentsId" ON "classrooms_students_students" ("studentsId")`);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD CONSTRAINT "FK_teacher" FOREIGN KEY ("teacherId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" ADD CONSTRAINT "FK_classrooms_students_classrooms" FOREIGN KEY ("classroomsId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" ADD CONSTRAINT "FK_classrooms_students_students" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" DROP CONSTRAINT "FK_classrooms_students_students"`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" DROP CONSTRAINT "FK_classrooms_students_classrooms"`);
        await queryRunner.query(`ALTER TABLE "classrooms" DROP CONSTRAINT "FK_teacher"`);
        await queryRunner.query(`DROP INDEX "IDX_classrooms_students_studentsId"`);
        await queryRunner.query(`DROP INDEX "IDX_classrooms_students_classroomsId"`);
        await queryRunner.query(`DROP TABLE "classrooms_students_students"`);
        await queryRunner.query(`DROP TABLE "classrooms"`);
    }
}
