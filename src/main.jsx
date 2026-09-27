import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'    // <--- Liga com o App.jsx
import './index.css'         // <--- Liga os estilos globais

// Classe que captura erros de renderização e evita a tela branca
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado no React:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#333' }}>
          <h2>Ops! Algo deu errado ao carregar o mapa.</h2>
          <p style={{ color: 'red' }}>{this.state.error?.toString()}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px', cursor: 'pointer' }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

// Procura no index.html a div com id="root" e desenha o App com proteção contra erros
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)