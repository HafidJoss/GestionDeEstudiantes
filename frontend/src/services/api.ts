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

    async register(data: any): Promise<any> {
        const response = await apiInstance.post('/students', data);
        return response.data;
    },
};
