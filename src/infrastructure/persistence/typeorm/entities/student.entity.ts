import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Attendance } from './attendance.entity';
import { Submission } from './submission.entity';
import { Classroom } from './classroom.entity';

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

    @Column({ nullable: true })
    photoUrl: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ type: 'jsonb', default: {} })
    streak_metadata: Record<string, any>;

    @Column({ default: 'student' })
    role: string;

    @OneToMany(() => Attendance, (attendance) => attendance.student)
    attendance: Attendance[];

    @OneToMany(() => Submission, (submission) => submission.student)
    submissions: Submission[];

    @OneToMany(() => Classroom, (classroom) => classroom.teacher)
    ownedClassrooms: Classroom[];

    @ManyToMany(() => Classroom, (classroom) => classroom.students)
    enrolledClassrooms: Classroom[];
}
