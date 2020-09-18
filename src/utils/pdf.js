import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdf = {
  header: "Cabeçalho...Cabeçalho...Cabeçalho...Cabeçalho...Cabeçalho...",

  footer: {
    columns: [
      "Rodapé Esquerda",
      { text: "Rodapé Direita", alignment: "right" },
    ],
  },
};

const content = [];
const styles = {
  defaultStyle: {
    fontSize: 15,
    bold: false,
  },
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
  const infoPedido = {
    table: {
      widths: ["15%", "70%", "15%"],
      body: [["", { text: contexto, fillColor: "#E3F2FD" }, ""]],
    },
    layout: "noBorders",
  };

  content.push(linhaEmBranco);
  content.push(infoPedido);
};

const linhaEmBranco = { text: "\n" };

const guardarPDF = (nome) => {
  pdf.content = content;
  pdf.styles = styles;

  console.log("pdf", pdf);
  pdfMake.createPdf(pdf).download(`relatorio-${nome}`);
};

export const gerarPDF = (relatorio) => {
  console.log("relatorio", relatorio);

  gerarHeaderConteudo(relatorio);

  if (relatorio.alteracaoInfo) contextoPedido(relatorio.alteracaoInfo);

  guardarPDF(relatorio.numeroPedido);
};

export default {
  gerarPDF,
};
