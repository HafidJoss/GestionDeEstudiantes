import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.login({ email, password });
            if (res.error) {
                setError(res.error);
                setLoading(false);
                return;
            }

            if (res.id) {
                localStorage.setItem('studentId', res.id);
                localStorage.setItem('role', res.role || 'student');

                if (res.role === 'professor') {
                    navigate('/teacher-dashboard');
                } else {
                    navigate('/');
                }
                // Force reload to update dashboard state if needed, or just let useEffect handle it
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
            setError('Error al iniciar sesión');
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', width: '90%', maxWidth: '400px', margin: '40px auto', textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ color: '#064e3b', marginBottom: '20px' }}>Iniciar Sesión</h2>

            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                    {loading ? 'Ingresando...' : 'Entrar'}
                </button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#4b5563' }}>
                ¿No tienes cuenta? <Link to="/register" style={{ color: '#059669', fontWeight: 'bold' }}>Regístrate aquí</Link>
            </p>
        </div>
    );
};
