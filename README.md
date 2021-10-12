# Blog em nodejs

'''
rm -r .\node_modules\
npm install --production
'''


## Projeto em desenvolvimento
Projeto desenvolvido na formação NODE do Guia do programador.

O Projeto se trata de um blog em nodejs com sistema de publicação de artigos, paginação, sistema de login, sistema de visualização de artigos, sistema de visualização e edição de artigos e categorias.

Para fazer um editor completo, foi usado o Tiny. O Tiny permite a criação de um editor de código avançado com recursos de adicionar imagem, centralizar, adicionar vídeos, etc. Ele já foi adicionado ao projeto, porém, para mais detalhes seguem os links:
* https://www.tiny.cloud/get-tiny/self-hosted/
* https://www.tiny.cloud/get-tiny/language-packages/

Para executar o projeto além de instalar as bibliotecas é preciso criar uma tabela chamada "guiapress" e configurar o arquivo de conexão na pasta 'database/'


# Conceitos:
## Cokies
* Cokies ficam salvas apenas no navegador
* Secoes ficam salvas no servidor e quando usuário fecha o navegador, tchau secao
* Cokies podem referenciar secoes!

## Middleware
1. Algo que fica no meio entre o usuário e o servidor durante uma requisição.
2. A cada requisição do cliente, a requisição passa pelo middleware.
3. Podemos definir que apenas usuários que tenham uma seção x pode acessar um painel.
4. Middleware é uma função!

## slugify
É nada mais do que transformar titulos em algo como linkes, exemplo:
Titulo: Como instalar o windows 11?
slug: Como-instalar-o-windows-11
