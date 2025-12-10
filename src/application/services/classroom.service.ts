import { Injectable, Inject } from '@nestjs/common';
import { IClassroomRepository } from '../../domain/interfaces/classroom.repository.interface';
import { IStudentRepository } from '../../domain/interfaces/student.repository.interface';

@Injectable()
export class ClassroomService {
    constructor(
        @Inject('IClassroomRepository')
        private readonly classroomRepository: IClassroomRepository,
        @Inject('IStudentRepository')
        private readonly studentRepository: IStudentRepository,
    ) { }

    async createClassroom(teacherId: string, name: string) {
        const teacher = await this.studentRepository.findById(teacherId);
        if (!teacher) throw new Error('Teacher not found');
        if (teacher.role !== 'professor') throw new Error('Only professors can create classrooms');

        const code = this.generateCode();
        const classroom = this.classroomRepository.create({
            name,
            code,
            teacher
        });

        return await this.classroomRepository.save(classroom);
    }

    async getClassroomsByTeacher(teacherId: string) {
        return await this.classroomRepository.findByTeacherId(teacherId);
    }

    async joinClassroom(studentId: string, code: string) {
        const classroom = await this.classroomRepository.findByCode(code);
        if (!classroom) throw new Error('Classroom not found');

        const student = await this.studentRepository.findById(studentId);
        if (!student) throw new Error('Student not found');
        if (student.role !== 'student') throw new Error('Only students can join classrooms');

        // Check if already enrolled
        const isEnrolled = classroom.students.some(s => s.id === studentId);
        if (isEnrolled) throw new Error('Student already enrolled');

        classroom.students.push(student);
        return await this.classroomRepository.save(classroom);
    }

    async getClassroomById(id: string) {
        const classroom = await this.classroomRepository.findById(id);
        if (!classroom) throw new Error('Classroom not found');
        return classroom;
    }

    private generateCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}
