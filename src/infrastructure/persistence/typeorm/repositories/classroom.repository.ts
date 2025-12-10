import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClassroomRepository } from '../../../../domain/interfaces/classroom.repository.interface';
import { Classroom } from '../entities/classroom.entity';

@Injectable()
export class ClassroomRepository implements IClassroomRepository {
    constructor(
        @InjectRepository(Classroom)
        private readonly typeOrmRepository: Repository<Classroom>,
    ) { }

    create(data: Partial<Classroom>): Classroom {
        return this.typeOrmRepository.create(data);
    }

    async save(classroom: Classroom): Promise<Classroom> {
        return await this.typeOrmRepository.save(classroom);
    }

    async findByTeacherId(teacherId: string): Promise<Classroom[]> {
        return await this.typeOrmRepository.find({
            where: { teacher: { id: teacherId } },
            relations: ['students']
        });
    }

    async findByCode(code: string): Promise<Classroom | null> {
        return await this.typeOrmRepository.findOne({
            where: { code },
            relations: ['teacher', 'students']
        });
    }

    async findById(id: string): Promise<Classroom | null> {
        return await this.typeOrmRepository.findOne({
            where: { id },
            relations: ['teacher', 'students']
        });
    }
}
