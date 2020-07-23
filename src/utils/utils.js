/**
 * Retorna uma lista de utilizadores filtrados com base no nivel
 * @param {Array} utilizadores Lista com todos os utilizadores
 * @param {number} nivel Nível a filtra
 * @param {string} operador Operador de filtragem da lista
 * @returns {["=", "<", ">", "<=", ">="]} Lista com os utilizadores filtrados
 */
export function filtraNivel(utilizadores, nivel, operador = "=") {
  let utilizadoresFiltrados = [];

  switch (operador) {
    case "=":
      utilizadoresFiltrados = utilizadores.filter(
        (utilizador) => utilizador.level == nivel
      );
      break;
    case "<":
      utilizadoresFiltrados = utilizadores.filter(
        (utilizador) => utilizador.level < nivel
      );
      break;
    case ">":
      utilizadoresFiltrados = utilizadores.filter(
        (utilizador) => utilizador.level > nivel
      );
      break;
    case "<=":
      utilizadoresFiltrados = utilizadores.filter(
        (utilizador) => utilizador.level <= nivel
      );
      break;
    case ">=":
      utilizadoresFiltrados = utilizadores.filter(
        (utilizador) => utilizador.level >= nivel
      );
      break;
    default:
      break;
  }
  return utilizadoresFiltrados;
}

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

export function comparaArraySel(arrA, arrB, key) {
  var arraysIguais = false;

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
      if (dados[key] === dadosOriginais[key] && key !== "sigla")
        delete dados[key];
    } else if (dados[key] instanceof Array) {
      if (
        key !== "processosSel" &&
        comparaArraySel(dados[key], dadosOriginais[key], "sigla")
      )
        delete dados[key];
      else if (
        key === "processosSel" &&
        comparaArraySel(dados[key], dadosOriginais[key], "codigo")
      )
        delete dados[key];
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
            nota: null,
          };
        } else if (
          !comparaArraySel(objSubmetido[key], objOriginal[key], "sigla")
        ) {
          historico[key] = {
            cor: "amarelo",
            dados: objSubmetido[key],
            nota: null,
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

export function extrairRemovidos(objetoAnterior, objetoAtual, lista) {
  const dadosAnteriores = JSON.parse(JSON.stringify(objetoAnterior));
  const dadosAtuais = JSON.parse(JSON.stringify(objetoAtual));

  const removidos = [];

  if (lista === "entidadesSel") {
    dadosAtuais.entidadesSel.dados.forEach((dado) => {
      if (
        !dadosAnteriores.entidadesSel.dados.some((s) => s.sigla === dado.sigla)
      )
        removidos.push(dado.sigla);
    });
  }

  return removidos;
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

export default {
  filtraNivel,
  comparaSigla,
  comparaCodigo,
  comparaArraySel,
  mapKeys,
  extrairAlteracoes,
  criarHistorico,
  converterDadosOriginais,
  extrairRemovidos,
  identificaItemAdicionado,
};
