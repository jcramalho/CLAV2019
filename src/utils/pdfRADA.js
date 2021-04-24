import { mdiAppleKeyboardControl } from "@mdi/js";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let pdf = {};

let content = [];

let styles = {
  defaultStyle: {
    fontSize: 11,
    bold: false,
  },
};

const gerarHeader = () => {
  pdf.header = {
    text: "Relatório de Avaliação de Documentação Acumulada \n\n",
    margin: [10, 10],
  };
};

const gerarFooter = () => {
  pdf.footer = (currentPage, pageCount) => {
    return {
      columns: [
        "",
        {
          text: `Página ${currentPage.toString()} de ${pageCount}`,
          alignment: "right",
        },
      ],
      margin: [10, 10],
    };
  };
};

const gerarHeaderConteudo = (rada) => {
  const titulo = {
    text: [
      { text: 'Título: ', fontSize: 11, bold: true },
      { text: rada.titulo, fontSize: 11 }
    ]
  }

  const entResp = {
    text: [
      { text: '\nEntidade responsável: ', fontSize: 11, bold: true },
      { text: rada.entResp.map(e => { return e.sigla + " - " + e.designacao }).toString(), fontSize: 11 }
    ]
  }

  const aprovadoPor = {
    text: [
      { text: '\nAprovado por: ', fontSize: 11, bold: true },
      { text: 'DGLAB- Direção Geral do Livro, Arquivos e Bibliotecas', fontSize: 11 }
    ]
  }

  const dataAprovacao = {
    text: [
      { text: '\nData de Aprovação: ', fontSize: 11, bold: true },
      { text: rada.dataAprovacao, fontSize: 11 }
    ]
  }
  const despacho = {
    text: [
      { text: "\nDespacho: ", fontSize: 11, bold: true },
      { text: rada.despachoNumero + '  - ' + rada.despachoSumario, fontSize: 11, link: 'https://clav.dglab.gov.pt/legislacao/' + rada.despachoAprovacao.split('#')[1] }
    ]
  }

  content.push(titulo);
  content.push(entResp);
  content.push(aprovadoPor);
  content.push(dataAprovacao);
  content.push(despacho);

  if (!!rada.dataRevogacao) {
    const dataRevogacao = {
      text: [
        { text: '\nData de Revogação: ', fontSize: 11, bold: true },
        { text: rada.dataRevogacao, fontSize: 11 }
      ]
    }
    content.push(dataRevogacao);
  }

};

const adicionarCampo = (texto, campo) => {
  let nova_linha = {
    text: [
      { text: texto, fontSize: 11, bold: true },
      { text: campo, fontSize: 11 }
    ]
  }
  content.push(nova_linha);
}

const gerarRE = (rada) => {

  content.push({ text: '\n\nRelatório Expositivo', fontSize: 15, bold: true })
  content.push({
    text: [
      { text: "\nProdutores: ", fontSize: 11, bold: true },
      { text: rada.produtoras.map(e => { return e.sigla + ' - ' + e.designacao }).toString(), fontSize: 11 }
    ]
  })
  adicionarCampo('\nData inicial: ', rada.dataInicial)
  adicionarCampo('\nData final: ', rada.dataFinal)
  adicionarCampo('\nHistória administrativa/biográfica: ', rada.hist_admin)
  adicionarCampo('\nHistória custodial: ', rada.hist_cust)
  adicionarCampo('\nSistema de organização: ', rada.sist_org)
  adicionarCampo('\nLocalização: ', rada.localizacao)
  adicionarCampo('\nEstado de conservação: ', rada.est_conser)

};

const gerarTS = (rada) => {
  // console.log(rada);

  content.push({ text: '\n\nTabela de Seleção', fontSize: 15, bold: true })
  adicionarCampo('\nTítulo Tabela de Seleção: ', rada.tituloTS)

  for (let i = 0; i < rada.tsRada.length; i++) {
    gerarClasse(rada.tsRada[i], rada)
  }

}

const pai = (pai, rada) => {
  let pai_real = rada.tsRada.find(e => e.classes == pai);

  return !!pai_real ? pai_real.codigo + ' - ' + pai_real.titulo : 'Sem classe pai'
}
const gerarClasse = (classe, rada) => {

  content.push({ text: '\n\n' + classe.codigo + " - " + classe.titulo, fontSize: 12, bold: true })
  adicionarCampo('\nCódigo: ', classe.codigo)
  adicionarCampo('\nTítulo: ', classe.titulo)
  adicionarCampo('\nDescrição: ', classe.descricao)
  adicionarCampo('\nClasse pai: ', pai(classe.pai, rada))

  if (!!classe.nivel) {
    adicionarCampo('\nNível: ', classe.nivel)
  } else {
    adicionarCampo('\nData inicial: ', classe.dataInicial)
    adicionarCampo('\nData final: ', classe.dataFinal)

    if (!!classe.legislacao) {

      adicionarCampo('\nTipo de unidade arquivística: ', classe.tipoUA)
      adicionarCampo('\nTipo de série: ', classe.tipoSerie)
      adicionarCampo('\nLocalização: ', classe.localizacao)
      adicionarCampo('\nSuporte e Medição: ', classe.suporte_e_medicao.map(e => { return '\n' + e.suporte + ' - ' + e.medicao }).toString())
      adicionarCampo('\nLegislação: ', classe.legislacao.map(e => { return '\n' + e.tipo + ' ' + e.numero + ' - ' + e.sumario }).toString())
      adicionarCampo('\nProdutoras: ', classe.produtoras.map(e => { return '\n' + e.sigla + ' - ' + e.designacao }).toString())
    }

    adicionarCampo('\nRelações: ', classe.relacoes.map(e => { return '\n' + corrigirNomeRelacao(e.rel) + ': ' + e.codigo + ' - ' + e.titulo }).toString())

    if (!!classe.pca && !!classe.df) {
      adicionarCampo('\nPCA: ', classe.pca.pca)
      adicionarCampo('\nForma de contagem do PCA: ', classe.pca.formaLabel)
      adicionarCampo('\nSubforma de contagem do PCA: ', classe.pca.subformaLabel)
      adicionarCampo('\nNota ao PCA: ', !!classe.pca.notaPCA ? classe.pca.notaPCA : 'Sem nota sobre o PCA')
      adicionarCampo('\nJustificação do PCA: ', classe.pca.justificacaoPCA.map(e => `\n\n ${corrigirNomeCriterio(e.tipo)}: ${e.conteudo != 'undefined' ? e.conteudo : '[Sem nota]'} \n ${listarCriterio(e.tipo, e.relacoes)}`).toString())

      adicionarCampo('\nDF: ', classe.df.df)
      adicionarCampo('\nNota ao DF: ', !!classe.df.notadf ? classe.df.notadf : 'Sem nota sobre o DF')
      adicionarCampo('\nJustificação do DF: ', classe.df.justificacaoDF.map(e => `\n\n ${corrigirNomeCriterio(e.tipo)}: ${e.conteudo != 'undefined' ? e.conteudo : '[Sem nota]'} \n ${listarCriterio(e.tipo, e.relacoes)}`).toString())
    }
  }
}
const listarCriterio = (tipo, relacoes) => {
  if (tipo == 'CriterioJustificacaoLegal') {
    return !!relacoes ? relacoes.map(r => { return r.tipo + ' ' + r.numero + ' - ' + r.sumario }).toString() : ''
  } else {
    return !!relacoes ? relacoes.map(r => { return r.codigo + ' - ' + r.titulo }).toString() : ''
  }
}

const guardarPDF = (titulo) => {
  pdf.content = content;
  pdf.styles = styles;

  pdfMake.createPdf(pdf).download('RADA-' + titulo);
};

const resetPDF = () => {
  pdf = {};
  content = [];
  styles = {};
};

const corrigirNomeRelacao = (relacao) => {
  let relacao_correta = null;

  switch (relacao) {
    case "eAntecessorDe":
      relacao_correta = "Antecessor de";
      break;
    case "eSucessorDe":
      relacao_correta = "Sucessora de";
      break;
    case "eCruzadoCom":
      relacao_correta = "Cruzado com";
      break;
    case "eComplementarDe":
      relacao_correta = "Complementar de";
      break;
    case "eSintetizadoPor":
      relacao_correta = "Sintetizado por";
      break;
    case "eSinteseDe":
      relacao_correta = "Síntese de";
      break;
    case "eSuplementoDe":
      relacao_correta = "Suplemento de";
      break;
    case "eSuplementoPara":
      relacao_correta = "Suplemento para";
      break;
  }

  return relacao_correta;
}

const corrigirNomeCriterio = (criterio) => {
  let criterio_correto = null;
  switch (criterio) {
    case "CriterioJustificacaoGestionario":
      criterio_correto = "Critério Gestionário";
      break;
    case "CriterioJustificacaoLegal":
      criterio_correto = "Critério Legal";
      break;
    case "CriterioJustificacaoComplementaridadeInfo":
      criterio_correto = "Critério de Complementaridade Informacional";
      break;
    case "CriterioJustificacaoUtilidadeAdministrativa":
      criterio_correto = "Critério de Utilidade Administrativa";
      break;

    case "CriterioJustificacaoDensidadeInfo":
      criterio_correto = "Critério de Densidade Informacional";
      break;
  }

  return criterio_correto;
}



/**
 *
 * Main Function
 *
 */
export const gerarPDF = (rada) => {
  gerarHeader();

  gerarHeaderConteudo(rada);

  gerarRE(rada);

  gerarTS(rada);

  gerarFooter();

  guardarPDF(rada.titulo);

  resetPDF();
};

export default {
  gerarPDF,
};
