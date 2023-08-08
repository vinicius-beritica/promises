import axios from 'axios';
import { AxiosResponse } from 'axios';
import { config } from 'dotenv';

config();

// Essa função chama a API do GitLab recebendo como parâmetro o prefixo da url,
// uma string com o nome da função de onde está recebendo a chamada e os dados de paginação
// Retorna uma promise do tipo AxiosResponse com resposta http da requisição e os dados.

export const chamaApi = async (
  urlParam: string,
  pagina: number,
  itemsPorPagina: number,
  fn: string,
): Promise<AxiosResponse<any>> => {
  const token = process.env.GITLAB_TOKEN;
  const api = process.env.URL_API;
  let tentativas = 0;
  let resposta;

  // O loop while tenta três vezes a conexão com a api em caso de erro
  while (tentativas < 3) {
    try {
      // realiza uma requisição assíncrona na api com os dados de parâmetro da url e paginação
      resposta = await axios.get(
        api.concat(`${urlParam}/?page=${pagina}&per_page=${itemsPorPagina}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        },
      );
      break;
    } catch (erro: any) {
      console.error(
        `Tentativa ${tentativas} de chamar a API de ${fn}. Erro: ${erro.message}`,
      );
      tentativas++;
    }
  }
  if (tentativas === 3) {
    throw new Error(`Não foi possível a conexão com a API de ${fn}`);
  }
  return resposta;
};
