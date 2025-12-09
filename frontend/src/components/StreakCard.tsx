import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCardProps {
    streak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
    const fireColor = streak > 5 ? '#ff4500' : '#fcd34d'; // Orange Red vs Amber 300

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
            border: '1px solid #e5e7eb'
        }}>
            <Flame size={64} color={fireColor} fill={fireColor} />
            <h2 style={{ marginTop: '12px', fontSize: '2.5rem', fontWeight: '800', color: '#111827' }}>{streak}</h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', letterSpacing: '0.025em' }}>Días de Racha</p>
        </div>
    );
};
