import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';
import { Student } from './student.entity';

export enum SubmissionStatus {
    PENDING = 'PENDING',
    SUBMITTED = 'SUBMITTED',
    GRADED = 'GRADED',
}

@Entity('submissions')
export class Submission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    task_id: string;

    @ManyToOne(() => Task, (task) => task.submissions)
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @Column()
    student_id: string;

    @ManyToOne(() => Student, (student) => student.submissions)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ type: 'timestamp', nullable: true })
    submitted_at: Date;

    @Column({
        type: 'enum',
        enum: SubmissionStatus,
        default: SubmissionStatus.PENDING,
    })
    status: SubmissionStatus;
}
