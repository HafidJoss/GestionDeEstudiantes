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
    const [showMenu, setShowMenu] = useState(false);

    // Join Class Modal State
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinStatus, setJoinStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [joinMessage, setJoinMessage] = useState('');

    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const closeMenu = () => setShowMenu(false);
        if (showMenu) {
            window.addEventListener('click', closeMenu);
        }
        return () => window.removeEventListener('click', closeMenu);
    }, [showMenu]);

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
            const role = localStorage.getItem('role');
            if (role === 'professor') {
                navigate('/teacher-dashboard');
                return;
            }
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

    const handleJoinClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!STUDENT_ID || !joinCode.trim()) return;

        setJoinStatus('loading');
        setJoinMessage('');

        try {
            await api.joinClassroom({ studentId: STUDENT_ID, code: joinCode.trim().toUpperCase() });
            setJoinStatus('success');
            setJoinMessage('¡Te has unido a la clase exitosamente!');
            setTimeout(() => {
                setShowJoinModal(false);
                setJoinCode('');
                setJoinStatus('idle');
                setJoinMessage('');
            }, 2000);
        } catch (error: any) {
            setJoinStatus('error');
            setJoinMessage(error.response?.data?.message || 'Error al unirse. Verifica el código.');
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
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <h1 style={{ fontSize: '1.8rem', color: '#064e3b', fontWeight: '700', margin: 0 }}>Hola, {data.student.name}</h1>

                <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            width: '45px',
                            height: '45px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    >
                        {data.student.photoUrl ? (
                            <img
                                src={data.student.photoUrl}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#10b981', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {data.student.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </button>

                    {showMenu && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '110%',
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            borderRadius: '8px',
                            minWidth: '160px',
                            zIndex: 10,
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb'
                        }}>
                            <button
                                onClick={() => navigate('/profile/edit')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    color: '#374151',
                                    borderBottom: '1px solid #f3f4f6'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                ✏️ Editar Perfil
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('studentId');
                                    navigate('/login');
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    color: '#ef4444',
                                    fontWeight: 'bold'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <StreakCard streak={data.streak} />

            <div style={{ margin: '30px 0', textAlign: 'center' }}>
                <button
                    onClick={() => setShowJoinModal(true)}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)',
                        transition: 'transform 0.1s'
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    + Unirse a Clase
                </button>
            </div>

            {/* Join Class Modal */}
            {showJoinModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }} onClick={() => setShowJoinModal(false)}>
                    <div style={{
                        backgroundColor: 'white', padding: '30px', borderRadius: '16px',
                        width: '90%', maxWidth: '400px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        animation: 'pop-in 0.2s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ margin: '0 0 20px 0', color: '#111827', textAlign: 'center' }}>Unirse a una Clase</h2>

                        <form onSubmit={handleJoinClass}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500' }}>Código de Clase (6 caracteres)</label>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="Ej: A1B2C3"
                                    maxLength={6}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '8px',
                                        border: '2px solid #e5e7eb', fontSize: '1.2rem', textAlign: 'center',
                                        letterSpacing: '4px', fontFamily: 'monospace', textTransform: 'uppercase'
                                    }}
                                    autoFocus
                                />
                            </div>

                            {joinMessage && (
                                <div style={{
                                    marginBottom: '20px', padding: '10px', borderRadius: '8px',
                                    backgroundColor: joinStatus === 'success' ? '#dcfce7' : '#fee2e2',
                                    color: joinStatus === 'success' ? '#166534' : '#991b1b',
                                    textAlign: 'center', fontWeight: '500'
                                }}>
                                    {joinMessage}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowJoinModal(false)}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                                        backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 'bold', cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={joinStatus === 'loading' || joinStatus === 'success' || joinCode.length < 6}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
                                        backgroundColor: joinStatus === 'success' ? '#10b981' : '#3b82f6',
                                        color: 'white', fontWeight: 'bold', cursor: 'pointer',
                                        opacity: (joinStatus === 'loading' || joinCode.length < 6) ? 0.7 : 1
                                    }}
                                >
                                    {joinStatus === 'loading' ? 'Uniéndose...' : joinStatus === 'success' ? '¡Listo!' : 'Unirse'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AttendanceButton onClick={handleAttendance} loading={attLoading} />

            <TaskList tasks={data.pendingTasks} />
        </div>
    );
};
