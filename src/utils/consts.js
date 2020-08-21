const CONSTS = module.exports;

// Nível mínimo para o utilizador poder editar
CONSTS.NIVEL_MINIMO_ALTERAR = 4;
CONSTS.NIVEL_MINIMO_DISTRIBUIR_PEDIDOS = 3.5;
CONSTS.NIVEL_MINIMO_SUBSTITUIR_RESPONSAVEL = 3.5; // É necessário 2 tipos de niveis? (Análise e Validação) //FIXME: Ver nível adequado
CONSTS.NIVEL_MINIMO_DOC = 3.5;

CONSTS.NIVEIS_ANALISAR_PEDIDO = [3.5, 4, 6, 7]; // TODO: Confirmar com a DGLAB
CONSTS.NIVEIS_VALIDAR_PEDIDO = [4, 6, 7]; // TODO: Confirmar com a DGLAB

// TODO: Adicionar niveis para poderem ver o histórico

// LEVELS.NIVEL_MINIMO_REMOVER = "X"; // restantes restrições
