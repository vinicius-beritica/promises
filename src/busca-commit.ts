import { Commit } from '../types/commit';
import { chamaApi } from './chama-api';

// Essa função faz a busca dos commits do repositório no GitLab
// Recebe como parâmetro o Id do repositório e retorna uma promise do tipo Commit

export const buscaCommits = async (id: number): Promise<Commit[]> => {
  try {
    let pagina = 1;
    let temCommits = true;
    let todosCommits = [];

    // Chama a API conforme o Id do repositório e o número de commits por página
    // é realizada a iteração dos commits das páginas e concatenadas no resultado.
    while (temCommits) {
      const dadosCommits = await chamaApi(
        `${id}/repository/commits`,
        pagina,
        20,
        'commits',
      );
      temCommits = dadosCommits.data.length > 0;
      pagina++;
      todosCommits = todosCommits.concat(dadosCommits.data);
    }
    // Retorna os commits organizados do mais recente para o mais antigo.
    return todosCommits
      .map(item => {
        return {
          id: item.id,
          mensagem: item.message,
          autor: item.author_name,
          data: item.committed_date,
        };
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  } catch (erro: any) {
    throw new Error(`Erro ao gerar os Commits: ${erro.message}`);
  }
};
