import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Login: React.FC = () => {
    // Keeps simple for now, as requested.
    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2>Iniciar Sesión</h2>
            <p>Por favor, regístrate para obtener un nuevo ID.</p>
            <Link to="/register">
                <button style={{
                    backgroundColor: '#34d399', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', fontSize: '1rem'
                }}>
                    Ir a Registro
                </button>
            </Link>
        </div>
    );
};
