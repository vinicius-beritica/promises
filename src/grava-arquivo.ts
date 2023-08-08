import fs from 'fs';

// Essa função faz a gravação do arquivo JSON com o resultado dos repositórios

export function gravaArquivo(arg: {}) {
  const data = JSON.stringify(arg);
  const nomePasta = './arquivo';
  try {
    // Cria a pasta no projeto, caso não exista.
    if (!fs.existsSync(nomePasta)) {
      fs.mkdirSync(nomePasta);
    }
    // Salva o arquivo no caminho de pasta dentro do projeto.
    fs.writeFile(`${nomePasta}/repositorios-gitlab.json`, data, (erro: any) => {
      if (erro) throw erro;
    });
  } catch (erro: any) {
    console.log(`Erro ao gravar o arquivo no diretório: ${erro.message}`);
  }
}
