import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from '../../application/services/attendance.service';
import { CreateAttendanceDto } from '../../application/dtos/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post()
    async recordAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
        return await this.attendanceService.recordAttendance(createAttendanceDto);
    }
}
