import { AppDataSource } from '../typeorm/data-source';
import { Student } from '../typeorm/entities/student.entity';
import { Attendance, AttendanceStatus } from '../typeorm/entities/attendance.entity';

async function seed() {
    await AppDataSource.initialize();

    const studentRepository = AppDataSource.getRepository(Student);
    const attendanceRepository = AppDataSource.getRepository(Attendance);

    const studentsData = [
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' },
        { name: 'Bob Smith', email: 'bob@example.com', password: 'password123' },
        { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123' },
        { name: 'David Wilson', email: 'david@example.com', password: 'password123' },
        { name: 'Eve Davis', email: 'eve@example.com', password: 'password123' },
    ];

    for (const studentData of studentsData) {
        let student = await studentRepository.findOneBy({ email: studentData.email });
        if (!student) {
            student = studentRepository.create(studentData);
            await studentRepository.save(student);
            console.log(`Created student: ${student.name}`);
        } else {
            console.log(`Student already exists: ${student.name}`);
        }

        // Generate attendance for the past 30 days
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Random status
            const statuses = Object.values(AttendanceStatus);
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            const attendance = attendanceRepository.create({
                student,
                date,
                status,
            });
            await attendanceRepository.save(attendance);
        }
        console.log(`Generated attendance for ${student.name}`);
    }

    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
});
