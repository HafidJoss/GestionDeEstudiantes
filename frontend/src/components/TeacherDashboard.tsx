import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const navigate = useNavigate();
    const [selectedClassroom, setSelectedClassroom] = useState<any | null>(null);
    const [teacherProfile, setTeacherProfile] = useState<any>(null);
    const [showMenu, setShowMenu] = useState(false);

    // Task creation state
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', deadline: '', description: '' });

    // Attendance view state
    const [viewAttendanceStudent, setViewAttendanceStudent] = useState<any | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);

    // Close menu when clicking outside
    useEffect(() => {
        const closeMenu = () => setShowMenu(false);
        if (showMenu) {
            window.addEventListener('click', closeMenu);
        }
        return () => window.removeEventListener('click', closeMenu);
    }, [showMenu]);

    // Responsive state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchData = async () => {
        const role = localStorage.getItem('role');
        const teacherId = localStorage.getItem('studentId');

        if (role !== 'professor' || !teacherId) {
            navigate('/');
            return;
        }

        try {
            const [allStudents, myClassrooms] = await Promise.all([
                api.getAllStudents(),
                api.getTeacherClassrooms(teacherId)
            ]);

            // Find current teacher profile
            const teacher = allStudents.find(s => s.id === teacherId);
            setTeacherProfile(teacher || { name: 'Profesor', email: '' });

            setStudents(allStudents.filter(s => s.role === 'student'));
            setClassrooms(myClassrooms);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const teacherId = localStorage.getItem('studentId');
            if (teacherId) {
                await api.createClassroom({ teacherId, name: newClassName });
                setNewClassName('');
                setShowCreateClass(false);
                fetchData(); // Refresh list
            }
        } catch (error) {
            alert('Error al crear el salón');
        }
    };

    const handleClassClick = async (classId: string) => {
        try {
            const data = await api.getClassroomDetails(classId);
            setSelectedClassroom(data);
            setShowCreateTask(false); // Reset task form logic
        } catch (error) {
            console.error('Error loading class details', error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedClassroom) {
                await api.createTask({ ...newTask, classroomId: selectedClassroom.id });
                alert('Tarea asignada con éxito');
                setNewTask({ title: '', deadline: '', description: '' });
                setShowCreateTask(false);
                // Optionally refresh classroom details if backend returns updated tasks, 
                // but usually we just need to know it succeeded.
            }
        } catch (error) {
            alert('Error al asignar tarea');
        }
    };

    const handleViewAttendance = async (student: any) => {
        try {
            const history = await api.getStudentAttendance(student.id);
            setAttendanceHistory(history);
            setViewAttendanceStudent(student);
        } catch (error) {
            console.error('Error fetching attendance', error);
            alert('Error al cargar asistencia');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando...</div>;

    return (
        <div style={{ maxWidth: '95%', margin: '20px auto', padding: '15px' }}>
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: '15px',
                position: 'relative'
            }}>
                <h1 style={{ color: '#064e3b', margin: 0 }}>
                    Hola, {teacherProfile?.name?.split(' ')[0] || 'Profesor'}
                </h1>

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
                        {teacherProfile?.photoUrl ? (
                            <img
                                src={teacherProfile.photoUrl}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#10b981', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                {teacherProfile?.name?.charAt(0).toUpperCase() || 'P'}
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
                                    localStorage.clear();
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
            </div>

            {/* Modal for Classroom Details */}
            {selectedClassroom && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }} onClick={() => setSelectedClassroom(null)}>
                    <div style={{
                        backgroundColor: 'white', padding: '30px', borderRadius: '15px',
                        width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        animation: 'pop-in 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#111827' }}>{selectedClassroom.name}</h2>
                            <button onClick={() => setSelectedClassroom(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>X</button>
                        </div>

                        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0e7ff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#3730a3' }}>Código de Acceso:</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', color: '#1e1b4b' }}>{selectedClassroom.code}</span>
                        </div>

                        {/* Task Assignment Section */}
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => setShowCreateTask(!showCreateTask)}
                                style={{
                                    width: '100%', padding: '10px', backgroundColor: '#f59e0b', color: 'white',
                                    border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                            >
                                {showCreateTask ? 'Cancelar Asignación' : '📝 Asignar Tarea'}
                            </button>

                            {showCreateTask && (
                                <form onSubmit={handleCreateTask} style={{
                                    padding: '15px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fcd34d',
                                    display: 'flex', flexDirection: 'column', gap: '10px'
                                }}>
                                    <input
                                        placeholder="Título de la tarea"
                                        value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                    />
                                    <textarea
                                        placeholder="Descripción"
                                        value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                        required
                                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', minHeight: '60px' }}
                                    />
                                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#4b5563' }}>Fecha límite:</label>
                                    <input
                                        type="datetime-local"
                                        value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                        required
                                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                    />
                                    <button type="submit" style={{ padding: '10px', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Confirmar Asignación
                                    </button>
                                </form>
                            )}
                        </div>

                        <h3 style={{ borderBottom: '2px solid #f3f4f6', paddingBottom: '10px', color: '#374151' }}>Estudiantes Inscritos ({selectedClassroom.students?.length || 0})</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                            {selectedClassroom.students && selectedClassroom.students.length > 0 ? (
                                selectedClassroom.students.map((student: any) => (
                                    <div key={student.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '15px',
                                        padding: '10px', borderRadius: '8px', backgroundColor: '#f9fafb',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{
                                                width: '30px', height: '30px', borderRadius: '50%',
                                                backgroundColor: '#d1fae5', color: '#065f46',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
                                            }}>
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{student.name}</p>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{student.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewAttendance(student)}
                                            style={{
                                                padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                                            }}
                                        >
                                            📅 Ver Asistencia
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' }}>Aún no hay estudiantes inscritos en este salón.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '30px'
            }}>
                {/* Section 1: Classrooms */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: '#1f2937', margin: 0, fontSize: '1.5rem' }}>Mis Salones</h2>
                        <button
                            onClick={() => setShowCreateClass(!showCreateClass)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            + Crear
                        </button>
                    </div>

                    {showCreateClass && (
                        <form onSubmit={handleCreateClass} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input
                                value={newClassName}
                                onChange={e => setNewClassName(e.target.value)}
                                placeholder="Nombre del salón"
                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                required
                            />
                            <button type="submit" style={{ padding: '10px', backgroundColor: '#059669', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
                        </form>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '15px'
                    }}>
                        {classrooms.length === 0 ? (
                            <p style={{ color: '#6b7280', fontStyle: 'italic', gridColumn: '1/-1' }}>No tienes salones creados.</p>
                        ) : (
                            classrooms.map(cls => (
                                <div key={cls.id}
                                    onClick={() => handleClassClick(cls.id)}
                                    style={{
                                        backgroundColor: 'white',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                        borderLeft: '5px solid #3b82f6',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <h3 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>{cls.name}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Código:</span>
                                            <span style={{
                                                backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '6px',
                                                fontWeight: 'bold', fontFamily: 'monospace', fontSize: '1.1rem'
                                            }}>{cls.code}</span>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: '#3b82f6', alignSelf: 'flex-end', marginTop: '5px' }}>Ver Detalles</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Section 2: All Students */}
                <div>
                    <h2 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '1.5rem' }}>Directorio</h2>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', maxHeight: '500px', overflowY: 'auto' }}>
                        {students.length === 0 ? (
                            <p style={{ color: '#6b7280' }}>No hay estudiantes registrados.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {students.map(student => (
                                    <div key={student.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        paddingBottom: '15px',
                                        borderBottom: '1px solid #f3f4f6'
                                    }}>
                                        <div style={{
                                            width: '35px',
                                            height: '35px',
                                            minWidth: '35px',
                                            borderRadius: '50%',
                                            backgroundColor: '#d1fae5',
                                            color: '#065f46',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{ margin: 0, fontWeight: '600', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.name}</p>
                                            <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Attendance History */}
            {viewAttendanceStudent && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
                }} onClick={() => setViewAttendanceStudent(null)}>
                    <div style={{
                        backgroundColor: 'white', padding: '30px', borderRadius: '15px',
                        width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#111827' }}>Asistencia: {viewAttendanceStudent.name}</h2>
                            <button onClick={() => setViewAttendanceStudent(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>X</button>
                        </div>

                        {attendanceHistory.length === 0 ? (
                            <p style={{ color: '#6b7280', textAlign: 'center' }}>No hay registros de asistencia.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {attendanceHistory.map((record: any) => (
                                    <div key={record.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '8px'
                                    }}>
                                        <span style={{ fontWeight: 'bold', color: '#374151' }}>
                                            {new Date(record.date).toLocaleDateString()} {new Date(record.date).toLocaleTimeString()}
                                        </span>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                            backgroundColor: record.status === 'PRESENT' ? '#d1fae5' : '#fee2e2',
                                            color: record.status === 'PRESENT' ? '#065f46' : '#991b1b'
                                        }}>
                                            {record.status === 'PRESENT' ? 'ASISTIÓ' : 'FALTA'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
