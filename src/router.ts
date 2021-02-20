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
      component: () => import("./views/Home.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "CLAV", ent: true}
    },
    {
      path: "/registo",
      name: "registarClav",
      component: () => import("./views/paginasInfo/Registar.vue"),
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Registo na CLAV"
      }
    },
    // Routes das classes
    {
      path: "/lcInfo",
      name: "lcInfo",
      component: () => import("./views/paginasInfo/ListaConsl.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/classes/consultar",
      name: "classes",
      props: true,
      component: () => import("./views/classes/Classes.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/classes/editar",
      name: "classesEditar",
      component: () => import("./views/classes/ClassesEditar.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/classes/editar/:idClasse",
      name: "editaClasse",
      component: () => import("./views/classes/ClassesEdita.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/classes/consultar/:idClasse",
      name: "consultaClasse",
      props: true,
      component: () => import("./views/classes/ClassesConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/classes/showPedido/:idPedido",
      name: "showPedidoClasse",
      component: () => import("./views/classes/ClassesShowPedido.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/classes/criar",
      name: "criaClasse",
      component: () => import("./views/classes/ClassesCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    // Routes da documentação de apoio
    {
      path: "/documentacaoApoioInfo",
      name: "docsInfo",
      component: () => import("./views/paginasInfo/DocumentacaoApoio.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/docsporclasse",
      name: "docsClasse",
      component: () => import("./views/paginasInfo/DocumentosClasse.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Documentação"}
    },
    {
      path: "/documentacaoApoio/criar/classe",
      name: "criaClasseApoio",
      component: () => import("./views/documentacaoApoio/ApoioClasseCria.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/criar/entrada/:classe",
      name: "criaEntradaApoio",
      component: () => import("./views/documentacaoApoio/ApoioEntradaCria.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/criar/elemento/:classe/:entrada",
      name: "criaElementoApoio",
      component: () =>
        import("./views/documentacaoApoio/ApoioElementoCria.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/editar/classe/:classe/",
      name: "editarClasseApoio",
      component: () => import("./views/documentacaoApoio/ApoioClasseEdita.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/editar/entrada/:classe/:entrada",
      name: "editarEntradaApoio",
      component: () =>
        import("./views/documentacaoApoio/ApoioEntradaEdita.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/editar/elemento/:classe/:entrada/:elemento",
      name: "editarElementoApoio",
      component: () =>
        import("./views/documentacaoApoio/ApoioElementoEdita.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/criar/tecnico_cientifico",
      name: "criaEntradaCientifico",
      component: () => import("./views/documentacaoApoio/CientificaCria.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/importar/tecnico_cientifico",
      name: "importarTecnicoCientifico",
      component: () =>
        import("./views/documentacaoApoio/CientificaImporta.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/importar/documentacao_apoio",
      name: "importarApoio",
      component: () => import("./views/documentacaoApoio/ApoioImporta.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/documentacaoApoio/editar/tecnico_cientifico/:id",
      name: "editaEntradaCientifico",
      component: () => import("./views/documentacaoApoio/CientificaEdita.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    // Routes das entidades
    {
      path: "/entidades",
      name: "entInfo",
      component: () => import("./views/paginasInfo/Entidade.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/entidades/consultar",
      name: "entidades",
      component: () => import("./views/entidades/Entidades.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/entidades/criar",
      name: "criaEntidade",
      component: () => import("./views/entidades/EntidadesCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/entidades/editar/:idEntidade",
      name: "editaEntidade",
      component: () => import("./views/entidades/EntidadesEdita.vue"),
      meta: { levels: [4, 5, 6, 7] }
    },
    {
      path: "/entidades/:idEntidade",
      name: "consultaEntidade",
      component: () => import("./views/entidades/EntidadesConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes da legislação
    {
      path: "/legislacao",
      name: "legInfo",
      component: () => import("./views/paginasInfo/Legislacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/legislacao/consultar",
      name: "legislacao",
      component: () => import("./views/legislacao/Legislacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/legislacao/criar",
      name: "criaLegislacao",
      component: () => import("./views/legislacao/LegislacaoCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/legislacao/editar/:idLegislacao",
      name: "editaLegislacao",
      component: () => import("./views/legislacao/LegislacaoEdita.vue"),
      meta: { levels: [4, 5, 6, 7] }
    },
    {
      path: "/legislacao/:idLegislacao",
      name: "consultaLegislacao",
      component: () => import("./views/legislacao/LegislacaoConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes das tabelas de seleção
    {
      path: "/tsInfo",
      name: "tsInfo",
      component: () => import("./views/paginasInfo/TabelaSelecao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/ts/consultar",
      name: "ts",
      component: () => import("./views/tabSel/TabSel.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/ts/criar",
      name: "criaTsTipo",
      component: () => import("./views/tabSel/TabSelCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/ts/criar/organizacional",
      name: "criaTsOrg",
      component: () => import("./views/tabSel/TabSelCriaOrg.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/ts/criar/pluriorganizacional",
      name: "criaTsPluri",
      component: () => import("./views/tabSel/TabSelCriaPluri.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/ts/passos",
      name: "passosTs",
      component: () => import("./views/tabSel/TabSelPassos.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/ts/importar/csv",
      name: "importaCSV",
      component: () => import("./views/tabSel/TabSelImportaCSV.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/ts/:id",
      name: "consultarTS",
      component: () => import("./views/tabSel/TabSelConsulta.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes dos termos de indice
    {
      path: "/termosIndiceInfo",
      name: "termosIndiceInfo",
      component: () => import("./views/paginasInfo/TermosIndice.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/termosIndice",
      name: "termosIndice",
      component: () => import("./views/termosIndice/TermosIndice.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/termosIndice/criar",
      name: "criaTermosIndice",
      component: () => import("./views/termosIndice/TermosIndiceCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    // {
    //   path: "/termosIndice/editar/:idTermo",
    //   name: "editaTermosIndice",
    //   component: () => import("./views/termosIndice/TermosIndiceEdita.vue"),
    //   meta: { levels: [4, 5, 6, 7] }
    // },
    // Routes dos Vocabulários Controlados
    {
      path: "/vocabularios",
      name: "vocabulariosControlados",
      component: () => import("./views/vocabularios/Vocabularios.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Gestão da Plataforma"}
    },
    {
      path: "/vocabularios/:idVC",
      name: "TermosVocabulariosControlados",
      component: () => import("./views/vocabularios/VocabulariosTermos.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes dos RADA
    {
      path: "/radaInfo",
      name: "radaInfo",
      component: () => import("./views/paginasInfo/RADA.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/rada/consultar",
      name: "Rada",
      component: () => import("./views/rada/Radas.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/rada/criar",
      name: "criarRada",
      component: () => import("./views/rada/criarRada.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/rada/:id",
      name: "consultaRADA",
      component: () => import("./views/rada/ConsultaRADA.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes das PGD
    {
      path: "/pgd/:idPGD",
      name: "consultaPDG",
      component: () => import("./views/pgd/PGDConsultar.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes dos Autos de Eliminação
    {
      path: "/autosEliminacaoInfo",
      name: "autosEliminacaoInfo",
      component: () => import("./views/paginasInfo/AutosEliminacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/autosEliminacao/consultar",
      name: "AutosEliminacao",
      component: () => import("./views/autosEliminacao/AutosEliminacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/autosEliminacao/criar",
      name: "criarAutosEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoCriar.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/autosEliminacao/importar",
      name: "importarAutosEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoImportar.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/autosEliminacao/:idAE",
      name: "consultaAutoEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoConsultar.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes das tipologias
    {
      path: "/tipologias",
      name: "tipEntInfo",
      component: () => import("./views/paginasInfo/TipEntidade.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/tipologias/consultar",
      name: "tipologias",
      component: () => import("./views/tipologias/Tipologias.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/tipologias/criar",
      name: "criaTipologia",
      component: () => import("./views/tipologias/TipologiasCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/tipologias/editar/:idTipologia",
      name: "editaTipologia",
      component: () => import("./views/tipologias/TipologiasEdita.vue"),
      meta: { levels: [4, 5, 6, 7] }
    },
    {
      path: "/tipologias/:idTipologia",
      name: "consultaTipologia",
      component: () => import("./views/tipologias/TipologiasConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes das notícias
    {
      path: "/noticias",
      name: "noticias",
      component: () => import("./views/noticias/Noticias.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/noticias/criar",
      name: "criaNoticia",
      component: () => import("./views/noticias/NoticiasCria.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7] }
    },
    {
      path: "/noticias/importar",
      name: "importarNoticias",
      component: () => import("./views/noticias/NoticiasImporta.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7] }
    },
    {
      path: "/noticias/editar/:idNoticia",
      name: "editaNoticia",
      component: () => import("./views/noticias/NoticiasEdita.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7] }
    },
    {
      path: "/noticias/:idNoticia",
      name: "consultaNoticia",
      component: () => import("./views/noticias/NoticiasConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes das colaborações/equipas de trabalho
    {
      path: "/colaboracoes",
      name: "colaboracoes",
      component: () => import("./views/colaboracoes/Colaboracoes.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/colaboracoes/criar",
      name: "criaColaboracao",
      component: () => import("./views/colaboracoes/ColaboracoesCria.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7] }
    },
    {
      path: "/colaboracoes/importar",
      name: "importarColaboracoes",
      component: () => import("./views/colaboracoes/ColaboracoesImporta.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7] }
    },
    {
      path: "/colaboracoes/editar/:idColaboracao",
      name: "editaColaboracao",
      component: () => import("./views/colaboracoes/ColaboracoesEdita.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7] }
    },
    {
      path: "/colaboracoes/:idColaboracao",
      name: "consultaColaboracao",
      component: () => import("./views/colaboracoes/ColaboracoesConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes dos pedidos
    {
      path: "/pedidos",
      name: "pedidos",
      component: () => import("./views/pedidos/Pedidos.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Gestão de Pedidos"  }
    },
    {
      path: "/pedidosnovos",
      name: "pedidosNovos",
      component: () => import("./components/pedidos/PedidosNovos.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Gestão de Pedidos"  }
    },
    {
      path: "/pedidos/submissao/:idPedido",
      name: "submissaoPedido",
      component: () => import("./views/pedidos/PedidosSubmissao.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/pedidos/finalizacao/:idPedido",
      name: "finalizacaoPedido",
      component: () => import("./views/pedidos/PedidosFinalizacao.vue"),
      meta: { levels: [4, 6, 7] }
    },
    {
      path: "/pedidos/:idPedido",
      name: "consultaPedido",
      component: () => import("./views/pedidos/PedidosConsulta.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/pedidos/analisar/:idPedido",
      name: "analisePedido",
      component: () => import("./views/pedidos/PedidosAnalise.vue"),
      meta: { levels: [3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/pedidos/validar/:idPedido",
      name: "validarPedido",
      component: () => import("./views/pedidos/PedidosValidacao.vue"),
      meta: { levels: [3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/pedidos/despachar/:idPedido",
      name: "despacharPedido",
      component: () => import("./views/pedidos/PedidosDespacho.vue"),
      meta: { levels: [3, 3.5, 4, 5, 6, 7] },
    },
    {
      path: "/pedidos/novos/:idPedido",
      name: "pedidoNovo",
      component: () => import("./views/pedidos/PedidosNovos.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Gestão de Pedidos" }
    },
    // Routes dos pendentes (trabalho guardado)
    {
      path: "/pendentes",
      name: "pendentes",
      component: () => import("./views/pendentes/Pendentes.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Gestão de Pedidos" }
    },
    {
      path: "/pendentes/:idPendente",
      name: "consultaPendente",
      component: () => import("./views/pendentes/PendentesConsulta.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/pendentes/continuar/:idPendente",
      name: "continuaPendente",
      component: () => import("./views/pendentes/PendentesContinuacao.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7] }
    },
    // Routes da gestão de utilizadores
    {
      path: "/users/autenticacao",
      name: "autenticacao",
      component: () => import("./views/users/Autenticacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/registo",
      name: "registo",
      component: () => import("./views/users/Registo.vue"),
      meta: { levels: [4, 5, 6, 7] }
    },
    {
      path: "/users/login",
      name: "login",
      component: () => import("./views/users/Login.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/logout",
      name: "logout",
      component: () => import("./views/users/Logout.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/recuperacao",
      name: "recuperacao",
      component: () => import("./views/users/Recuperacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/alteracaoPassword",
      name: "alteracaoPassword",
      component: () => import("./views/users/AlteracaoPassword.vue"),
      meta: { levels: [1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/alteracaoPasswordRecuperacao",
      name: "alteracaoPasswordRecuperacao",
      component: () => import("./views/users/AlteracaoPasswordRecuperacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/usersInfo",
      name: "usersInfo",
      component: () => import("./views/paginasInfo/UsersInfo.vue"),
      meta: {
        levels: [5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/users/listagem",
      name: "listagem",
      component: () => import("./views/users/ListagemUsers.vue"),
      meta: { levels: [4, 5, 6, 7] }
    },
    {
      path: "/users/registoParaEntidade",
      name: "registoParaEntidade",
      component: () => import("./views/users/RegistoParaEntidade.vue"),
      meta: { levels: [4, 5, 6, 7] }
    },
    {
      path: "/users/registoAcesso",
      name: "registoDeAcesso",
      component: () => import("./views/users/RegistoAcesso.vue"),
      meta: { levels: [6, 7] }
    },
    {
      path: "/users/pedidos",
      name: "pedidosUtilizador",
      component: () => import("./views/users/GestaoPedidos.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Gestão de Pedidos" }
    },
    {
      path: "/users/pedidos/:numeroPedido",
      name: "consultaPedidoUtilizador",
      component: () => import("./views/users/ConsultaPedidoUtilizador.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/users/pedidos/:numeroPedido/relatorio",
      name: "consultaRelatorioPedidoUtilizador",
      component: () => import("./views/users/ConsultaRelatorioPedido.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    //cartao cidadao
    {
      path: "/users/handlerCC",
      name: "handlerCC",
      component: () => import("./views/users/HandlerCC.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    //Métricas
    {
      path: "/gestao/metrica",
      name: "metrica",
      component: () => import("./views/gestao/Metrica.vue"),
      meta: { levels: [3, 3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    {
      path: "/gestao/classes",
      name: "indicadores",
      component: () => import("./views/gestao/Classe.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    {
      path: "/gestao/gerais",
      name: "gerais",
      component: () => import("./views/gestao/Geral.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    {
      path: "/gestao/tabela",
      name: "tabela",
      component: () => import("./views/gestao/Tabela.vue"),
      meta: { levels: [3, 3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    //Chaves API
    {
      path: '/docs',
      name: "docs",
      component: () => import("./views/paginasInfo/ApiDados.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/gestao/api/listagem",
      name: "listagemApi",
      component: () => import("./views/gestao/api/ListagemChavesApi.vue"),
      meta: { levels: [7], tabAtiva: "Gestão da Plataforma" }
    },
    {
      path: "/gestao/api/registo",
      name: "registoApi",
      component: () => import("./views/gestao/api/RegistoChaveApi.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/gestao/api/renovar",
      name: "renovarApi",
      component: () => import("./views/gestao/api/RenovarChaveApi.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    //Administração
    {
      path: "/gestaoInfo",
      name: "gestaoInfo",
      component: () => import("./views/paginasInfo/AdministracaoInfo.vue"),
      meta: {
        levels: [7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/gestao/administracao",
      name: "administracao",
      component: () => import("./views/gestao/Administracao.vue"),
      meta: { levels: [7] }
    },
    {
      path: "/gestao/alterarParametros",
      name: "alterarParametros",
      component: () => import("./views/gestao/AlterarParametros.vue"),
      meta: { levels: [7] }
    },
    {
      path: "/gestao/exportarColecoes",
      name: "exportarColecoes",
      component: () => import("./views/gestao/ExportarColecoes.vue"),
      meta: { levels: [7] }
    },
    {
      path: "/gestao/apagarColecoes",
      name: "apagarColecoes",
      component: () => import("./views/gestao/ApagarColecoes.vue"),
      meta: { levels: [7] }
    },
    // Routes de Invariantes
    {
      path: "/invariantes",
      name: "invariantes",
      component: () => import("./views/invariantes/Invariantes.vue"),
      meta: { levels: [6, 7], tabAtiva: "Gestão da Plataforma" }
    },
    {
      path: "/invariantes/testarTodos",
      name: "testarTodosInvariantes",
      component: () => import("./views/invariantes/TestarTodos.vue"),
      meta: { levels: [6, 7] }
    },
    //exportação
    {
      path: "/importExportInfo",
      name: "importExportInfo",
      component: () => import("./views/paginasInfo/ImportacaoExportacaoInfo.vue"),
      meta: {
        levels: [4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/exportar",
      name: "exportação",
      component: () => import("./views/paginasInfo/Exportacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/permissoesAcesso",
      name: "permissõesDeAcesso",
      component: () => import("./views/PermissoesAcesso.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Gestão da Plataforma" }
    },
    //PPD
    {
      path: "/planosDePreservacaoDigital",
      name: "planosDePreservacaoDigital",
      component: () => import("./views/paginasInfo/PlanosDePreserDig.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/ppd/consultar",
      name: "ConsultaPPD",
      component: () => import("./views/ppd/ConsultaPPD.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/ppd/criar",
      name: "CriaPPD",
      component: () => import("./views/ppd/CriaPPD.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    }
  ]
});
