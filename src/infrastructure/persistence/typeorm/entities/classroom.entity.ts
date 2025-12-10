import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { Task } from './task.entity';

@Entity('classrooms')
export class Classroom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true, length: 6 })
    code: string;

    @ManyToOne(() => Student, (student) => student.ownedClassrooms)
    teacher: Student;

    @ManyToMany(() => Student, (student) => student.enrolledClassrooms)
    @JoinTable()
    students: Student[];

    @OneToMany(() => Task, (task) => task.classroom)
    tasks: Task[];
}
