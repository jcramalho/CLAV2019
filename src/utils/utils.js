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

  const keysA = arrA.map((el) => el[key]).sort();
  const keysB = arrB.map((el) => el[key]).sort();

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
      if (dados[key] === dadosOriginais[key] && key !== "sigla" && key !== "id")
        delete dados[key];
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
    return !historicoAnterior.entidadesSel.dados.some((ent) => {
      return ent.sigla === item.sigla;
    });
  } else if (lista === "tipologiasSel") {
    return !historicoAnterior.tipologiasSel.dados.some((tip) => {
      return tip.sigla === item.sigla;
    });
  } else if (lista === "processosSel") {
    return !historicoAnterior.processosSel.dados.some((proc) => {
      return proc.codigo === item.codigo;
    });
  }

  return false;
}

export function identificaItemEmTabela(item, listaA, siglaOuCodigo) {
  return !listaA.dados.some((dado) => {
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

  listaAnterior.forEach((itemAnterior) => {
    if (
      !listaAtual.some(
        (itemAtual) => itemAtual[siglaOuCodigo] === itemAnterior[siglaOuCodigo]
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

export default {
  comparaSigla,
  comparaCodigo,
  mapKeys,
  extrairAlteracoes,
  criarHistorico,
  converterDadosOriginais,
  identificaItemAdicionado,
  identificaItemEmTabela,
  adicionarNotaComRemovidos,
};
