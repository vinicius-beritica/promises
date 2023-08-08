import { repositoriosGit } from '../src/repositorios-gitlab';
import { buscaBranches } from '../src/busca-branch';
import { buscaCommits } from '../src/busca-commit';
import { Repositorio } from 'types/repositorio';
import { config } from 'dotenv';
import { gravaArquivo } from './grava-arquivo';

config();

// Essa função faz a busca de todos os repositórios do usuário no GitLab,
// com as branch e commits dos mesmos.
export const buscaRepositorios = async (): Promise<Repositorio[]> => {
  try {
    // Realiza a busca de todos os repositórios no gitlab.
    const repositorios = await repositoriosGit();
    return await Promise.all(
      repositorios.map(async repo => {
        try {
          // Faz a busca das branches com os seus commits.
          // Aguarda e resolução da função Promise.all()
          // que aguarda a promessa da iteração com a função assíncrona dos commits.
          const branches = await buscaBranches(repo.id);
          const returnaBranches = await Promise.all(
            branches.map(async branch => {
              const commits = await buscaCommits(repo.id);
              return { nome: branch.nome, commits };
            }),
          );
          return {
            projeto: repo.projeto,
            id: repo.id,
            branches: returnaBranches,
          };
        } catch (erro: any) {
          console.log(
            `Falha ao gerar as branches e commtis dos repositórios: ${erro.message}`,
          );
        }
      }),
    );
  } catch (e: any) {
    throw new Error(
      `Falha ao gerar a busca dos repositórios (buscaRepositorios): ${e.message}`,
    );
  }
};
// Chama a função e após a resolução de todas as promises o resultado é impresso no console
// E salvo em um arquivo JSON em uma pasta no projeto.
buscaRepositorios()
  .then(resposta => {
    console.log(JSON.stringify(resposta, null, 2));
    gravaArquivo(resposta);
    return resposta;
  })
  .then(() => console.log('<<< Relatório salvo no diretório ./arquivo >>>'));
