import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ClassroomService } from '../../application/services/classroom.service';

@Controller('classrooms')
export class ClassroomController {
    constructor(private readonly classroomService: ClassroomService) { }

    @Post()
    async create(@Body() dto: { teacherId: string; name: string }) {
        return await this.classroomService.createClassroom(dto.teacherId, dto.name);
    }

    @Get('teacher/:teacherId')
    async listByTeacher(@Param('teacherId') teacherId: string) {
        return await this.classroomService.getClassroomsByTeacher(teacherId);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.classroomService.getClassroomById(id);
    }

    @Post('join')
    async join(@Body() dto: { studentId: string; code: string }) {
        return await this.classroomService.joinClassroom(dto.studentId, dto.code);
    }
}
