import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStudentRepository } from '../../../../domain/interfaces/student.repository.interface';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentRepository implements IStudentRepository {
    constructor(
        @InjectRepository(Student)
        private readonly typeOrmRepository: Repository<Student>,
    ) { }

    async findById(id: string): Promise<Student | null> {
        return await this.typeOrmRepository.findOne({ where: { id } });
    }

    create(data: Partial<Student>): Student {
        return this.typeOrmRepository.create(data);
    }

    async save(student: Student): Promise<Student> {
        return await this.typeOrmRepository.save(student);
    }
}
