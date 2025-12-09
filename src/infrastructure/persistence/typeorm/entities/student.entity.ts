import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from './attendance.entity';
import { Submission } from './submission.entity';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'jsonb', default: {} })
    streak_metadata: Record<string, any>;

    @OneToMany(() => Attendance, (attendance) => attendance.student)
    attendance: Attendance[];

    @OneToMany(() => Submission, (submission) => submission.student)
    submissions: Submission[];
}
