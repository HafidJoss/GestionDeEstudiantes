import { Classroom } from '../../infrastructure/persistence/typeorm/entities/classroom.entity';

export interface IClassroomRepository {
    create(data: Partial<Classroom>): Classroom;
    save(classroom: Classroom): Promise<Classroom>;
    findByTeacherId(teacherId: string): Promise<Classroom[]>;
    findByCode(code: string): Promise<Classroom | null>;
    findById(id: string): Promise<Classroom | null>;
}
