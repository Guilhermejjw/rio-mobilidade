import React from 'react';
import { Bus, MapPin } from 'lucide-react';
import './Header.css';

export function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">
          <Bus size={24} color="#ffffff" />
        </div>
        <div>
          <h1>Rio Mobilidade</h1>
          <p className="header-subtitle">Transporte público em tempo real</p>
        </div>
      </div>
      <div className="city-tag">
        <MapPin size={14} />
        <span>Rio de Janeiro - RJ</span>
      </div>
    </header>
  );
}