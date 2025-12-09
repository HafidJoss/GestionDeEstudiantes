import { Test, TestingModule } from '@nestjs/testing';
import { StreakService } from './streak.service';
import { IStudentRepository } from '../../domain/interfaces/student.repository.interface';
import { IAttendanceRepository } from '../../domain/interfaces/attendance.repository.interface';
import { Student } from '../../infrastructure/persistence/typeorm/entities/student.entity';
import { Attendance, AttendanceStatus } from '../../infrastructure/persistence/typeorm/entities/attendance.entity';

describe('StreakService', () => {
    let service: StreakService;
    let studentRepository: IStudentRepository;
    let attendanceRepository: IAttendanceRepository;

    const mockStudentRepository = {
        findById: jest.fn(),
        save: jest.fn(),
    };

    const mockAttendanceRepository = {
        findLastByStudentId: jest.fn(),
        findLastTwoByStudentId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StreakService,
                { provide: 'IStudentRepository', useValue: mockStudentRepository },
                { provide: 'IAttendanceRepository', useValue: mockAttendanceRepository },
            ],
        }).compile();

        service = module.get<StreakService>(StreakService);
        studentRepository = module.get<IStudentRepository>('IStudentRepository');
        attendanceRepository = module.get<IAttendanceRepository>('IAttendanceRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateStreak', () => {
        it('should return 0 if no attendance exists', async () => {
            mockStudentRepository.findById.mockResolvedValue({ id: '1', streak_metadata: {} } as unknown as Student);
            mockAttendanceRepository.findLastTwoByStudentId.mockResolvedValue([]);

            const streak = await service.calculateStreak('1');
            expect(streak).toBe(0);
            expect(mockStudentRepository.save).toHaveBeenCalledWith(expect.objectContaining({ streak_metadata: { currentStreak: 0, lastUpdate: expect.any(String) } }));
        });

        it('should increment streak if last attendance was yesterday', async () => {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            const student = { id: '1', streak_metadata: { currentStreak: 5, lastUpdate: yesterday.toISOString() } } as unknown as Student;

            const attToday = { date: today, status: AttendanceStatus.PRESENT } as Attendance;
            const attYesterday = { date: yesterday, status: AttendanceStatus.PRESENT } as Attendance;

            mockStudentRepository.findById.mockResolvedValue(student);
            mockAttendanceRepository.findLastTwoByStudentId.mockResolvedValue([attToday, attYesterday]);

            const streak = await service.calculateStreak('1');
            expect(streak).toBe(6);
        });

        it('should maintain streak if last attendance was today (already calculated)', async () => {
            const today = new Date();
            const student = { id: '1', streak_metadata: { currentStreak: 5, lastUpdate: today.toISOString() } } as unknown as Student;

            const attToday = { date: today, status: AttendanceStatus.PRESENT } as Attendance;
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const attYesterday = { date: yesterday, status: AttendanceStatus.PRESENT } as Attendance;

            mockStudentRepository.findById.mockResolvedValue(student);
            mockAttendanceRepository.findLastTwoByStudentId.mockResolvedValue([attToday, attYesterday]);

            const streak = await service.calculateStreak('1');
            expect(streak).toBe(5);
        });

        it('should reset streak if gap > 1 day (weekday)', async () => {
            const today = new Date();
            const past = new Date(today);
            past.setDate(today.getDate() - 3);

            const student = { id: '1', streak_metadata: { currentStreak: 5 } } as unknown as Student;

            const attToday = { date: today } as Attendance;
            const attPast = { date: past } as Attendance;

            mockStudentRepository.findById.mockResolvedValue(student);
            mockAttendanceRepository.findLastTwoByStudentId.mockResolvedValue([attToday, attPast]);

            jest.useFakeTimers().setSystemTime(new Date('2023-12-06T12:00:00Z')); // Wed

            const wed = new Date('2023-12-06T12:00:00Z');
            const sun = new Date('2023-12-03T12:00:00Z'); // 3 days ago.

            const attWed = { date: wed } as Attendance;
            const attSun = { date: sun } as Attendance;

            mockStudentRepository.findById.mockResolvedValue(student);
            mockAttendanceRepository.findLastTwoByStudentId.mockResolvedValue([attWed, attSun]);

            const streak = await service.calculateStreak('1');
            expect(streak).toBe(1);

            jest.useRealTimers();
        });

        it('should NOT break streak if gap is only weekends', async () => {
            const monday = new Date('2023-12-04T12:00:00Z'); // Mon
            const friday = new Date('2023-12-01T12:00:00Z'); // Fri

            jest.useFakeTimers().setSystemTime(monday);

            const student = { id: '1', streak_metadata: { currentStreak: 5 } } as unknown as Student;

            const attMon = { date: monday } as Attendance;
            const attFri = { date: friday } as Attendance;

            mockStudentRepository.findById.mockResolvedValue(student);
            mockAttendanceRepository.findLastTwoByStudentId.mockResolvedValue([attMon, attFri]);

            const streak = await service.calculateStreak('1');
            expect(streak).toBe(6);

            jest.useRealTimers();
        });
    });
});
