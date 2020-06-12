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

    default:
      descricao = key.charAt(0).toUpperCase() + key.slice(1);
      break;
  }

  return descricao;
}

export default {
  filtraNivel,
  comparaSigla,
  comparaCodigo,
  comparaArraySel,
  mapKeys,
};
