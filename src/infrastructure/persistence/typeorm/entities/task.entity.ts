import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Submission } from './submission.entity';
import { Classroom } from './classroom.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'timestamp' })
    deadline: Date;

    @Column('text')
    description: string;

    @OneToMany(() => Submission, (submission) => submission.task)
    submissions: Submission[];

    @ManyToOne(() => Classroom, (classroom) => classroom.tasks)
    classroom: Classroom;
}
