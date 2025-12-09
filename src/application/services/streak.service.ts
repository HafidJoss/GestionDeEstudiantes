import { Injectable, Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../domain/interfaces/student.repository.interface';
import type { IAttendanceRepository } from '../../domain/interfaces/attendance.repository.interface';
import { Student } from '../../infrastructure/persistence/typeorm/entities/student.entity';

@Injectable()
export class StreakService {
    constructor(
        @Inject('IStudentRepository')
        private readonly studentRepository: IStudentRepository,
        @Inject('IAttendanceRepository')
        private readonly attendanceRepository: IAttendanceRepository,
    ) { }

    async calculateStreak(studentId: string): Promise<number> {
        const student = await this.studentRepository.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }

        const lastTwoAttendances = await this.attendanceRepository.findLastTwoByStudentId(studentId);

        if (lastTwoAttendances.length === 0) {
            await this.updateStudentStreak(student, 0);
            return 0;
        }

        const latestAttendance = lastTwoAttendances[0];
        const previousAttendance = lastTwoAttendances.length > 1 ? lastTwoAttendances[1] : null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const latestDate = new Date(latestAttendance.date);
        latestDate.setHours(0, 0, 0, 0);

        let currentStreak = student.streak_metadata?.currentStreak || 0;

        if (latestDate.getTime() === today.getTime()) {
            // We attended today.
            if (!previousAttendance) {
                currentStreak = 1;
            } else {
                const previousDate = new Date(previousAttendance.date);
                previousDate.setHours(0, 0, 0, 0);

                // Check if we already updated the streak for today
                const lastUpdate = student.streak_metadata?.lastUpdate ? new Date(student.streak_metadata.lastUpdate) : null;
                if (lastUpdate) {
                    lastUpdate.setHours(0, 0, 0, 0);
                    if (lastUpdate.getTime() === today.getTime()) {
                        return currentStreak;
                    }
                }

                if (this.isConsecutive(previousDate, latestDate)) {
                    currentStreak = (student.streak_metadata?.currentStreak || 0) + 1;
                } else {
                    currentStreak = 1;
                }
            }
        } else {
            // Latest attendance was NOT today (e.g. yesterday or older)
            const diff = this.getDayDifference(latestDate, today);
            if (diff > 1) {
                if (!this.isWeekendGapSafe(latestDate, today)) {
                    currentStreak = 0;
                }
            }
            // If diff == 1 (Yesterday), streak is preserved.
        }

        await this.updateStudentStreak(student, currentStreak, latestDate);
        return currentStreak;
    }

    private async updateStudentStreak(student: Student, streak: number, date: Date = new Date()) {
        student.streak_metadata = {
            currentStreak: streak,
            lastUpdate: date.toISOString()
        };
        await this.studentRepository.save(student);
    }

    private isConsecutive(prev: Date, current: Date): boolean {
        const diff = this.getDayDifference(prev, current);
        if (diff === 1) return true;
        if (diff > 1) {
            return this.isWeekendGapSafe(prev, current);
        }
        return false;
    }

    private isWeekendGapSafe(start: Date, end: Date): boolean {
        const temp = new Date(start);
        temp.setDate(temp.getDate() + 1);

        while (temp.getTime() < end.getTime()) {
            const day = temp.getDay();
            if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
                return false;
            }
            temp.setDate(temp.getDate() + 1);
        }
        return true;
    }

    private getDayDifference(d1: Date, d2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
    }
}
