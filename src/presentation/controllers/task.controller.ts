import { Controller, Post, Body } from '@nestjs/common';
import { TaskService } from '../../application/services/task.service';
import { CreateTaskDto } from '../../application/dtos/create-task.dto';

@Controller('assignments')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto) {
        return await this.taskService.createTask(createTaskDto);
    }
}
