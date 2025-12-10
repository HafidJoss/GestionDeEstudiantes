import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const EditProfile: React.FC = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const STUDENT_ID = localStorage.getItem('studentId');

    useEffect(() => {
        if (!STUDENT_ID) navigate('/login');
        const loadData = async () => {
            try {
                const data = await api.getDashboard(STUDENT_ID!);
                setName(data.student.name);
                // We don't have phone/photo in getDashboard response yet, 
                // but let's assume we might need to fetch student details specifically or update getDashboard.
                // For now, start empty or assume dashboard includes them if we updated it (we didn't yet).
                // Let's keep it simple: just update what we have.
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, [STUDENT_ID, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateProfile(STUDENT_ID!, { name, phoneNumber, photoUrl });
            navigate('/');
        } catch (err) {
            setError('Error al actualizar perfil');
            setLoading(false);
        }
    };

    return (
        <div style={{
            width: '90%',
            maxWidth: '500px',
            margin: '40px auto',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slide-up 0.4s ease-out'
        }}>
            <h2 style={{
                color: 'var(--text-main)',
                marginBottom: '30px',
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 800
            }}>
                Editar Perfil
            </h2>
            {error && <div style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: 500
            }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-muted)' }}>Nombre Completo</label>
                    <input
                        value={name} onChange={e => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            transition: 'border-color 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-muted)' }}>Número de Teléfono</label>
                    <input
                        value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="+57 300 123 4567"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            transition: 'border-color 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-muted)' }}>URL Foto de Perfil</label>
                    <input
                        value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            boxSizing: 'border-box',
                            fontSize: '1rem',
                            transition: 'border-color 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                            flex: 1,
                            padding: '14px',
                            backgroundColor: '#f3f4f6',
                            color: '#4b5563',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '1rem'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '14px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)'
                        }}
                    >
                        {loading ? 'Guardando...' : 'Aceptar'}
                    </button>
                </div>
            </form>
        </div>
    );
};
