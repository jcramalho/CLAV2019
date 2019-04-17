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
      component: () => 
        import("./views/Principal.vue")
    },
    // Routes das classes
    {
      path: "/classes",
      name: "classes",
      component: () => 
        import("./views/classes/Classes.vue")
    },
    {
      path: "/classes/consultar/:idClasse",
      name: "consultaClasse",
      component: () => 
        import("./views/classes/ClassesConsulta.vue")
    },
    {
      path: "/classes/criar",
      name: "criaClasse",
      component: () => 
        import("./views/classes/ClassesCria.vue")
    },
    // Routes das entidades
    {
      path: "/entidades",
      name: "entidades",
      component: () =>
        import("./views/entidades/Entidades.vue")
    },
    {
      path: "/entidades/:idEntidade",
      name: "consultaEntidade",
      component: () => 
        import("./views/entidades/EntidadesConsulta.vue")
    },
    // Routes da legislação
    {
      path: "/legislacao",
      name: "legislacao",
      component: () =>
        import("./views/legislacao/Legislacao.vue")
    },
    {
      path: "/legislacao/:idLegislacao",
      name: "consultaLegislacao",
      component: () => 
        import("./views/legislacao/LegislacaoConsulta.vue")
    },
    // Routes das tabelas de seleção
    {
      path: "/ts",
      name: "ts",
      component: () =>
        import("./views/tabSel/TabSel.vue")
    },
    {
      path: "/ts/criar",
      name: "criaTs",
      component: () =>
        import("./views/tabSel/TabSelCria.vue")
    },
    {
      path: "/ts/passos",
      name: "passosTs",
      component: () =>
        import("./views/tabSel/TabSelPassos.vue")
    },
    // Routes dos termos de indice
    {
      path: "/termosIndice",
      name: "termosIndice",
      component: () =>
        import("./views/termosIndice/TermosIndice.vue")
    },
    // Routes das tipologias
    {
      path: "/tipologias",
      name: "tipologias",
      component: () =>
        import("./views/tipologias/Tipologias.vue")
    },
    {
      path: "/tipologias/:idTipologia",
      name: "consultaTipologia",
      component: () => 
        import("./views/tipologias/TipologiasConsulta.vue")
    },
    // Routes dos pedidos
    {
      path: "/consulta/:idPedido",
      name: "consultaPedido",
      component: () => 
        import("./views/Consulta.vue")
    },
    {
      path: "/pedidos",
      name: "pedidos",
      component: () => 
        import("./views/Pedidos.vue")
    }
  ]
});
