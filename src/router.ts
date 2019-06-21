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
      component: () => import("./views/Principal.vue")
    },
    // Routes das classes
    {
      path: "/classes",
      name: "classes",
      component: () => import("./views/classes/Classes.vue")
    },
    {
      path: "/classes/consultar/:idClasse",
      name: "consultaClasse",
      component: () => import("./views/classes/ClassesConsulta.vue")
    },
    {
      path: "/classes/showPedido/:idPedido",
      name: "showPedidoClasse",
      component: () => import("./views/classes/ClassesShowPedido.vue")
    },
    {
      path: "/classes/criar",
      name: "criaClasse",
      component: () => import("./views/classes/ClassesCria.vue")
    },
    // Routes das entidades
    {
      path: "/entidades",
      name: "entidades",
      component: () => import("./views/entidades/Entidades.vue")
    },
    {
      path: "/entidades/criar",
      name: "criaEntidade",
      component: () => import("./views/entidades/EntidadesCria.vue")
    },
    {
      path: "/entidades/:idEntidade",
      name: "consultaEntidade",
      component: () => import("./views/entidades/EntidadesConsulta.vue")
    },
    // Routes da legislação
    {
      path: "/legislacao",
      name: "legislacao",
      component: () => import("./views/legislacao/Legislacao.vue")
    },
    {
      path: "/legislacao/criar",
      name: "criaLegislacao",
      component: () => import("./views/legislacao/LegislacaoCria.vue")
    },
    {
      path: "/legislacao/:idLegislacao",
      name: "consultaLegislacao",
      component: () => import("./views/legislacao/LegislacaoConsulta.vue")
    },
    // Routes das tabelas de seleção
    {
      path: "/ts",
      name: "ts",
      component: () => import("./views/tabSel/TabSel.vue")
    },
    {
      path: "/ts/criar",
      name: "criaTs",
      component: () => import("./views/tabSel/TabSelCria.vue")
    },
    {
      path: "/ts/passos",
      name: "passosTs",
      component: () => import("./views/tabSel/TabSelPassos.vue")
    },
    // Routes dos termos de indice
    {
      path: "/termosIndice",
      name: "termosIndice",
      component: () => import("./views/termosIndice/TermosIndice.vue")
    },
    // Routes das tipologias
    {
      path: "/tipologias",
      name: "tipologias",
      component: () => import("./views/tipologias/Tipologias.vue")
    },
    {
      path: "/tipologias/criar",
      name: "criaTipologia",
      component: () => import("./views/tipologias/TipologiasCria.vue")
    },
    {
      path: "/tipologias/:idTipologia",
      name: "consultaTipologia",
      component: () => import("./views/tipologias/TipologiasConsulta.vue")
    },
    // Routes dos pedidos
    {
      path: "/pedidos",
      name: "pedidos",
      component: () => import("./views/pedidos/Pedidos.vue")
    },
    {
      path: "/pedidos/submissao",
      name: "submissaoPedido",
      component: () => import("./views/pedidos/PedidosSubmissao.vue")
    },
    {
      path: "/pedidos/:idPedido",
      name: "consultaPedido",
      component: () => import("./views/pedidos/PedidosConsulta.vue")
    },
    // Routes dos pendentes (trabalho guardado)
    {
      path: "/pendentes",
      name: "pendentes",
      component: () => import("./views/pendentes/Pendentes.vue")
    },
    {
      path: "/pendentes/continuar/:idPendente",
      name: "continuaPendente",
      component: () => import("./views/pendentes/PendentesContinuacao.vue")
    },
    // Routes da gestão de utilizadores
    {
      path: "/users/autenticacao",
      name: "autenticacao",
      component: () => import("./views/users/Autenticacao.vue")
    },
    {
      path: "/users/registo",
      name: "registo",
      component: () => import("./views/users/Registo.vue")
    },
    {
      path: "/users/login",
      name: "login",
      component: () => import("./views/users/Login.vue")
    },
    {
      path: "/users/recuperacao",
      name: "recuperacao",
      component: () => import("./views/users/Recuperacao.vue")
    },
    {
      path: "/users/alteracaoPassword",
      name: "alteracaoPassword",
      component: () => import("./views/users/AlteracaoPassword.vue")
    },
    {
      path: "/users/listagem",
      name: "listagem",
      component: () => import("./views/users/ListagemUsers.vue")
    },
    //Métricas
    {
      path: "/gestao/metrica",
      name: "metrica",
      component: () => import("./views/gestao/Metrica.vue")
    },
    //Chaves API
    {
      path: "/gestao/api/listagem",
      name: "listagemApi",
      component: () => import("./views/gestao/api/ListagemChavesApi.vue")
    },
    {
      path: "/gestao/api/registo",
      name: "registoApi",
      component: () => import("./views/gestao/api/RegistoChaveApi.vue")
    },
    {
      path: "/gestao/api/renovar",
      name: "renovarApi",
      component: () => import("./views/gestao/api/RenovarChaveApi.vue")
    },
    {
      path: "/gestao/api/alteracaoChaveApi",
      name: "alteracaoChaveApi",
      component: () => import("./views/gestao/api/AlteracaoChaveApi.vue")
    }
  ]
});
