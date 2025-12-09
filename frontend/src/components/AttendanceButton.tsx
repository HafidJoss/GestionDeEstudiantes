import React from 'react';

interface AttendanceButtonProps {
    onClick: () => void;
    loading: boolean;
}

export const AttendanceButton: React.FC<AttendanceButtonProps> = ({ onClick, loading }) => {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#34d399', // Emerald-400
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '24px',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
                transition: 'transform 0.1s ease, background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#10b981'} // Emerald-500
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34d399'}
        >
            {loading ? 'Marcando...' : 'Marcar Asistencia de Hoy'}
        </button>
    );
};
