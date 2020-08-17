import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    /*
    {
      path: "/oldentry",
      name: "oldentry",
      component: () => import("./views/Principal.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },*/
    {
      path: "/oldentry",
      name: "oldentry",
      component: () => import("./views/Entidade.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7] }
    },
    {
      path: "/",
      name: "home",
      component: () => import("./views/Oque.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "O que é" }
    },
    {
      path: "/registo",
      name: "registarClav",
      component: () => import("./views/Registar.vue"),
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Registo na Clav"
      }
    },
    {
      path: "/indrepr",
      name: "indicacaoRepresentante",
      component: () => import("./views/IndRepresentante.vue"),
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Registo na Clav"
      }
    },
    {
      path: "/lcinfo",
      name: "lcInfo",
      component: () => import("./views/ListaConslInfo.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/tsinfo",
      name: "tsInfo",
      component: () => import("./views/TabelaSelecInfo.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/docs",
      name: "docs",
      component: () => import("./views/ApiDadosInfo.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/docsmetdl",
      name: "docsMetdl",
      component: () => import("./views/DocsMetodologicos.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/manuais",
      name: "manuais",
      component: () => import("./views/Manuais.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/forminstr",
      name: "formInstr",
      component: () => import("./views/FormInstrucoes.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/prodtec",
      name: "prodTec",
      component: () => import("./views/ProdTecnCientifica.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Documentação" }
    },
    {
      path: "/usersInfo",
      name: "usersInfo",
      component: () => import("./views/UsersInfo.vue"),
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/gestaoInfo",
      name: "gestaoInfo",
      component: () => import("./views/AdministracaoInfo.vue"),
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    // Routes das classes
    {
      path: "/classes",
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
    // Routes das entidades
    {
      path: "/entidades",
      name: "entInfo",
      component: () => import("./views/EntidadeInfo.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/entidades/consultar",
      name: "entidades",
      component: () => import("./views/entidades/Entidades.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/entidades/criar",
      name: "criaEntidade",
      component: () => import("./views/entidades/EntidadesCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/entidades/editar/:idEntidade",
      name: "editaEntidade",
      component: () => import("./views/entidades/EntidadesEdita.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/entidades/:idEntidade",
      name: "consultaEntidade",
      component: () => import("./views/entidades/EntidadesConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    // Routes da legislação
    {
      path: "/legislacao",
      name: "legInfo",
      component: () => import("./views/LegislacaoInfo.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/legislacao/consultar",
      name: "legislacao",
      component: () => import("./views/legislacao/Legislacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/legislacao/criar",
      name: "criaLegislacao",
      component: () => import("./views/legislacao/LegislacaoCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/legislacao/editar/:idLegislacao",
      name: "editaLegislacao",
      component: () => import("./views/legislacao/LegislacaoEdita.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/legislacao/:idLegislacao",
      name: "consultaLegislacao",
      component: () => import("./views/legislacao/LegislacaoConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    // Routes das tabelas de seleção
    {
      path: "/ts",
      name: "ts",
      component: () => import("./views/tabSel/TabSel.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/ts/criar",
      name: "criaTsTipo",
      component: () => import("./views/tabSel/TabSelCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/ts/criar/organizacional",
      name: "criaTsOrg",
      component: () => import("./views/tabSel/TabSelCriaOrg.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/ts/criar/pluriorganizacional",
      name: "criaTsPluri",
      component: () => import("./views/tabSel/TabSelCriaPluri.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/ts/passos",
      name: "passosTs",
      component: () => import("./views/tabSel/TabSelPassos.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/ts/importar/csv",
      name: "importaCSV",
      component: () => import("./views/tabSel/TabSelImportaCSV.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    // Routes dos termos de indice
    {
      path: "/termosIndice",
      name: "termosIndice",
      component: () => import("./views/termosIndice/TermosIndice.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/termosIndice/criar",
      name: "criaTermosIndice",
      component: () => import("./views/termosIndice/TermosIndiceCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
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
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/vocabularios/:idVC",
      name: "TermosVocabulariosControlados",
      component: () => import("./views/vocabularios/VocabulariosTermos.vue"),
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    // Routes dos RADA
    {
      path: "/rada/criar",
      name: "criarRada",
      component: () => import("./views/rada/criarRada.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Operações" }
    },
    // Routes dos Autos de Eliminação
    {
      path: "/autosEliminacao",
      name: "AutosEliminacao",
      component: () => import("./views/autosEliminacao/AutosEliminacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/autosEliminacao/criar",
      name: "criarAutosEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoCriar.vue"),
      meta: { levels: [3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/autosEliminacao/importar",
      name: "importarAutosEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoImportar.vue"),
      meta: { levels: [3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/autosEliminacao/:idAE",
      name: "consultaAutoEliminacao",
      component: () =>
        import("./views/autosEliminacao/AutosEliminacaoConsultar.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    // Routes das tipologias
    {
      path: "/tipologias",
      name: "tipEntInfo",
      component: () => import("./views/TipEntidadeInfo.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/tipologias/consultar",
      name: "tipologias",
      component: () => import("./views/tipologias/Tipologias.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/tipologias/criar",
      name: "criaTipologia",
      component: () => import("./views/tipologias/TipologiasCria.vue"),
      meta: { levels: [1, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/tipologias/editar/:idTipologia",
      name: "editaTipologia",
      component: () => import("./views/tipologias/TipologiasEdita.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Operações" }
    },
    {
      path: "/tipologias/:idTipologia",
      name: "consultaTipologia",
      component: () => import("./views/tipologias/TipologiasConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    },
    // Routes das notícias
    {
      path: "/noticias",
      name: "noticias",
      component: () => import("./views/noticias/Noticias.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Notícias" }
    },
    {
      path: "/noticias/criar",
      name: "criaNoticia",
      component: () => import("./views/noticias/NoticiasCria.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Notícias" }
    },
    {
      path: "/noticias/editar/:idNoticia",
      name: "editaNoticia",
      component: () => import("./views/noticias/NoticiasEdita.vue"),
      meta: { levels: [4, 5, 6, 7], tabAtiva: "Notícias" }
    },
    {
      path: "/noticias/:idNoticia",
      name: "consultaNoticia",
      component: () => import("./views/noticias/NoticiasConsulta.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Notícias" }
    },
    // Routes dos pedidos
    {
      path: "/pedidos",
      name: "pedidos",
      component: () => import("./views/pedidos/Pedidos.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/pedidos/submissao",
      name: "submissaoPedido",
      component: () => import("./views/pedidos/PedidosSubmissao.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/pedidos/:idPedido",
      name: "consultaPedido",
      component: () => import("./views/pedidos/PedidosConsulta.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/pedidos/analisar/:idPedido",
      name: "analisePedido",
      component: () => import("./views/pedidos/PedidosAnalise.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/pedidos/validar/:idPedido",
      name: "validarPedido",
      component: () => import("./views/pedidos/PedidosValidacao.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/pedidos/novos/:idPedido",
      name: "pedidoNovo",
      component: () => import("./views/pedidos/PedidosNovos.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    // Routes dos pendentes (trabalho guardado)
    {
      path: "/pendentes",
      name: "pendentes",
      component: () => import("./views/pendentes/Pendentes.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/pendentes/:idPendente",
      name: "consultaPendente",
      component: () => import("./views/pendentes/PendentesConsulta.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/pendentes/continuar/:idPendente",
      name: "continuaPendente",
      component: () => import("./views/pendentes/PendentesContinuacao.vue"),
      meta: {
        levels: [1, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    // Routes da gestão de utilizadores
    {
      path: "/users/autenticacao",
      name: "autenticacao",
      component: () => import("./views/users/Autenticacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "" }
    },
    {
      path: "/users/registo",
      name: "registo",
      component: () => import("./views/users/Registo.vue"),
      meta: { levels: [5, 6, 7], tabAtiva: "" }
    },
    {
      path: "/users/login",
      name: "login",
      component: () => import("./views/users/Login.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "" }
    },
    {
      path: "/users/recuperacao",
      name: "recuperacao",
      component: () => import("./views/users/Recuperacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "" }
    },
    {
      path: "/users/alteracaoPassword",
      name: "alteracaoPassword",
      component: () => import("./views/users/AlteracaoPassword.vue"),
      meta: { levels: [1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "" }
    },
    {
      path: "/users/alteracaoPasswordRecuperacao",
      name: "alteracaoPasswordRecuperacao",
      component: () => import("./views/users/AlteracaoPasswordRecuperacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "" }
    },
    {
      path: "/users/listagem",
      name: "listagem",
      component: () => import("./views/users/ListagemUsers.vue"),
      meta: { levels: [5, 6, 7], tabAtiva: "Gestão da Plataforma" }
    },
    {
      path: "/users/registoParaEntidade",
      name: "registoParaEntidade",
      component: () => import("./views/users/RegistoParaEntidade.vue"),
      meta: { levels: [5, 6, 7], tabAtiva: "Gestão da Plataforma" }
    },
    {
      path: "/users/registoAcesso",
      name: "registoDeAcesso",
      component: () => import("./views/users/RegistoAcesso.vue"),
      meta: { levels: [6, 7], tabAtiva: "Gestão da Plataforma" }
    },
    //cartao cidadao
    {
      path: "/users/handlerCC",
      name: "handlerCC",
      component: () => import("./views/users/HandlerCC.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "" }
    },
    //Métricas
    {
      path: "/gestao/metrica",
      name: "metrica",
      component: () => import("./views/gestao/Metrica.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    {
      path: "/gestao/classes",
      name: "indicadores",
      component: () => import("./views/gestao/Classe.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    {
      path: "/gestao/gerais",
      name: "gerais",
      component: () => import("./views/gestao/Geral.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    {
      path: "/gestao/tabela",
      name: "tabela",
      component: () => import("./views/gestao/Tabela.vue"),
      meta: { levels: [3.5, 4, 5, 6, 7], tabAtiva: "Estatísticas" }
    },
    //Chaves API
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
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    {
      path: "/gestao/api/renovar",
      name: "renovarApi",
      component: () => import("./views/gestao/api/RenovarChaveApi.vue"),
      meta: {
        levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
        tabAtiva: "Gestão da Plataforma"
      }
    },
    //Administração
    {
      path: "/gestao/administracao",
      name: "administracao",
      component: () => import("./views/gestao/Administracao.vue"),
      meta: { levels: [7], tabAtiva: "Gestão da Plataforma" }
    },
    {
      path: "/gestao/exportarColecoes",
      name: "exportarColecoes",
      component: () => import("./views/gestao/ExportarColecoes.vue"),
      meta: { levels: [7], tabAtiva: "Gestão da Plataforma" }
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
      meta: { levels: [6, 7], tabAtiva: "Gestão da Plataforma" }
    },
    //exportação
    {
      path: "/exportar",
      name: "exportação",
      component: () => import("./views/exportacao/Exportacao.vue"),
      meta: { levels: [0, 1, 2, 3, 3.5, 4, 5, 6, 7], tabAtiva: "Operações" }
    }
  ]
});
