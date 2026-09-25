import React from 'react';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

const RIO_CENTER = [-22.9068, -43.1729];
const DEFAULT_ZOOM = 13;

const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

export function MapView({ vehicles = [] }) {
  return (
    <div className="map-wrapper">
      <MapContainer 
        center={RIO_CENTER} 
        zoom={DEFAULT_ZOOM} 
        zoomControl={false}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((bus, index) => {
          // Extrai latitude e longitude
          const lat = parseFloat(bus.latitude || bus.lat);
          const lng = parseFloat(bus.longitude || bus.lon || bus.lng);

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

          // Procura o valor da LINHA em todas as chaves possíveis que a API do Rio envia
          const linha = bus.linha || bus.servico || bus.line || bus.route || 'S/N';

          // Procura a IDENTIFICAÇÃO DO CARRO em todas as chaves possíveis
          const ordem = bus.ordem || bus.id_veiculo || bus.codigo || bus.id || 'S/N';

          // Procura a VELOCIDADE
          const vel = bus.velocidade !== undefined ? bus.velocidade : (bus.speed !== undefined ? bus.speed : 0);

          return (
            <Marker 
              key={ordem !== 'S/N' ? `${ordem}-${index}` : index} 
              position={[lat, lng]} 
              icon={busIcon}
            >
              <Popup>
                <div style={{ textAlign: 'left', lineHeight: '1.4' }}>
                  <strong>🚌 Linha: {linha}</strong><br />
                  <span>Carro: {ordem}</span><br />
                  <span>Velocidade: {vel} km/h</span><br />
                  <small style={{ color: '#64748b' }}>
                    {bus.datetime || bus.datahora 
                      ? `Atualizado às ${new Date(bus.datetime || bus.datahora).toLocaleTimeString('pt-BR')}` 
                      : 'Atualizado em tempo real'}
                  </small>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}