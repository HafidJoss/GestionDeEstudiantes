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
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { TaskController } from './presentation/controllers/task.controller';
import { StudentController } from './presentation/controllers/student.controller';
import { AttendanceService } from './application/services/attendance.service';
import { TaskService } from './application/services/task.service';
import { StudentService } from './application/services/student.service';
import { StreakService } from './application/services/streak.service';
import { StudentRepository } from './infrastructure/persistence/typeorm/repositories/student.repository';
import { AttendanceRepository } from './infrastructure/persistence/typeorm/repositories/attendance.repository';

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
    TypeOrmModule.forFeature([Student, Attendance, Task, Submission]),
  ],
  controllers: [AppController, AttendanceController, TaskController, StudentController],
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
  ],
})
export class AppModule { }
