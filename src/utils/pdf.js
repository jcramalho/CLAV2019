import { mdiAppleKeyboardControl } from "@mdi/js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let pdf = {};

let content = [];

let styles = {
  defaultStyle: {
    fontSize: 15,
    bold: false,
  },
};

const gerarHeader = () => {
  pdf.header = {
    text: "Cabeçalho...Cabeçalho...Cabeçalho...Cabeçalho...Cabeçalho...",
  };
};

const gerarFooter = () => {
  pdf.footer = {
    columns: [
      "Rodapé Esquerda",
      { text: "Rodapé Direita", alignment: "right" },
    ],
  };
};

const gerarHeaderConteudo = (dados) => {
  const tipoEstado = {
    columns: [
      { text: dados.tipoPedido, style: "tipoPedido" },
      { text: ` ${dados.estadoPedido} `, style: "estadoPedido" },
    ],
  };

  const dataCriacao = {
    text: [
      { text: "\nData de criação: ", style: "cabecalho" },
      { text: dados.dataInicial, style: "texto" },
    ],
  };

  const dataFinalizacao = {
    text: [
      { text: "Data de Finalização: ", style: "cabecalho" },
      { text: dados.dataFinal, style: "texto" },
    ],
  };

  styles.cabecalho = {
    fontSize: 11,
    bold: true,
  };

  styles.texto = {
    fontSize: 11,
    bold: false,
  };

  styles.tipoPedido = {
    fontSize: 18,
    bold: true,
  };

  styles.estadoPedido = {
    fontSize: 18,
    bold: true,
    alignment: "right",
    color: dados.estadoPedido === "Validado" ? "green" : "red",
    background: dados.estadoPedido === "Validado" ? "#E8F5E9" : "#FFEBEE",
    decorationColor: dados.estadoPedido === "Validado" ? "green" : "red",
  };

  content.push(tipoEstado);
  content.push(dataCriacao);
  content.push(dataFinalizacao);
};

const contextoPedido = (contexto) => {
  linhaEmBranco();

  const infoPedido = {
    table: {
      widths: ["15%", "70%", "15%"],
      body: [["", { text: contexto, fillColor: "#E3F2FD" }, ""]],
    },
    layout: "noBorders",
  };

  content.push(infoPedido);
};

const dadosPedido = (dados) => {
  linhaEmBranco();

  const linhas = [];
  dados.forEach((el) => {
    const { campo, submetido, finalizado } = el;
    const linha = [];

    linha.push({ text: campo, style: "campoTabela" });
    linha.push({ text: submetido.dados, style: switchStyle(submetido.cor) });
    linha.push({ text: finalizado.dados, style: switchStyle(finalizado.cor) });

    linhas.push(linha);

    if (finalizado.nota)
      linhas.push(["Nota", { colSpan: 2, text: finalizado.nota }, ""]);
  });

  console.table(linhas);

  const tabela = {
    table: {
      widths: ["auto", "*", "*"],
      body: [
        [
          { text: "Campo", style: "cabecalhoTabela" },
          { text: "Submetido", style: "cabecalhoTabela" },
          { text: "Finalizado", style: "cabecalhoTabela" },
        ],
        ...linhas,
      ],
    },
  };

  styles.cabecalhoTabela = {
    bold: true,
    fontSize: 14,
    color: "black",
    fillColor: "#E0E0E0",
  };

  styles.campoTabela = {
    bold: true,
    fontSize: 12,
    color: "black",
    fillColor: "#FAFAFA",
  };

  styles.valorCerto = {
    fillColor: "#C8E6C9",
  };

  styles.valorErrado = {
    fillColor: "#FFCDD2",
  };

  styles.valorAlterado = {
    fillColor: "#FFF9C4",
  };

  content.push(tabela);
};

const linhaEmBranco = () => {
  content.push({ text: "\n" });
};

const switchStyle = (cor) => {
  let style = "";

  switch (cor) {
    case "verde":
      style = "valorCerto";
      break;

    case "vermelho":
      style = "valorErrado";
      break;

    case "amarelo":
      style = "valorAlterado";
      break;

    default:
      style = "";
      break;
  }

  return style;
};

const guardarPDF = (nome) => {
  pdf.content = content;
  pdf.styles = styles;

  console.log("pdf", pdf);
  pdfMake.createPdf(pdf).download(`relatorio-${nome}`);
};

const resetPDF = () => {
  pdf = {};
  content = [];
  styles = {};
};

/**
 *
 * Main Function
 *
 */
export const gerarPDF = (relatorio) => {
  console.log("relatorio", relatorio);

  gerarHeader();

  gerarHeaderConteudo(relatorio);

  if (relatorio.alteracaoInfo) contextoPedido(relatorio.alteracaoInfo);

  dadosPedido(relatorio.comparacao);

  gerarFooter();

  guardarPDF(relatorio.numeroPedido);

  resetPDF();
};

export default {
  gerarPDF,
};
