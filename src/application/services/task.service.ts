import { Injectable, Inject } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { Task } from '../../infrastructure/persistence/typeorm/entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) { }

    async createTask(dto: CreateTaskDto) {
        const task = this.taskRepository.create({
            title: dto.title,
            deadline: new Date(dto.deadline),
            description: dto.description
        });
        return await this.taskRepository.save(task);
    }
}
