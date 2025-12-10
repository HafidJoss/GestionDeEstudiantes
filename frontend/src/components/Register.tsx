import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const student = await api.register({ name, email, password, role });
            if (student && student.id) {
                // Save ID to simple auth storage
                localStorage.setItem('studentId', student.id);
                alert('Registro exitoso! Bienvenido ' + student.name);
                navigate('/');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Error al registrar. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '90%', maxWidth: '400px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#064e3b', marginBottom: '20px' }}>Registro Estudiante</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="text"
                    placeholder="Nombre Completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />

                <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        fontFamily: 'inherit'
                    }}
                >
                    <option value="student">Estudiante</option>
                    <option value="professor">Profesor</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px',
                        backgroundColor: '#34d399',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
};
