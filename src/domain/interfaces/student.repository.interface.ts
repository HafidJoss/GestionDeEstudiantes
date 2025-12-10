import { Student } from '../../infrastructure/persistence/typeorm/entities/student.entity';

export interface IStudentRepository {
    findById(id: string): Promise<Student | null>;
    findByEmail(email: string): Promise<Student | null>;
    create(data: Partial<Student>): Student;
    save(student: Student): Promise<Student>;
    findAll(): Promise<Student[]>;
}
