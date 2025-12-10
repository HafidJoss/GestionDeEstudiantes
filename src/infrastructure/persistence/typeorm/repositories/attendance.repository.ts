import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAttendanceRepository } from '../../../../domain/interfaces/attendance.repository.interface';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class AttendanceRepository implements IAttendanceRepository {
    constructor(
        @InjectRepository(Attendance)
        private readonly typeOrmRepository: Repository<Attendance>,
    ) { }

    async findLastByStudentId(studentId: string): Promise<Attendance | null> {
        return await this.typeOrmRepository.findOne({
            where: { student_id: studentId },
            order: { date: 'DESC' },
        });
    }

    async findLastTwoByStudentId(studentId: string): Promise<Attendance[]> {
        return await this.typeOrmRepository.find({
            where: { student_id: studentId },
            order: { date: 'DESC' },
            take: 2,
        });
    }

    async findAllByStudentId(studentId: string): Promise<Attendance[]> {
        return await this.typeOrmRepository.find({
            where: { student_id: studentId },
            order: { date: 'DESC' },
        });
    }

    async save(attendance: Partial<Attendance>): Promise<Attendance> {
        return await this.typeOrmRepository.save(attendance);
    }
}
