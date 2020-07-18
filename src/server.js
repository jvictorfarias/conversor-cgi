// * Módulos nativos do NodeJS
const http = require('http')
const url = require('url')
const fs = require('fs')
const { resolve } = require('path')

// * Converte para binário e caso seja negativo, transforma em complemento de 2
// * dando shift nos bits 0 para a direita
const convertToBinary = number => (Number(number) >>> 0).toString(2)

// * Função que coloca o número dentro da string que será o resultado adicionado
const result = number => {
  return `
    <div class="jumbotron">
      <h1>O número em binário é : <strong>${number}</strong></h1>
    </div>
  `
}

// * Iniciando o servidor
const server = http.createServer((request, response) => {
  // * Decode da URL explicitando que ela recebe query strings, com o "true"
  const parsedURL = url.parse(request.url, true)

  // * Verifico se a URL está correta
  if (parsedURL.pathname === '/') {
    // * Acesso o meu arquivo .html que quero retornar para o cliente
    fs.readFile(
      resolve(__dirname, 'html', 'index.html'),
      { encoding: 'utf-8' },
      // * Acesso "indexPage", que é nossa home, como uma string
      (err, indexPage) => {
        if (err) response.end('Error')

        // * Acesso os query strings da url decodificada
        const { query } = parsedURL

        // * Configuro o header para que o navegador entenda como html, não string
        response.writeHead(200, {
          'Content-type': 'text/html'
        })

        // * Se não houver nenhuma query string com nome "number",
        // * não haverá nenhum cálculo

        if (!query.number) {
          indexPage = indexPage.replace(
            /{%RESULT%}/g,
            '<h1>Aguardando a entrada de um número!</h1>'
          )

          // * Retorno a página base
          response.end(indexPage)
        }

        // * Caso haja query strings, converto de decimal para binário e logo
        // * em seguida, substituo o {%RESULT%} pela string com o resultado no
        // * HTML, usando substituição por expressão regular.

        indexPage = indexPage.replace(
          /{%RESULT%}/g,
          result(convertToBinary(query.number))
        )

        // * Retorno a página com o resultado
        response.end(indexPage)
      }
    )
  } else {
    // * Caso a URL esteja errada, retornará not found
    response.writeHead(404)
    response.end('Page not found')
  }
})

// * Inicia a execução do servidor
server.listen(process.env.PORT || 80, () =>
  console.log('Servidor aguardando por conexões...')
)
