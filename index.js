const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const q = url.parse(req.url, true).query;

  if (!q.i) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <h1>Reajuste Salarial</h1>
      <p>Use a URL no formato:</p>
      <code>http://localhost:3000/?i=25&s=F&sb=2000&a=2015&m=123</code>
    `);
    return;
  }

  const idade = parseInt(q.i);
  const sexo = q.s;
  const salarioBase = parseFloat(q.sb);
  const anoContratacao = parseInt(q.a);
  const matricula = parseInt(q.m);

  if (
    idade <= 16 ||
    isNaN(salarioBase) ||
    anoContratacao <= 1960 ||
    isNaN(matricula) ||
    matricula <= 0
  ) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h2>Dados inválidos. Não foi possível calcular o reajuste.</h2>");
    return;
  }

  const anoAtual = new Date().getFullYear();
  const tempo = anoAtual - anoContratacao;

  let perc = 0;
  let extra = 0;

  if (idade >= 18 && idade <= 39) {
    if (sexo === "M") {
      perc = 0.10;
      extra = tempo <= 10 ? -10 : 17;
    } else {
      perc = 0.08;
      extra = tempo <= 10 ? -11 : 16;
    }
  } else if (idade >= 40 && idade <= 69) {
    if (sexo === "M") {
      perc = 0.08;
      extra = tempo <= 10 ? -5 : 15;
    } else {
      perc = 0.10;
      extra = tempo <= 10 ? -7 : 14;
    }
  } else if (idade >= 70 && idade <= 99) {
    if (sexo === "M") {
      perc = 0.15;
      extra = tempo <= 10 ? -15 : 13;
    } else {
      perc = 0.17;
      extra = tempo <= 10 ? -17 : 12;
    }
  }

  const salarioFinal = salarioBase + salarioBase * perc + extra;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <h1>Resultado</h1>
    <p>Matrícula: ${matricula}</p>
    <p>Idade: ${idade}</p>
    <p>Sexo: ${sexo}</p>
    <p>Ano de contratação: ${anoContratacao}</p>
    <p>Salário base: R$ ${salarioBase.toFixed(2)}</p>
    <h2 style="color: green;">Salário reajustado: R$ ${salarioFinal.toFixed(2)}</h2>
  `);
});

server.listen(3000);