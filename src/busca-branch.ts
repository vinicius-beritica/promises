import { Branch } from '../types/branch';
import { chamaApi } from './chama-api';

// Essa função faz a busca das branches do repositório no GitLab
// Recebe como parâmetro o Id do repositório e retorna uma promise do tipo Branch.

export const buscaBranches = async (id: number): Promise<Branch[]> => {
  try {
    let pagina = 1;
    let temBranches = true;
    let todasBranches = [];

    // Chama a API conforme o Id do usuário e retorna as branches
    // é realizada a iteração das branches das páginas e concatenadas no resultado.
    while (temBranches) {
      const dadosBranches = await chamaApi(
        `${id}/repository/branches`,
        pagina,
        20,
        'branches',
      );
      temBranches = dadosBranches.data.length > 0;
      pagina++;
      todasBranches = todasBranches.concat(dadosBranches.data);
    }

    // Retorna as 50 primeiras branches do repositório
    return todasBranches
      .map(item => ({
        nome: item.name,
        commits: [item.commit],
      }))
      .slice(0, 50);
  } catch (erro: any) {
    throw new Error(`Erro ao gerar as Branches: ${erro.message}`);
  }
};
