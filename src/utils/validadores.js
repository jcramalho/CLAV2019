export function eNull(valor) {
  return valor === null;
}

export function eUndefined(valor) {
  return valor === undefined;
}

export function eVazio(valor) {
  return valor === "";
}

export function eNUV(valor) {
  return eNull(valor) || eUndefined(valor) || eVazio(valor);
}

export function eNV(valor) {
  return eNull(valor) || eVazio(valor);
}

export function eDataFormatoErrado(data) {
  return !/[0-9]+-[0-9]+-[0-9]+/.test(data);
}

export function testarRegex(valor, expressao) {
  return expressao.test(valor);
}

export default {
  eNull,
  eUndefined,
  eVazio,
  eNUV,
  eNV,
  eDataFormatoErrado,
  testarRegex,
};
