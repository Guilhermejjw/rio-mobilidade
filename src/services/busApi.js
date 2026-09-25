// Endereço usado pelo React para acessar o proxy do Vite.
// O navegador acessa o próprio Vite, e o Vite encaminha
// a requisição para o servidor do Data.Rio.
const API_URL = '/api-rio/sppo/conecta/gps';

/**
 * Busca os ônibus disponíveis na API do Data.Rio.
 *
 * @param {string} lineFilter - Número da linha que o usuário deseja pesquisar.
 * @returns {Promise<Array>} Lista de ônibus.
 */
export async function getBuses(lineFilter = '') {
  try {
    // Pega o horário atual.
    const agora = new Date();

    // Define o início da consulta como 10 minutos atrás.
    const inicio = new Date(
      agora.getTime() - 10 * 60 * 1000
    );

    // Converte as datas para o formato aceito pela API.
    const dataInicial = inicio.toISOString();
    const dataFinal = agora.toISOString();

    // Monta o endereço completo da consulta.
    const url =
      `${API_URL}?dataInicial=${encodeURIComponent(dataInicial)}` +
      `&dataFinal=${encodeURIComponent(dataFinal)}`;

    console.log('Consultando API:', url);

    // Faz a requisição através do proxy do Vite.
    const response = await fetch(url);

    // Se o servidor responder com erro, mostramos o status.
    if (!response.ok) {
      throw new Error(
        `Servidor respondeu com status ${response.status}`
      );
    }

    // Converte a resposta JSON para JavaScript.
    const data = await response.json();

    // A API atual retorna diretamente uma lista.
    const buses = Array.isArray(data) ? data : [];

    console.log('Ônibus recebidos:', buses.length);

    // Se o usuário digitou uma linha,
    // filtramos pelo campo "servico".
    if (lineFilter.trim() !== '') {
      const filtro = lineFilter.trim().toLowerCase();

      return buses.filter((bus) => {
        const linha = (bus.servico || '')
          .toString()
          .toLowerCase();

        return linha.includes(filtro);
      });
    }

    // Se nenhuma linha foi digitada,
    // mostramos todos os ônibus recebidos.
    return buses;

  } catch (error) {
    console.error(
      'Erro ao buscar dados do Data.Rio:',
      error
    );

    // Em caso de erro, retornamos uma lista vazia.
    return [];
  }
}