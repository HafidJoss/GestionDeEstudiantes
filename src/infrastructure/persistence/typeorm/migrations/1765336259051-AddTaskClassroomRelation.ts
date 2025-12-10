import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskClassroomRelation1765336259051 implements MigrationInterface {
    name = 'AddTaskClassroomRelation1765336259051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" DROP CONSTRAINT "FK_teacher"`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" DROP CONSTRAINT "FK_classrooms_students_classrooms"`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" DROP CONSTRAINT "FK_classrooms_students_students"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_classrooms_students_classroomsId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_classrooms_students_studentsId"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "classroomId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_770f383ad8a78b96c49c54a16e" ON "classrooms_students_students" ("classroomsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8bcd44cb52c662009af658f1fb" ON "classrooms_students_students" ("studentsId") `);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD CONSTRAINT "FK_ea22bf3c6b069755e01340f6334" FOREIGN KEY ("teacherId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_5b41d3674b2fe9b593da650a1a0" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" ADD CONSTRAINT "FK_770f383ad8a78b96c49c54a16e5" FOREIGN KEY ("classroomsId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" ADD CONSTRAINT "FK_8bcd44cb52c662009af658f1fb3" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" DROP CONSTRAINT "FK_8bcd44cb52c662009af658f1fb3"`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" DROP CONSTRAINT "FK_770f383ad8a78b96c49c54a16e5"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_5b41d3674b2fe9b593da650a1a0"`);
        await queryRunner.query(`ALTER TABLE "classrooms" DROP CONSTRAINT "FK_ea22bf3c6b069755e01340f6334"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8bcd44cb52c662009af658f1fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_770f383ad8a78b96c49c54a16e"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "classroomId"`);
        await queryRunner.query(`CREATE INDEX "IDX_classrooms_students_studentsId" ON "classrooms_students_students" ("studentsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_classrooms_students_classroomsId" ON "classrooms_students_students" ("classroomsId") `);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" ADD CONSTRAINT "FK_classrooms_students_students" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classrooms_students_students" ADD CONSTRAINT "FK_classrooms_students_classrooms" FOREIGN KEY ("classroomsId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD CONSTRAINT "FK_teacher" FOREIGN KEY ("teacherId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
