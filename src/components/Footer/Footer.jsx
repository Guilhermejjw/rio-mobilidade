import React from 'react';
import './Footer.css';

export function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f1f5f9',
      padding: '8px',
      textAlign: 'center',
      fontSize: '0.75rem',
      color: '#64748b'
    }}>
      <p>Dados abertos fornecidos pela Prefeitura do Rio de Janeiro (Data.Rio)</p>
    </footer>
  );
}