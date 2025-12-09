import { Injectable, Inject } from '@nestjs/common';
import type { IStudentRepository } from '../../domain/interfaces/student.repository.interface';
import { Task } from '../../infrastructure/persistence/typeorm/entities/task.entity';
import { Submission, SubmissionStatus } from '../../infrastructure/persistence/typeorm/entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dtos/create-student.dto';

@Injectable()
export class StudentService {
    constructor(
        @Inject('IStudentRepository')
        private readonly studentRepository: IStudentRepository,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(Submission)
        private readonly submissionRepository: Repository<Submission>,
    ) { }

    async getDashboard(studentId: string) {
        const student = await this.studentRepository.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }

        const allTasks = await this.taskRepository.find();
        const studentSubmissions = await this.submissionRepository.find({
            where: { student_id: studentId }
        });

        const pendingTasks = allTasks.filter(task => {
            const submission = studentSubmissions.find(s => s.task_id === task.id);
            return !submission || submission.status === SubmissionStatus.PENDING;
        });

        return {
            student: {
                id: student.id,
                name: student.name,
                email: student.email,
            },
            streak: student.streak_metadata?.currentStreak || 0,
            pendingTasks: pendingTasks.map(t => ({
                id: t.id,
                title: t.title,
                deadline: t.deadline
            }))
        };
    }

    async createStudent(dto: CreateStudentDto) {
        // In a real app, hash password here
        const student = this.studentRepository.create(dto);
        return await this.studentRepository.save(student);
    }
}
