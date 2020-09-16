import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdf = {
  content: [
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
    "Teste",
  ],

  defaultStyle: {
    fontSize: 15,
    bold: false,
  },
};

const guardarPDF = (nome) => {
  pdfMake.createPdf(pdf).download(`relatorio-${nome}`);
};

export const gerarPDF = (relatorio) => {
  console.log("relatorio", relatorio);

  guardarPDF(relatorio.numeroPedido);
};

export default {
  gerarPDF,
};
