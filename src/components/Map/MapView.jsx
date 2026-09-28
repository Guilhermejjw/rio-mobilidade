import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

const RIO_CENTER = [-22.9068, -43.1729];
const DEFAULT_ZOOM = 13;

// Ícone original dos ônibus
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

// Ícone do usuário (Ponto Azul)
const userLocationIcon = L.divIcon({
  html: `
    <div class="user-location-marker">
      <div class="pulse"></div>
      <div class="dot"></div>
    </div>
  `,
  className: 'user-marker-container',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Componente para deslizar o mapa até ao utilizador
function RecenterMap({ position }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 15, { duration: 1.5 });
  }
  return null;
}

export function MapView({ vehicles = [] }) {
  const [userPosition, setUserPosition] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Função para capturar o GPS do telemóvel/computador
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo teu navegador.');
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(coords);
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Não foi possível obter a tua localização. Verifica as permissões.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={RIO_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        className="leaflet-map"
      >
        {/* Mapa base estável do OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Centraliza o mapa na posição do utilizador quando encontrada */}
        {userPosition && <RecenterMap position={userPosition} />}

        {/* Ponto azul da tua posição */}
        {userPosition && (
          <Marker position={userPosition} icon={userLocationIcon}>
            <Popup>
              <strong>📍 Estás aqui</strong>
            </Popup>
          </Marker>
        )}

        {/* Seus marcadores originais dos ônibus */}
        {vehicles.map((bus, index) => {
          const lat = parseFloat(bus.latitude || bus.lat);
          const lng = parseFloat(bus.longitude || bus.lon || bus.lng);

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

          const linha = bus.linha || bus.servico || bus.line || bus.route || 'S/N';
          const ordem = bus.ordem || bus.id_veiculo || bus.codigo || bus.id || 'S/N';
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

      {/* Botão para focar na tua localização */}
      <button
        className={`location-btn ${loadingLocation ? 'loading' : ''}`}
        onClick={handleLocateUser}
        title="Minha Localização"
      >
        🎯
      </button>
    </div>
  );
}