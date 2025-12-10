import { Controller, Get, Param, Post, Put, Body } from '@nestjs/common';
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

    @Put(':id')
    async updateProfile(@Param('id') id: string, @Body() dto: any) {
        return this.studentService.updateStudent(id, dto);
    }

    @Get()
    async getAll() {
        return await this.studentService.getAllStudents();
    }

    @Post('login')
    async login(@Body() dto: any) {
        const student = await this.studentService.validateStudent(dto.email, dto.password);
        if (!student) {
            return { error: 'Invalid credentials' };
        }
        return {
            id: student.id,
            name: student.name,
            email: student.email,
            role: student.role
        };
    }
}
