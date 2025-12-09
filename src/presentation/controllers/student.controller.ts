import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { StudentService } from '../../application/services/student.service';

@Controller('students')
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Get(':id/dashboard')
    async getDashboard(@Param('id') id: string) {
        return await this.studentService.getDashboard(id);
    }

    @Post()
    async register(@Body() dto: any) {
        return this.studentService.createStudent(dto);
    }
}
