import axios from 'axios';

const API_URL = 'http://localhost:3000';
const apiInstance = axios.create({ baseURL: API_URL });

export interface Task {
    id: string;
    title: string;
    deadline: string;
}

export interface StudentDashboard {
    student: {
        id: string;
        name: string;
        email: string;
        photoUrl?: string;
    };
    streak: number;
    pendingTasks: Task[];
}

export const api = {
    async getDashboard(studentId: string): Promise<StudentDashboard> {
        const response = await apiInstance.get(`/students/${studentId}/dashboard`);
        return response.data;
    },

    async markAttendance(studentId: string): Promise<{ id: string; status: 'PRESENT'; currentStreak: number }> {
        const response = await apiInstance.post('/attendance', { studentId });
        return response.data;
    },

    async getStudentAttendance(studentId: string): Promise<any[]> {
        const response = await apiInstance.get(`/attendance/student/${studentId}`);
        return response.data;
    },

    async register(data: any): Promise<any> {
        const response = await apiInstance.post('/students', data);
        return response.data;
    },

    async login(data: { email: string; password: string }): Promise<any> {
        const response = await apiInstance.post('/students/login', data);
        return response.data;
    },

    async updateProfile(id: string, data: { name?: string; phoneNumber?: string; photoUrl?: string }): Promise<any> {
        const response = await apiInstance.put(`/students/${id}`, data);
        return response.data;
    },

    async getAllStudents(): Promise<any[]> {
        const response = await apiInstance.get('/students');
        return response.data;
    },

    async createClassroom(data: { teacherId: string; name: string }): Promise<any> {
        const response = await apiInstance.post('/classrooms', data);
        return response.data;
    },

    async getTeacherClassrooms(teacherId: string): Promise<any[]> {
        const response = await apiInstance.get(`/classrooms/teacher/${teacherId}`);
        return response.data;
    },

    async getClassroomDetails(id: string): Promise<any> {
        const response = await apiInstance.get(`/classrooms/${id}`);
        return response.data;
    },

    async joinClassroom(data: { studentId: string; code: string }): Promise<any> {
        const response = await apiInstance.post('/classrooms/join', data);
        return response.data;
    },

    async createTask(data: { title: string; deadline: string; description: string; classroomId: string }): Promise<any> {
        const response = await apiInstance.post('/assignments', data);
        return response.data;
    },
};
