import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { StudentDashboard } from '../services/api';
import { StreakCard } from './StreakCard';
import { TaskList } from './TaskList';
import { AttendanceButton } from './AttendanceButton';

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<StudentDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [attLoading, setAttLoading] = useState(false);
    const navigate = useNavigate();

    // Get student ID from storage
    const STUDENT_ID = localStorage.getItem('studentId');

    const fetchData = async () => {
        if (!STUDENT_ID) return;
        try {
            const dashboardData = await api.getDashboard(STUDENT_ID);
            setData(dashboardData);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            // Fallback for demo if backend is not running
            setData({
                student: { id: STUDENT_ID, name: 'Estudiante Demo', email: 'demo@test.com' },
                streak: 3,
                pendingTasks: [
                    { id: '1', title: 'Matemáticas: Álgebra', deadline: new Date(Date.now() + 86400000).toISOString() },
                    { id: '2', title: 'Historia: Ensayo', deadline: new Date(Date.now() + 172800000).toISOString() }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!STUDENT_ID) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [STUDENT_ID, navigate]);

    const handleAttendance = async () => {
        if (!STUDENT_ID) return;
        setAttLoading(true);
        try {
            const res = await api.markAttendance(STUDENT_ID);
            // Update streak locally or refetch
            if (data) {
                setData({ ...data, streak: res.currentStreak });
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Error al marcar asistencia (Backend no disponible?)');
        } finally {
            setAttLoading(false);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Cargando...</div>;
    }

    if (!data) {
        return <div>Error al cargar datos.</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
            <header style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#064e3b', fontWeight: '700' }}>Hola, {data.student.name}</h1>
            </header>

            <StreakCard streak={data.streak} />

            <AttendanceButton onClick={handleAttendance} loading={attLoading} />

            <TaskList tasks={data.pendingTasks} />
        </div>
    );
};
