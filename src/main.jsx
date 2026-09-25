import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'    // <--- Liga com o App.jsx
import './index.css'         // <--- Liga os estilos globais

// Procura no index.html a div com id="root" e desenha o App lá dentro
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)