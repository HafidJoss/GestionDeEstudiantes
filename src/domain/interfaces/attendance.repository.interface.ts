import { Attendance } from '../../infrastructure/persistence/typeorm/entities/attendance.entity';

export interface IAttendanceRepository {
    findLastByStudentId(studentId: string): Promise<Attendance | null>;
    findLastTwoByStudentId(studentId: string): Promise<Attendance[]>;
    save(attendance: Partial<Attendance>): Promise<Attendance>;
}
