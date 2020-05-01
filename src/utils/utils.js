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

  let comparison = 0;
  if (keyA > keyB) {
    comparison = 1;
  } else if (keyA < keyB) {
    comparison = -1;
  }

  return comparison;
}

export function comparaCodigo(a, b) {
  const keyA = a.codigo;
  const keyB = b.codigo;

  let comparison = 0;
  if (keyA > keyB) {
    comparison = 1;
  } else if (keyA < keyB) {
    comparison = -1;
  }

  return comparison;
}

export default {
  filtraNivel,
  comparaSigla,
  comparaCodigo,
};
