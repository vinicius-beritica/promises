import { Repositorio } from 'types/repositorio';
import { chamaApi } from './chama-api';

// Essa função faz a busca de todos os repositórios do usuário no GitLab e
// retorna uma promise do tipo Repositorio.

export const repositoriosGit = async (): Promise<Repositorio[]> => {
  try {
    let pagina = 1;
    let temProjetos = true;
    let todosProjetos = [];

    // Faz a paginação iterando os resultados
    while (temProjetos) {
      // Faz a chamada da api do gitlab e retorna os repositórios
      const reposGit = await chamaApi('', pagina, 20, 'repositórios');
      temProjetos = reposGit.data.length > 0;
      pagina++;
      todosProjetos = todosProjetos.concat(reposGit.data);
    }
    if (!todosProjetos.length) {
      console.log('Este usuário não possui repositórios.');
      return;
    }
    return todosProjetos.map(item => {
      return {
        id: item.id,
        projeto: item.name_with_namespace,
        branches: [],
      };
    });
  } catch (erro: any) {
    throw new Error(`Erro ao gerar os repositórios: ${erro.message}`);
  }
};
