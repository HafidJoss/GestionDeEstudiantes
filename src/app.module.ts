import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './infrastructure/persistence/typeorm/data-source';
import { Student } from './infrastructure/persistence/typeorm/entities/student.entity';
import { Attendance } from './infrastructure/persistence/typeorm/entities/attendance.entity';
import { Task } from './infrastructure/persistence/typeorm/entities/task.entity';
import { Submission } from './infrastructure/persistence/typeorm/entities/submission.entity';
import { Classroom } from './infrastructure/persistence/typeorm/entities/classroom.entity';
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { TaskController } from './presentation/controllers/task.controller';
import { StudentController } from './presentation/controllers/student.controller';
import { AttendanceService } from './application/services/attendance.service';
import { TaskService } from './application/services/task.service';
import { StudentService } from './application/services/student.service';
import { StreakService } from './application/services/streak.service';
import { StudentRepository } from './infrastructure/persistence/typeorm/repositories/student.repository';
import { AttendanceRepository } from './infrastructure/persistence/typeorm/repositories/attendance.repository';
import { ClassroomRepository } from './infrastructure/persistence/typeorm/repositories/classroom.repository';
import { ClassroomService } from './application/services/classroom.service';
import { ClassroomController } from './presentation/controllers/classroom.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      entities: [],
      migrations: [],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Student, Attendance, Task, Submission, Classroom]),
  ],
  controllers: [AppController, AttendanceController, TaskController, StudentController, ClassroomController],
  providers: [
    AppService,
    AttendanceService,
    TaskService,
    StudentService,
    StreakService,
    {
      provide: 'IStudentRepository',
      useClass: StudentRepository,
    },
    {
      provide: 'IAttendanceRepository',
      useClass: AttendanceRepository,
    },
    {
      provide: 'IClassroomRepository',
      useClass: ClassroomRepository,
    },
    ClassroomService,
  ],
})
export class AppModule { }
