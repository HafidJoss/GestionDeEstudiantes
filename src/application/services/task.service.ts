import { Injectable, Inject } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { Classroom } from '../../infrastructure/persistence/typeorm/entities/classroom.entity';
import { Task } from '../../infrastructure/persistence/typeorm/entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(Classroom)
        private readonly classroomRepository: Repository<Classroom>,
    ) { }

    async createTask(dto: CreateTaskDto) {
        const classroom = await this.classroomRepository.findOneBy({ id: dto.classroomId });
        if (!classroom) throw new Error('Classroom not found');

        const task = this.taskRepository.create({
            title: dto.title,
            deadline: new Date(dto.deadline),
            description: dto.description,
            classroom: classroom
        });
        return await this.taskRepository.save(task);
    }
}
