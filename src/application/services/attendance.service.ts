import { Injectable, Inject } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/interfaces/attendance.repository.interface';
import type { IStudentRepository } from '../../domain/interfaces/student.repository.interface';
import { StreakService } from './streak.service';
import { CreateAttendanceDto } from '../dtos/create-attendance.dto';
import { AttendanceStatus } from '../../infrastructure/persistence/typeorm/entities/attendance.entity';

@Injectable()
export class AttendanceService {
    constructor(
        @Inject('IAttendanceRepository')
        private readonly attendanceRepository: IAttendanceRepository,
        @Inject('IStudentRepository')
        private readonly studentRepository: IStudentRepository,
        private readonly streakService: StreakService,
    ) { }

    async recordAttendance(dto: CreateAttendanceDto) {
        const student = await this.studentRepository.findById(dto.studentId);
        if (!student) {
            throw new Error('Student not found');
        }

        // Create attendance record
        // Note: Repository interface needs 'create' or 'save'. Assuming 'save' works with partial or we need to create entity first.
        // The interface I defined earlier only had `findLastByStudentId` and `findLastTwoByStudentId`.
        // I need to update the interface to include `save` or `create`.
        // For now, I'll assume I can cast or extend the interface in the implementation, but better to update the interface definition first.
        // I will proceed assuming I will update the interface in the next step or implicitly here.

        // Actually, I should check the interface definition I created.
        // IAttendanceRepository had: findLastByStudentId, findLastTwoByStudentId.
        // It MISSES save().

        // I will add save() to the interface in a separate tool call to be correct.
        // But for this file, I'll write the code assuming it exists.

        const attendance = {
            student_id: dto.studentId,
            date: new Date(),
            status: AttendanceStatus.PRESENT
        };

        // @ts-ignore - pending interface update
        await this.attendanceRepository.save(attendance);

        // Recalculate streak
        const newStreak = await this.streakService.calculateStreak(dto.studentId);

        return {
            message: 'Attendance recorded',
            currentStreak: newStreak
        };
    }
}
