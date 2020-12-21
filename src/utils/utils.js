export function comparaSigla(a, b) {
  const keyA = a.sigla;
  const keyB = b.sigla;

  let comparation = 0;
  if (keyA > keyB) {
    comparation = 1;
  } else if (keyA < keyB) {
    comparation = -1;
  }

  return comparation;
}

export function comparaCodigo(a, b) {
  const keyA = a.codigo;
  const keyB = b.codigo;

  let comparation = 0;
  if (keyA > keyB) {
    comparation = 1;
  } else if (keyA < keyB) {
    comparation = -1;
  }

  return comparation;
}

export function comparaArraySel(arrA, arrB) {
  var arraysIguais = false;

  let key = "sigla";
  if (arrA[0] !== undefined) {
    if (arrA[0].sigla === undefined) key = "codigo";
  } else if (arrB[0] !== undefined) {
    if (arrB[0].sigla === undefined) key = "codigo";
  } else {
    return true;
  }

  const keysA = arrA.map(el => el[key]).sort();
  const keysB = arrB.map(el => el[key]).sort();

  arraysIguais = JSON.stringify(keysA) === JSON.stringify(keysB);

  return arraysIguais;
}

export function mapKeys(key) {
  let descricao = "";
  switch (key) {
    case "designacao":
      descricao = "Nome";
      break;

    case "entidadesSel":
      descricao = "Entidades";
      break;

    case "tipologiasSel":
      descricao = "Tipologias";
      break;

    case "processosSel":
      descricao = "Processos";
      break;

    case "dataCriacao":
      descricao = "Data de Criação";
      break;

    case "dataExtincao":
      descricao = "Data de Extinção";
      break;

    case "dataRevogacao":
      descricao = "Data de Revogação";
      break;

    case "data":
      descricao = "Data do Diploma";
      break;

    case "numero":
      descricao = "Número";
      break;

    case "sumario":
      descricao = "Sumário";
      break;

    case "diplomaFonte":
      descricao = "Fonte do Diploma";
      break;

    case "legislacao":
      descricao = "Fonte de Legitimação";
      break;

    case "zonaControlo":
      descricao = "Classes / Séries";
      break;

    case "responsavel":
      descricao = "Responsável";
      break;

    case "referencial":
      descricao = "Referencial Classificativo";
      break;

    case "sioe":
      descricao = "SIOE";
      break;

    case "notasAp":
      descricao = "Notas de Aplicação";
      break;

    case "notasEx":
      descricao = "Notas de Exclusão";
      break;

    case "exemplosNotasAp":
      descricao = "Exemplo Notas de Aplicação";
      break;

    case "termosInd":
      descricao = "Termos de Índice";
      break;

    case "entProd":
      descricao = "Entidade Produtora";
      break;

    case "tipoProc":
      descricao = "Tipo de Processo";
      break;

    case "procTrans":
      descricao = "Processo Transversal";
      break;

    case "donos":
      descricao = "Donos do processo";
      break;

    case "processosRelacionados":
      descricao = "Processos Relacionados";
      break;

    default:
      descricao = key.charAt(0).toUpperCase() + key.slice(1);
      break;
  }

  return descricao;
}

export function extrairAlteracoes(objeto, objetoOriginal) {
  const dados = JSON.parse(JSON.stringify(objeto));
  const dadosOriginais = JSON.parse(JSON.stringify(objetoOriginal));

  for (const key in dados) {
    if (typeof dados[key] === "string") {
      if (dados[key] === dadosOriginais[key]) delete dados[key];
    } else if (dados[key] instanceof Array) {
      if (comparaArraySel(dados[key], dadosOriginais[key])) delete dados[key];
    }
  }

  return dados;
}

export function criarHistorico(objeto, objetoOriginal = null) {
  const objSubmetido = JSON.parse(JSON.stringify(objeto));

  const historico = {};

  if (objetoOriginal !== null) {
    const objOriginal = JSON.parse(JSON.stringify(objetoOriginal));

    for (const key in objSubmetido) {
      if (typeof objSubmetido[key] === "string") {
        if (objSubmetido[key] !== objOriginal[key]) {
          historico[key] = {
            cor: "amarelo",
            dados: objSubmetido[key],
            nota: null,
          };
        }
      } else if (objSubmetido[key] instanceof Array) {
        if (objSubmetido[key].length !== objOriginal[key].length) {
          historico[key] = {
            cor: "amarelo",
            dados: objSubmetido[key],
            nota: notasComRemovidos(objOriginal[key], objSubmetido[key]),
          };
        } else if (!comparaArraySel(objSubmetido[key], objOriginal[key])) {
          historico[key] = {
            cor: "amarelo",
            dados: objSubmetido[key],
            nota: notasComRemovidos(objOriginal[key], objSubmetido[key]),
          };
        }
      }
    }
  } else {
    for (const key in objSubmetido) {
      if (key !== "estado" && key !== "codigo") {
        historico[key] = {
          cor: "verde",
          dados: objSubmetido[key],
          nota: null,
        };
      }
    }
  }

  return historico;
}

export function converterDadosOriginais(dados) {
  const dadosConvertidos = {};

  for (const key in dados) {
    dadosConvertidos[key] = {
      cor: null,
      dados: dados[key],
      nota: null,
    };
  }

  return dadosConvertidos;
}

export function identificaItemAdicionado(item, lista, historicoAnterior) {
  if (lista === "entidadesSel") {
    return !historicoAnterior.entidadesSel.dados.some(ent => {
      return ent.sigla === item.sigla;
    });
  } else if (lista === "tipologiasSel") {
    return !historicoAnterior.tipologiasSel.dados.some(tip => {
      return tip.sigla === item.sigla;
    });
  } else if (lista === "processosSel") {
    return !historicoAnterior.processosSel.dados.some(proc => {
      return proc.codigo === item.codigo;
    });
  }

  return false;
}

export function identificaItemEmTabela(item, listaA, siglaOuCodigo) {
  return !listaA.dados.some(dado => {
    return dado[siglaOuCodigo] === item;
  });
}

export function notasComRemovidos(listaAnterior, listaAtual) {
  let notaComRemovidos = "\nItens removidos:";

  let siglaOuCodigo = "sigla";
  let designacaoOuTitulo = "designacao";

  if (listaAnterior[0] !== undefined) {
    if (listaAnterior[0].sigla === undefined) {
      siglaOuCodigo = "codigo";
      designacaoOuTitulo = "titulo";
    }
  } else if (listaAtual[0] !== undefined) {
    if (listaAtual[0].sigla === undefined) {
      siglaOuCodigo = "codigo";
      designacaoOuTitulo = "titulo";
    }
  } else {
    return null;
  }

  listaAnterior.forEach(itemAnterior => {
    if (
      !listaAtual.some(
        itemAtual => itemAtual[siglaOuCodigo] === itemAnterior[siglaOuCodigo]
      )
    )
      notaComRemovidos += `\n# ${itemAnterior[siglaOuCodigo]} - ${itemAnterior[designacaoOuTitulo]};`;
  });

  if (notaComRemovidos === "\nItens removidos:") return null;

  notaComRemovidos = notaComRemovidos.replace(/.$/, ".");

  return notaComRemovidos;
}

export function adicionarNotaComRemovidos(historicoAnterior, historicoAtual) {
  for (const key in historicoAnterior) {
    if (historicoAnterior[key].dados instanceof Array) {
      const nota = notasComRemovidos(
        historicoAnterior[key].dados,
        historicoAtual[key].dados
      );

      if (historicoAtual[key].nota === null) historicoAtual[key].nota = nota;
      else if (nota !== null) historicoAtual[key].nota += nota;
    }
  }

  return historicoAtual;
}

export function renomearRepetidosEmArray(arr) {
  let count = {};

  arr.forEach((x, i) => {
    if (arr.indexOf(x) !== i) {
      let c = x in count ? (count[x] = count[x] + 1) : (count[x] = 1);
      let j = c + 1;
      let k = `${x} #${j}`;

      while (arr.indexOf(k) !== -1) k = `${x} #${++j}`;
      arr[i] = k;
    }
  });

  return arr;
}

export function gerarDadosRelatorio(pedido) {
  const pedidoSubmetido = JSON.parse(JSON.stringify(pedido.historico[0]));
  const pedidoFinalizado = JSON.parse(
    JSON.stringify(pedido.historico[pedido.historico.length - 1])
  );
  const despacho = pedido.distribuicao[pedido.distribuicao.length - 1];
  let campos = [];
  const relatorio = {
    despacho: despacho.despacho || "",
    comparacao: [],
    dataInicial: "",
    dataFinal: "",
    tipoPedido: "",
    numeroPedido: "",
    alteracaoInfo: "",
    estadoPedido: "",
  };

  Object.keys(pedidoSubmetido).forEach(item => {
    if (item !== "estado" && item !== "id") campos.push(item);
  });

  campos.forEach(campo => {
    if (pedidoSubmetido[campo].nota !== null) {
      let formatarNota = "";
      formatarNota = pedidoSubmetido[campo].nota.replace(
        "Itens removidos:",
        ""
      );

      formatarNota = formatarNota.split("#")[0].trim();

      if (formatarNota === "") formatarNota = null;

      pedidoSubmetido[campo].nota = formatarNota;
    }

    if (pedidoFinalizado[campo].nota !== null) {
      let formatarNota = "";
      formatarNota = pedidoFinalizado[campo].nota.replace(
        "Itens removidos:",
        ""
      );

      formatarNota = formatarNota.split("#")[0].trim();

      if (formatarNota === "") formatarNota = null;

      pedidoFinalizado[campo].nota = formatarNota;
    }

    if (pedidoFinalizado[campo].cor !== "vermelho") {
      let iguais = false;
      if (pedidoFinalizado[campo].dados instanceof Array)
        iguais = comparaArraySel(
          pedidoSubmetido[campo].dados,
          pedidoFinalizado[campo].dados
        );
      else if (
        pedidoSubmetido[campo].dados.trim() ===
        pedidoFinalizado[campo].dados.trim()
      )
        iguais = true;

      if (pedido.historico.length === 1)
        pedidoFinalizado[campo].cor = "vermelho";
      else
        iguais
          ? (pedidoFinalizado[campo].cor = "verde")
          : (pedidoFinalizado[campo].cor = "amarelo");
    }

    relatorio.comparacao.push({
      campo: mapKeys(campo),
      submetido: pedidoSubmetido[campo],
      finalizado: pedidoFinalizado[campo],
    });
  });

  relatorio.dataInicial = new Date(pedido.data).toISOString().split("T")[0];
  relatorio.dataFinal = new Date(despacho.data).toISOString().split("T")[0];
  relatorio.tipoPedido = `${pedido.objeto.acao} - ${pedido.objeto.tipo}`;
  relatorio.numeroPedido = pedido.codigo;
  relatorio.estadoPedido = pedido.estado;

  if (pedido.objeto.acao !== "Criação") {
    switch (pedido.objeto.tipo) {
      case "Legislação":
        relatorio.alteracaoInfo = `${pedido.objeto.tipo}: ${pedido.objeto.dadosOriginais.diplomaFonte} - ${pedido.objeto.dadosOriginais.numero} - ${pedido.objeto.dadosOriginais.sumario}`;
        break;

      case "Entidade":
        relatorio.alteracaoInfo = `${pedido.objeto.tipo}: ${pedido.objeto.dadosOriginais.sigla} - ${pedido.objeto.dadosOriginais.designacao}`;
        break;

      case "Tipologia":
        relatorio.alteracaoInfo = `${pedido.objeto.tipo}: ${pedido.objeto.dadosOriginais.sigla} - ${pedido.objeto.dadosOriginais.designacao}`;
        break;

      default:
        break;
    }
  }

  return relatorio;
}

export function mapKeysRADA(key) {
  let descricao = "";

  switch (key) {
    case "titulo":
      descricao = "Título";
      break;
    case "entRes":
      descricao = "Entidades Responsáveis";
      break;
    case "entidadesProd":
      descricao = "Entidades Produtoras";
      break;
    case "tipologiasProd":
      descricao = "Tipologia Produtora";
      break;
    case "dataInicial":
      descricao = "Data Inicial";
      break;
    case "dataFinal":
      descricao = "Data Final";
      break;
    case "hist_admin":
      descricao = "História Administrativa/Biográfica";
      break;
    case "hist_cust":
      descricao = "História Custodial";
      break;
    case "sist_org":
      descricao = "Sistema de Organização";
      break;
    case "localizacao":
      descricao = "Localização";
      break;
    case "est_conser":
      descricao = "Estado de Conservação";
      break;
    case "codigo":
      descricao = "Código";
      break;
    case "descricao":
      descricao = "Descrição";
      break;
    case "est_conser":
      descricao = "Estado de Conservação";
      break;
    case "eFilhoDe":
      descricao = "Pai";
      break;
    case "tipo":
      descricao = "Tipo de Classe";
      break;
    case "tUA":
      descricao = "Tipo de Unidade Arquivística";
      break;
    case "tSerie":
      descricao = "Tipo de Série";
      break;
    case "UIs":
      descricao = "Unidades de Instalação";
      break;
    case "suporte_e_medicao":
      descricao = "Suporte e Medição";
      break;
    case "relacoes":
      descricao = "Relações";
      break;
    case "pca":
      descricao = "Prazo de Conservação Administrativo";
      break;
    case "notaPCA":
      descricao = "Nota PCA";
      break;
    case "justificacaoPCA":
      descricao = "Justificação do PCA";
      break;
    case "df":
      descricao = "Destino Final";
      break;
    case "justificacaoDF":
      descricao = "Justificação do DF";
      break;
    case "notaDF":
      descricao = "Nota DF";
      break;
    case "entProdutoras":
      descricao = "Entidades Produtoras";
      break;
    case "tipologiasProdutoras":
      descricao = "Tipologia Produtora";
      break;
    case "legislacao":
      descricao = "Legislação";
      break;
    case "formaContagem":
      descricao = "Forma Contagem";
      break;
    case "codCota":
      descricao = "Cota";
      break;
    case "classesAssociadas":
      descricao = "Classes Associadas";
      break;
    case "notas":
      descricao = "Notas";
      break;
    case "produtor":
      descricao = "Produtor";
      break;
  }

  return descricao;
}

export default {
  gerarDadosRelatorio,
  renomearRepetidosEmArray,
  comparaSigla,
  comparaCodigo,
  mapKeys,
  extrairAlteracoes,
  criarHistorico,
  converterDadosOriginais,
  identificaItemAdicionado,
  identificaItemEmTabela,
  adicionarNotaComRemovidos,
  mapKeysRADA,
};
