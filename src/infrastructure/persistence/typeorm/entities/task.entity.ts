import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Submission } from './submission.entity';

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
}
