import React, { useState, useEffect } from 'react';

// Importa os componentes visuais do projeto.
import { Header } from './components/Header/Header';
import { MapView } from './components/Map/MapView';
import { SearchBar } from './components/SearchBar/SearchBar';
import { Footer } from './components/Footer/Footer';

// Função responsável por buscar os ônibus na API.
import { getBuses } from './services/busApi';

export function App() {

  // Lista de ônibus que será exibida no mapa.
  const [vehicles, setVehicles] = useState([]);

  // Guarda o número da linha digitado pelo usuário.
  const [searchLine, setSearchLine] = useState('');

  // Indica se os dados estão sendo carregados.
  const [loading, setLoading] = useState(false);


  // Recebe os registros da API e mantém
  // apenas a posição mais recente de cada ônibus.
  const getLatestVehicles = (buses) => {

    // Map permite guardar um único registro para cada veículo.
    const latestByVehicle = new Map();

    buses.forEach((bus) => {

      // Pega o identificador do veículo fornecido pela API.
      const vehicleId = bus.id_veiculo;

      // Se o registro não tiver identificação, ignoramos.
      if (!vehicleId) {
        return;
      }

      // Procura se já temos um registro desse ônibus.
      const existingBus = latestByVehicle.get(vehicleId);

      // Se for a primeira vez que encontramos esse ônibus,
      // guardamos o registro.
      if (!existingBus) {
        latestByVehicle.set(vehicleId, bus);
        return;
      }

      // Converte as datas para números para podermos compará-las.
      const currentDate = new Date(bus.datetime).getTime();
      const existingDate = new Date(existingBus.datetime).getTime();

      // Se este registro for mais recente,
      // substitui o registro anterior.
      if (currentDate > existingDate) {
        latestByVehicle.set(vehicleId, bus);
      }
    });

    // Converte o Map novamente em uma lista.
    return Array.from(latestByVehicle.values());
  };


  // Função que busca os dados dos ônibus na API.
  const fetchVehicles = async () => {

    // Mostra que os dados estão sendo carregados.
    setLoading(true);

    // Busca os registros na API.
    const data = await getBuses();

    // Mostra no Console quantos registros a API enviou.
    console.log('Registros recebidos da API:', data.length);

    // Remove os registros repetidos,
    // mantendo somente a posição mais recente de cada veículo.
    const latestVehicles = getLatestVehicles(data);

    // Mostra no Console quantos veículos únicos restaram.
    console.log(
      'Veículos únicos enviados para o mapa:',
      latestVehicles.length
    );

    // Guarda os veículos para serem utilizados pelo mapa.
    setVehicles(latestVehicles);

    // Finaliza o carregamento.
    setLoading(false);
  };


  // Executa a busca SOMENTE quando o usuário digita uma linha.
  // Atualiza os dados a cada 30 segundos enquanto houver uma linha digitada.
  useEffect(() => {

    // 1. Se o campo de busca estiver vazio, limpa os ônibus e NÃO chama a API.
    if (searchLine.trim() === '') {
      setVehicles([]);
      setLoading(false);
      return;
    }

    // 2. Faz a primeira consulta imediatamente ao digitar.
    fetchVehicles();

    // 3. Cria um temporizador de 30 segundos para atualizar em tempo real a linha buscada.
    const interval = setInterval(() => {
      fetchVehicles();
    }, 30000);

    // Cancela o temporizador quando o usuário muda a busca ou desfaz o componente.
    return () => {
      clearInterval(interval);
    };

  }, [searchLine]); // <-- Escuta as mudanças no campo de busca


  // Filtra os ônibus que já estão na memória
  // de acordo com a linha digitada.
  const filteredVehicles = vehicles.filter((bus) => {

    // Se o campo estiver vazio, não mostra nenhum veículo.
    if (searchLine.trim() === '') {
      return false;
    }

    // Pega o número da linha fornecido pela API.
    const linha = (bus.servico || '')
      .toString()
      .toLowerCase();

    // Verifica se a linha corresponde ao que foi digitado.
    return linha.includes(searchLine.trim().toLowerCase());
  });


  return (
    <div className="app-container">

      {/* Cabeçalho do aplicativo. */}
      <Header />

      <main className="main-content">

        {/* Campo onde o usuário pesquisa uma linha. */}
        <SearchBar
          searchLine={searchLine}
          setSearchLine={setSearchLine}
          vehicleCount={filteredVehicles.length}
          loading={loading}
        />

        {/* Mapa com os ônibus filtrados. */}
        <MapView vehicles={filteredVehicles} />

      </main>

      {/* Rodapé do aplicativo. */}
      <Footer />

    </div>
  );
}

// Permite que App também seja importado como padrão.
export default App;