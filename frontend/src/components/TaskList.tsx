import React from 'react';
import type { Task } from '../services/api';

interface TaskListProps {
    tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return (
        <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '20px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            marginTop: '30px',
            border: '1px solid #e5e7eb'
        }}>
            <h3 style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '16px', marginBottom: '16px', fontSize: '1.2rem', color: '#1f2937', fontWeight: '600' }}>Tareas Pendientes</h3>
            {sortedTasks.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>No tienes tareas pendientes.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {sortedTasks.map(task => (
                        <li key={task.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px 0',
                            borderBottom: '1px solid #f9fafb'
                        }}>
                            <span style={{ color: '#374151', fontSize: '1rem' }}>{task.title}</span>
                            <span style={{
                                color: '#059669', // Emerald-600
                                backgroundColor: '#d1fae5', // Emerald-100
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '0.85rem',
                                fontWeight: '500'
                            }}>
                                {new Date(task.deadline).toLocaleDateString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
