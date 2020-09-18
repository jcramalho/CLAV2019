import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdf = {
  header: "simple text",

  footer: {
    columns: ["Left part", { text: "Right part", alignment: "right" }],
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
  const header = {
    columns: [
      { text: dados.tipoPedido, style: "tipoPedido" },
      { text: dados.estadoPedido, style: "estadoPedido" },
    ],
  };

  styles.tipoPedido = {
    fontSize: 18,
    bold: true,
  };

  styles.estadoPedido = {
    fontSize: 18,
    bold: true,
    alignment: "right",
    color: "green",
    // background: "#C8E6C9",
    background: "#E8F5E9",
    decoration: "underline",
    decorationColor: "green",
  };

  content.push(header);
};

const guardarPDF = (nome) => {
  pdf.content = content;
  pdf.styles = styles;

  pdfMake.createPdf(pdf).download(`relatorio-${nome}`);
};

export const gerarPDF = (relatorio) => {
  console.log("relatorio", relatorio);

  gerarHeaderConteudo(relatorio);

  guardarPDF(relatorio.numeroPedido);
};

export default {
  gerarPDF,
};
