import React from 'react';
import './SearchBar.css';

export function SearchBar({ searchLine, setSearchLine, vehicleCount, loading }) {
  return (
    <aside className="search-bar">
      <h3>📍 Buscar Linha</h3>
      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
        Digite a linha desejada (ex: 457, 908) para visualizar os ônibus em tempo real.
      </p>
      
      <input 
        type="text" 
        value={searchLine}
        onChange={(e) => setSearchLine(e.target.value)}
        placeholder="Digite o número da linha..." 
        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
      />

      <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#334155' }}>
        {loading ? (
          <span>⏳ Atualizando posições...</span>
        ) : (
          <span>🟢 <strong>{vehicleCount}</strong> ônibus em circulação encontrados.</span>
        )}
      </div>
    </aside>
  );
}