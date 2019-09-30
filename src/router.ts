import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Principal.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes das classes
    {
      path: "/classes",
      name: "classes",
      component: () => import("./views/classes/Classes.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/classes/procurar/:id",
      name: "procurarClasse",
      component: () => import("./components/classes/MostraProcura.vue")
    },
    {
      path: "/classes/consultar/:idClasse",
      name: "consultaClasse",
      component: () => import("./views/classes/ClassesConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/classes/showPedido/:idPedido",
      name: "showPedidoClasse",
      component: () => import("./views/classes/ClassesShowPedido.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/classes/criar",
      name: "criaClasse",
      component: () => import("./views/classes/ClassesCria.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes das entidades
    {
      path: "/entidades",
      name: "entidades",
      component: () => import("./views/entidades/Entidades.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/entidades/criar",
      name: "criaEntidade",
      component: () => import("./views/entidades/EntidadesCria.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/entidades/:idEntidade",
      name: "consultaEntidade",
      component: () => import("./views/entidades/EntidadesConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes da legislação
    {
      path: "/legislacao",
      name: "legislacao",
      component: () => import("./views/legislacao/Legislacao.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/legislacao/criar",
      name: "criaLegislacao",
      component: () => import("./views/legislacao/LegislacaoCria.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/legislacao/:idLegislacao",
      name: "consultaLegislacao",
      component: () => import("./views/legislacao/LegislacaoConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes das tabelas de seleção
    {
      path: "/ts",
      name: "ts",
      component: () => import("./views/tabSel/TabSel.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/ts/criar",
      name: "criaTsTipo",
      component: () => import("./views/tabSel/TabSelCria.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/ts/criar/organizacional",
      name: "criaTsOrg",
      component: () => import("./views/tabSel/TabSelCriaOrg.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/ts/criar/pluriorganizacional",
      name: "criaTsPluri",
      component: () => import("./views/tabSel/TabSelCriaPluri.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/ts/passos",
      name: "passosTs",
      component: () => import("./views/tabSel/TabSelPassos.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/ts/importar/csv",
      name: "importaCSV",
      component: () => import("./views/tabSel/TabSelImportaCSV.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes dos termos de indice
    {
      path: "/termosIndice",
      name: "termosIndice",
      component: () => import("./views/termosIndice/TermosIndice.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes dos Vocabulários Controlados
    {
      path: "/vocabularios",
      name: "vocabulariosControlados",
      component: () => import("./views/vocabularios/Vocabularios.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/vocabularios/:idVC",
      name: "TermosVocabulariosControlados",
      component: () => import("./views/vocabularios/VocabulariosTermos.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes dos Autos de Eliminação
    {
      path: "/autosEliminacao",
      name: "AutosEliminacao",
      component: () => import("./views/autosEliminacao/AutosEliminacao.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/autosEliminacao/importar",
      name: "importarAutosEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoImportar.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/autosEliminacao/:idAE",
      name: "consultaAutoEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoConsultar.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes das tipologias
    {
      path: "/tipologias",
      name: "tipologias",
      component: () => import("./views/tipologias/Tipologias.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/tipologias/criar",
      name: "criaTipologia",
      component: () => import("./views/tipologias/TipologiasCria.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/tipologias/:idTipologia",
      name: "consultaTipologia",
      component: () => import("./views/tipologias/TipologiasConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes dos pedidos
    {
      path: "/pedidos",
      name: "pedidos",
      component: () => import("./views/pedidos/Pedidos.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/pedidos/submissao",
      name: "submissaoPedido",
      component: () => import("./views/pedidos/PedidosSubmissao.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/pedidos/:idPedido",
      name: "consultaPedido",
      component: () => import("./views/pedidos/PedidosConsulta.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/pedidos/analisar/:idPedido",
      name: "analisePedido",
      component: () => import("./views/pedidos/PedidosAnalise.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes dos pendentes (trabalho guardado)
    {
      path: "/pendentes",
      name: "pendentes",
      component: () => import("./views/pendentes/Pendentes.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/pendentes/continuar/:idPendente",
      name: "continuaPendente",
      component: () => import("./views/pendentes/PendentesContinuacao.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes da gestão de utilizadores
    {
      path: "/users/autenticacao",
      name: "autenticacao",
      component: () => import("./views/users/Autenticacao.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/users/registo",
      name: "registo",
      component: () => import("./views/users/Registo.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/users/login",
      name: "login",
      component: () => import("./views/users/Login.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/users/recuperacao",
      name: "recuperacao",
      component: () => import("./views/users/Recuperacao.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/users/alteracaoPassword",
      name: "alteracaoPassword",
      component: () => import("./views/users/AlteracaoPassword.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/users/listagem",
      name: "listagem",
      component: () => import("./views/users/ListagemUsers.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/users/registoParaEntidade",
      name: "registoParaEntidade",
      component: () => import("./views/users/RegistoParaEntidade.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    //cartao cidadao
    {
      path: "/users/handlerCC",
      name: "handlerCC",
      component: () => import("./views/users/HandlerCC.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    //Métricas
    {
      path: "/gestao/metrica",
      name: "metrica",
      component: () => import("./views/gestao/Metrica.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    //Chaves API
    {
      path: "/gestao/api/listagem",
      name: "listagemApi",
      component: () => import("./views/gestao/api/ListagemChavesApi.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/gestao/api/registo",
      name: "registoApi",
      component: () => import("./views/gestao/api/RegistoChaveApi.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/gestao/api/renovar",
      name: "renovarApi",
      component: () => import("./views/gestao/api/RenovarChaveApi.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/gestao/api/alteracaoChaveApi",
      name: "alteracaoChaveApi",
      component: () => import("./views/gestao/api/AlteracaoChaveApi.vue"),
      meta: { levels: [0, 1, 2, 3, 4, 5, 6, 7] }
    },
    // Routes de Invariantes
    {
      path: "/invariantes",
      name: "invariantes",
      component: () => import("./views/invariantes/Invariantes.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    },
    {
      path: "/invariantes/testarTodos",
      name: "testarTodosInvariantes",
      component: () => import("./views/invariantes/TestarTodos.vue"),
      meta: { levels: [1, 2, 3, 4, 5, 6, 7] }
    }
  ]
});
