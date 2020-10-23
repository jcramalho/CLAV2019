import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let pdf = { pageMargins: [40, 160, 40, 80] };

let content = [];

let styles = {
  defaultStyle: {
    fontSize: 15,
    bold: false,
  },
};

const gerarHeader = () => {
  pdf.images = {
    DGLAB: `${window.location.origin}/img/RP_DGLAB.jpg`,
  };

  pdf.header = {
    stack: [
      {
        image: "DGLAB",
        width: 150,
        height: 80,
        alignment: "center",
        margin: [0, 30, 0, 20],
      },
      {
        text: "NOTIFICAÇÃO",
        style: "titulo",
      },
    ],
  };

  styles.titulo = {
    fontSize: 14,
    bold: true,
    alignment: "center",
  };
};

const gerarFooter = () => {
  pdf.footer = (currentPage, pageCount) => {
    return {
      columns: [
        {
          stack: [
            {
              text: [
                { text: "CLAV", bold: true },
                " - Classificação e Avaliação da Informação Pública\n\n",
              ],
            },
            {
              columns: [
                {
                  text: "https://clav.dglab.gov.pt/",
                  link: "https://clav.dglab.gov.pt/",
                  style: "links",
                },
                {
                  text: "clav@dglab.gov.pt",
                  link: "clav@dglab.gov.pt",
                  style: "links",
                },
              ],
            },
          ],
          width: "auto",
        },
        {
          text: `${currentPage.toString()}`,
          alignment: "right",
        },
      ],
      margin: [40, 0],
    };
  };

  styles.links = {
    color: "blue",
    decoration: "underline",
    fontSize: 10,
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
      { text: "Data de finalização: ", style: "cabecalho" },
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
    const siglasOuCodigosSubmetidos = [];
    const siglasOuCodigosFinalizados = [];

    // Campo
    linha.push({ text: campo, style: "campoTabela" });

    // Dados Submetidos
    if (submetido.dados instanceof Array) {
      if (submetido.dados.length !== 0) {
        const lista = [];

        submetido.dados.forEach((dado) => {
          if (dado.sigla) {
            siglasOuCodigosSubmetidos.push(dado.sigla);
            lista.push(dado.sigla);
          } else {
            siglasOuCodigosSubmetidos.push(dado.codigo);
            lista.push(dado.codigo);
          }
        });

        linha.push({ ul: lista, style: switchStyle(submetido.cor) });
      } else {
        linha.push({
          text: {
            text: "A lista está vazia.",
            color: "#424242",
            decoration: "underline",
          },
          style: switchStyle(submetido.cor),
        });
      }
    } else {
      linha.push({ text: submetido.dados, style: switchStyle(submetido.cor) });
    }

    // Dados Submetidos
    if (finalizado.dados instanceof Array) {
      if (finalizado.dados.length !== 0) {
        const lista = [];

        finalizado.dados.forEach((dado) => {
          if (dado.sigla) {
            siglasOuCodigosFinalizados.push(dado.sigla);
            lista.push({
              text: dado.sigla,
              listType: siglasOuCodigosSubmetidos.includes(dado.sigla)
                ? "dot"
                : "circle",
            });
          } else {
            siglasOuCodigosFinalizados.push(dado.codigo);
            lista.push({
              text: dado.codigo,
              listType: siglasOuCodigosSubmetidos.includes(dado.codigo)
                ? "dot"
                : "circle",
            });
          }
        });

        linha.push({ ul: lista, style: switchStyle(finalizado.cor) });
      } else {
        linha.push({
          text: {
            text: "A lista está vazia.",
            color: "#424242",
            decoration: "underline",
          },
          style: switchStyle(finalizado.cor),
        });
      }
    } else {
      linha.push({
        text: finalizado.dados,
        style: switchStyle(finalizado.cor),
      });
    }

    linhas.push(linha);

    const itensRemovidos = siglasOuCodigosSubmetidos.filter((el) => {
      if (!siglasOuCodigosFinalizados.includes(el)) return el;
    });

    if (
      (finalizado.nota && itensRemovidos.length !== 0) ||
      (!finalizado.nota && itensRemovidos.length !== 0)
    )
      linhas.push([
        "Nota",
        {
          colSpan: 2,
          stack: [
            { text: finalizado.nota },
            "\nItens removidos:",
            { ul: itensRemovidos },
          ],
        },
        "",
      ]);
    else if (finalizado.nota)
      linhas.push([
        "Nota",
        {
          colSpan: 2,
          text: finalizado.nota,
        },
        "",
      ]);
  });

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

  styles.valorNormal = {
    fillColor: "#FFFFFF",
  };

  content.push(tabela);
};

const despachoFinal = (despacho) => {
  linhaEmBranco();

  const despachoFinal = {
    table: {
      widths: ["5%", "20%", "70%", "5%"],
      body: [
        [
          "",
          {
            text: "Despacho final:",
            fillColor: "#EEEEEE",
            style: "campoTabela",
          },
          { text: despacho, fillColor: "#EEEEEE" },
          "",
        ],
      ],
    },
    layout: "noBorders",
  };

  content.push(despachoFinal);
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
      style = "valorNormal";
      break;
  }

  return style;
};

const guardarPDF = (nome) => {
  pdf.content = content;
  pdf.styles = styles;

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
  gerarHeader();

  gerarHeaderConteudo(relatorio);

  if (relatorio.alteracaoInfo) contextoPedido(relatorio.alteracaoInfo);

  dadosPedido(relatorio.comparacao);

  if (relatorio.despacho) despachoFinal(relatorio.despacho);

  gerarFooter();

  guardarPDF(relatorio.numeroPedido);

  resetPDF();
};

export const geraNotificacaoAprovado = () => {};

export default {
  gerarPDF,
};
