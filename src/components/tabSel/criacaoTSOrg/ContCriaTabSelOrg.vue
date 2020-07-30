<template>
  <v-row class="ma-1">
    
  </v-row>
</template>

<script>
import ListaProcessosComuns from "@/components/tabSel/criacaoTSOrg/ListaProcessosComuns.vue";
import ListaProcessosEspecificos from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/criacaoTSOrg/ListaProcessosUltimos.vue";
import ListaParteDescritiva from "@/components/tabSel/parteDescritiva/ListaProcSel.vue";

import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";

export default {
  props: ["obj"],
  components: {
    ListaProcessosComuns,
    ListaProcessosEspecificos,
    ListaProcessosEspRestantes,
    ListaProcessosUltimos,
    //DesSelTip,
    //SelTip,
    ListaParteDescritiva
  },

  data() {
    return {
      tabelaSelecao: {},
      // Numero do passo da criação de TS
      stepNo: 2,
      // Valor da barra de progresso
      valorBarra: 0,
      // Lista de todas as tipologias existentes
      tipologias: [],
      // True quando a lista de tipologias estiver carregada
      tipologiasReady: false,
      // Lista das tipologias desta entidade
      tipEnt: [],
      // se o utilizador aumentar ou diminuir o numero de tipologias selecionadas
      difTip: false,
      // Lista com as tipologias selecionadas
      tipSel: [],
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcComunsReady: false,
      // Lista com todos os processos comuns
      listaProcComuns: [],
      // True quando a lista de todos os processos especificos da entidade e tipologias em causa estiver completa
      listaProcEspReady: false,
      // Lista com todos os processos especificos da entidade e tipologias em causa
      listaProcEsp: [],
      // Numero de processos comuns selecionados
      numProcSelCom: 0,
      // Numero de processos comuns que se encontram pré selecionados
      numProcPreSelCom: 0,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs comuns)
      procPreSelResTravComum: [],
      // Numero de processos comuns selecionados pelo sistema
      numProcSelComSistema: 0,
      // Numero de processos comuns selecionados pelo utilizador
      numProcSelComUtilizador: 0,
      // True quando a lista dos processos especificos restantes estiver completa
      listaProcEspResReady: false,
      // Lista com Todos os processos especificos existentes
      listaTotalProcEsp: [],
      // Lista dos processos especificos restantes (que não são especificos da entidade nem da tipologia em causa)
      listaProcEspRes: [],
      // Numero de processos pre selecionados especificos
      numProcPreSelEsp: 0,
      // Numero de processos especificos selecionados
      numProcSelEsp: 0,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs especificos)
      procPreSelResTravEspecifico: [],
      // Numero de processos especificos selecionados pelo sistema
      numProcSelEspSistema: 0,
      // Numero de processos especificos selecionados pelo utilizador
      numProcSelEspUtilizador: 0,
      // Numero de processos restantes que se encontram pré selecionados
      numProcPreSelRes: 0,
      // Numero de processos restantes selecionados
      numProcSelRes: 0,
      // Lista dos processos pré selecionados restantes (resultado das travessias pos PNs especificos restantes)
      procPreSelResTravRestante: [],
      // Lista dos processos pré selecionados resultantes das travessias dos comuns e especificos
      procPreSelEspRestantes: [],
      // Numero de processos esp restantes selecionados pelo sistema
      numProcSelEspResSistema: 0,
      // Numero de processos esp restantes selecionados pelo utilizador
      numProcSelEspResUtilizador: 0,
      // Lista de todos os processos que ainda não foram selecionados nas etapas anteriores
      listaProcUlt: [],
      // True quando a ultima lista estiver pronta
      listaProcUltReady: false,
      // Lista dos ultimos processos pre selecionados
      procPreSelUltimos: [],
      // Numero de processos pré selecionados no ultimo componente de seleção
      numProcPreSelUlt: 0,
      // Número dos ultimos processos selecionados
      numProcSelUlt: 0,
      // Para o snackbar de pedido criado e trabalho guardado
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação finalização de TS
      finalizaUltPasso: false,
      // Lista de todos os processos selecionados em todos os passos
      listaTotalProcSel: [],
      listaTotalProcSelReady: false,
      listaTotalProcSelUpdate: []
    };
  },
  methods: {
    // Visualização de estruturas para efeitos de debug
    debug: function(obj){
      alert(JSON.stringify(obj));
    },
    // Valor da barra de progresso
    barra: async function(valor) {
      this.valorBarra = valor;
    },
    // Vai à API buscar todas as tipologias e as tipologias especificas da entidade do utilizador
    loadTipologias: async function() {
      try {
        var response = await this.$request("get", "/tipologias/");
        this.tipologias = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            searchField: item.sigla + " - " + item.designacao
          };
        });
        this.tipologiasReady = true;

        // Tipologias onde a entidade se encontra
        var tipologiasEnt = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipEnt = tipologiasEnt.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            searchField: item.sigla + " - " + item.designacao
          };
        });

        this.tipSel = this.tabelaSelecao.tipologias;
        
      } catch (error) {
        return error;
      }
    },
    // Carrega todos os processos comuns
    loadProcComuns: async function() {
      try {
        if (!this.listaProcComunsReady) {
          var procSelSistema = 0;
          var procSelUtilizador = 0;
          var response = await this.$request("get", "/classes?tipo=comum");
          for (var i = 0; i < response.data.length; i++) {
            for (var j = 0; j < this.tabelaSelecao.procComuns.length; j++) {
              var estavaGuardado = false;
              if (
                this.tabelaSelecao.procComuns[j].classe ==
                response.data[i].codigo
              ) {
                if (response.data[i].transversal === "S") {
                  procSelUtilizador += 1;
                  if (
                    this.tabelaSelecao.procComuns[j].participante == "Não Sel"
                  ) {
                    this.listaProcComuns.push({
                      classe: this.tabelaSelecao.procComuns[j].classe,
                      designacao: this.tabelaSelecao.procComuns[j].designacao,
                      dono: this.tabelaSelecao.procComuns[j].dono,
                      participante: false
                    });
                  } else {
                    this.listaProcComuns.push({
                      classe: this.tabelaSelecao.procComuns[j].classe,
                      designacao: this.tabelaSelecao.procComuns[j].designacao,
                      dono: this.tabelaSelecao.procComuns[j].dono,
                      participante: this.tabelaSelecao.procComuns[j]
                        .participante
                    });
                  }
                } else {
                  procSelSistema += 1;
                  this.listaProcComuns.push({
                    classe: response.data[i].codigo,
                    designacao: response.data[i].titulo,
                    dono: this.tabelaSelecao.procComuns[j].dono
                  });
                }
                estavaGuardado = true;
                break;
              }
            }
            if (!estavaGuardado) {
              if (response.data[i].transversal === "S") {
                this.listaProcComuns.push({
                  classe: response.data[i].codigo,
                  designacao: response.data[i].titulo,
                  dono: false,
                  participante: false
                });
              } else {
                this.listaProcComuns.push({
                  classe: response.data[i].codigo,
                  designacao: response.data[i].titulo,
                  dono: false
                });
              }
            }
          }
          this.listaProcComuns.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          this.listaProcComunsReady = true;
          this.numProcSelComSistema = procSelSistema;
          this.numProcSelComUtilizador = procSelUtilizador;
          return this.listaProcComuns;
        }
      } catch (err) {
        return err;
      }
    },
    // Retira da lista de tipologias selecionadas
    unselectTipologia: function(tipologia) {
      this.tipologias.push(tipologia);
      var index = this.tipSel.findIndex(e => e.id === tipologia.id);
      this.tipSel.splice(index, 1);
      this.difTip = true;
    },
    // Coloca na lista de tipologias selecionadas
    selectTipologia: function(tipologia) {
      this.tipSel.push(tipologia);
      var index = this.tipologias.findIndex(e => e.id === tipologia.id);
      this.tipologias.splice(index, 1);
      this.difTip = true;
    },
    // Carrega os processos específicos da entidade em causa
    loadProcEspecificos: async function() {
      try {
        this.tabelaSelecao.tipologias = this.tabelaSelecao.tipologias.concat(
          this.tipEnt
        );
        if (!this.listaProcEspReady) {
          var procSelSistema = 0;
          var procSelUtilizador = 0;
          var url =
            "/classes?tipo=especifico&ents=" + this.tabelaSelecao.idEntidade;
          if (this.tabelaSelecao.tipologias) {
            url += "&tips=";
            for (var i = 0; i < this.tabelaSelecao.tipologias.length - 1; i++) {
              url += this.tabelaSelecao.tipologias[i].id + ",";
            }
            url += this.tabelaSelecao.tipologias[i].id;
          }
          var response = await this.$request("get", url);
          for (var x = 0; x < response.data.length; x++) {
            for (
              var j = 0;
              j < this.tabelaSelecao.procEspecificos.length;
              j++
            ) {
              var estavaGuardado = false;
              if (
                this.tabelaSelecao.procEspecificos[j].classe ==
                response.data[x].codigo
              ) {
                if (response.data[x].transversal === "S") {
                  procSelUtilizador += 1;
                  if (
                    this.tabelaSelecao.procEspecificos[j].participante ==
                    "Não Sel"
                  ) {
                    this.listaProcEsp.push({
                      classe: this.tabelaSelecao.procEspecificos[j].classe,
                      designacao: this.tabelaSelecao.procEspecificos[j]
                        .designacao,
                      dono: this.tabelaSelecao.procEspecificos[j].dono,
                      participante: false
                    });
                  } else {
                    this.listaProcEsp.push({
                      classe: this.tabelaSelecao.procEspecificos[j].classe,
                      designacao: this.tabelaSelecao.procEspecificos[j]
                        .designacao,
                      dono: this.tabelaSelecao.procEspecificos[j].dono,
                      participante: this.tabelaSelecao.procEspecificos[j]
                        .participante
                    });
                  }
                } else {
                  procSelSistema += 1;
                  this.listaProcEsp.push({
                    classe: this.tabelaSelecao.procEspecificos[j].classe,
                    designacao: this.tabelaSelecao.procEspecificos[j]
                      .designacao,
                    dono: this.tabelaSelecao.procEspecificos[j].dono
                  });
                }
                estavaGuardado = true;
                break;
              }
            }
            if (!estavaGuardado) {
              if (response.data[x].transversal === "S") {
                this.listaProcEsp.push({
                  classe: response.data[x].codigo,
                  designacao: response.data[x].titulo,
                  dono: false,
                  participante: false
                });
              } else {
                this.listaProcEsp.push({
                  classe: response.data[x].codigo,
                  designacao: response.data[x].titulo,
                  dono: false
                });
              }
            }
          }
          this.listaProcEsp.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          this.numProcSelEspSistema = procSelSistema;
          this.numProcSelEspUtilizador = procSelUtilizador;
          return this.listaProcEsp;
        }
      } catch (error) {
        return error;
      }
    },
    // Contador dos processos selecionados comuns
    contadorProcSelCom: function(procSelec) {
      this.numProcSelCom = procSelec.length;
      this.tabelaSelecao.procComuns = JSON.parse(JSON.stringify(procSelec));
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelCom: function(lista) {
      this.numProcPreSelCom = lista.length;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravCom: function(procPreSelResTravCom) {
      this.procPreSelResTravComum = procPreSelResTravCom;
    },
    // Contador dos processos selecionados pelo sistema
    contadorProcSelComSistema: function(procSelec) {
      this.numProcSelComSistema = procSelec.length;
    },
    contadorComDecrementarSistema: function(listaDec) {
      this.numProcSelComSistema--;
    },
    contadorEspDecrementarSistema: function(listaDec) {
      this.numProcSelEspSistema--;
    },
    contadorEspResDecrementarSistema: function(listaDec) {
      this.numProcSelEspResSistema--;
    },
    contadorProcSelComUtilizador: function(procSelec) {
      this.numProcSelComUtilizador =
        procSelec.length - this.numProcSelComSistema;
    },
    // Carrega todos os processos especificos restantes
    loadProcEspRestantes: async function() {
      try {
        if (!this.listaProcEspResReady) {
          var procSelSistema = 0;
          var procSelUtilizador = 0;
          var response = await this.$request("get", "/classes?tipo=especifico");
          this.listaTotalProcEsp = response.data;
          for (var i = 0; i < this.listaTotalProcEsp.length; i++) {
            var espEntTip = false;
            for (var x = 0; x < this.listaProcEsp.length; x++) {
              if (
                this.listaTotalProcEsp[i].codigo === this.listaProcEsp[x].classe
              ) {
                espEntTip = true;
                break;
              }
            }
            if (espEntTip === false) {
              for (
                var j = 0;
                j < this.tabelaSelecao.procEspRestantes.length;
                j++
              ) {
                var estavaGuardado = false;
                if (
                  this.tabelaSelecao.procEspRestantes[j].classe ==
                  this.listaTotalProcEsp[i].codigo
                ) {
                  if (this.listaTotalProcEsp[i].transversal === "S") {
                    procSelUtilizador += 1;
                    if (
                      this.tabelaSelecao.procEspRestantes[j].participante ==
                      "Não Sel"
                    ) {
                      this.listaProcEspRes.push({
                        classe: this.tabelaSelecao.procEspRestantes[j].classe,
                        designacao: this.tabelaSelecao.procEspRestantes[j]
                          .designacao,
                        dono: this.tabelaSelecao.procEspRestantes[j].dono,
                        participante: false
                      });
                    } else {
                      this.listaProcEspRes.push({
                        classe: this.tabelaSelecao.procEspRestantes[j].classe,
                        designacao: this.tabelaSelecao.procEspRestantes[j]
                          .designacao,
                        dono: this.tabelaSelecao.procEspRestantes[j].dono,
                        participante: this.tabelaSelecao.procEspRestantes[j]
                          .participante
                      });
                    }
                  } else {
                    procSelSistema += 1;
                    this.listaProcEspRes.push({
                      classe: this.tabelaSelecao.procEspRestantes[j].classe,
                      designacao: this.tabelaSelecao.procEspRestantes[j]
                        .designacao,
                      dono: this.tabelaSelecao.procEspRestantes[j].dono
                    });
                  }
                  estavaGuardado = true;
                  break;
                }
              }
              if (!estavaGuardado) {
                if (this.listaTotalProcEsp[i].transversal === "S") {
                  this.listaProcEspRes.push({
                    classe: this.listaTotalProcEsp[i].codigo,
                    designacao: this.listaTotalProcEsp[i].titulo,
                    dono: false,
                    participante: false
                  });
                } else {
                  this.listaProcEspRes.push({
                    classe: this.listaTotalProcEsp[i].codigo,
                    designacao: this.listaTotalProcEsp[i].titulo,
                    dono: false
                  });
                }
              }
            }
          }
          this.listaProcEspRes.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          this.numProcSelEspResSistema = procSelSistema;
          this.numProcSelEspResUtilizador = procSelUtilizador;
        }
      } catch (error) {
        return error;
      }
    },
    // Processos pre selecionados especificos resultantes das travessias da tabela de processos comuns
    procPreSelEspecificos: function() {
      if (!this.listaProcEspReady) {
        for (var i = 0; i < this.listaProcEsp.length; i++) {
          if (
            this.procPreSelResTravComum.includes(this.listaProcEsp[i].classe)
          ) {
            this.numProcPreSelEsp += 1;
          }
        }
      }
      this.listaProcEspReady = true;
    },
    // Contador dos processos selecionados especificos
    contadorProcSelEsp: function(procSelec) {
      this.numProcSelEsp = procSelec.length;
      this.tabelaSelecao.procEspecificos = procSelec;
    },
    // Contador dos processos pre selecionados especificos
    contadorProcPreSelEsp: function(lista) {
      this.numProcPreSelEsp = lista.length;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs especificos
    procPreSelResTravEsp: function(procPreSelResTravEsp) {
      this.procPreSelResTravEspecifico = procPreSelResTravEsp;
    },
    // Contador dos processos selecionados pelo sistema
    contadorProcSelEspSistema: function(procSelec) {
      this.numProcSelEspSistema = procSelec.length;
    },
    // Contador dos processos selecionados pelo utilizador
    contadorProcSelEspUtilizador: function(procSelec) {
      this.numProcSelEspUtilizador =
        procSelec.length - this.numProcSelEspSistema;
    },
    // Processos pre selecionados restantes especificos resultantes das travessias da tabela de processos comuns e especificos
    procPreSelRestantes: function() {
      if (!this.listaProcEspResReady) {
        for (var i = 0; i < this.listaProcEspRes.length; i++) {
          if (
            this.procPreSelResTravComum.includes(
              this.listaProcEspRes[i].classe
            ) ||
            this.procPreSelResTravEspecifico.includes(
              this.listaProcEspRes[i].classe
            )
          ) {
            this.procPreSelEspRestantes.push(this.listaProcEspRes[i].classe);
            this.numProcPreSelRes += 1;
          }
        }
      }
      this.listaProcEspResReady = true;
    },
    // Contador dos processos selecionados restantes
    contadorProcSelRes: function(procSelec) {
      this.numProcSelRes = procSelec.length;
      this.tabelaSelecao.procEspRestantes = procSelec;
    },
    // Lista dos processos pre selecionados especificos restantes, resultantes das travessias dos PNs especificos
    procPreSelResTravRes: function(procPreSelResTravRes) {
      this.procPreSelResTravRestante = procPreSelResTravRes;
    },
    // Contador dos processos pre selecionados restantes
    contadorProcPreSelRes: function(lista) {
      this.numProcPreSelRes = lista.length;
    },
    // Contador dos processos selecionados pelo sistema
    contadorProcSelEspResSistema: function(procSelec) {
      this.numProcSelEspResSistema = procSelec.length;
    },
    contadorProcSelEspResUtilizador: function(procSelec) {
      this.numProcSelEspResUtilizador =
        procSelec.length - this.numProcSelEspResSistema;
    },
    // Carrega os ultimos processos (processos que não foram selecionados nas 3 etapas anteriores)
    loadUltimosProcessos: async function() {
      try {
        // Vai a lista dos processos comuns e, caso estes ainda não se encontrem selecionados, coloca na lista dos ultimos processos
        for (var i = 0; i < this.listaProcComuns.length; i++) {
          var procSelecionado = false;
          for (var j = 0; j < this.tabelaSelecao.procComuns.length; j++) {
            if (
              this.listaProcComuns[i].classe ===
              this.tabelaSelecao.procComuns[j].classe
            ) {
              procSelecionado = true;
              break;
            }
          }
          if (procSelecionado == false) {
            var jaExiste = false;
            for (var a = 0; a < this.listaProcUlt.length; a++) {
              if (
                this.listaProcUlt[a].classe === this.listaProcComuns[i].classe
              ) {
                jaExiste = true;
                break;
              }
            }
            if (jaExiste == false) {
              if (this.tabelaSelecao.procUltimos.length) {
                for (
                  var c = 0;
                  c < this.tabelaSelecao.procUltimos.length;
                  c++
                ) {
                  var estavaGuardado = false;
                  if (
                    this.tabelaSelecao.procUltimos[c].classe ==
                    this.listaProcComuns[i].classe
                  ) {
                    this.listaProcUlt.push({
                      classe: this.tabelaSelecao.procUltimos[c].classe,
                      designacao: this.tabelaSelecao.procUltimos[c].designacao,
                      dono: this.tabelaSelecao.procUltimos[c].dono,
                      participante: this.tabelaSelecao.procUltimos[c]
                        .participante
                    });
                    estavaGuardado = true;
                    break;
                  }
                }
                if (!estavaGuardado) {
                  this.listaProcUlt.push(this.listaProcComuns[i]);
                }
              } else {
                this.listaProcUlt.push(this.listaProcComuns[i]);
              }
            }
          }
        }
        // Lista com todos os processos especificos já selecionados (especificos e especificos restantes)
        var procSelecionados = this.tabelaSelecao.procEspecificos.concat(
          this.tabelaSelecao.procEspRestantes
        );
        // Caso esse processo ainda não se encontre selecionado, irá para a lista listaProcUlt
        for (var f = 0; f < this.listaTotalProcEsp.length; f++) {
          procSelecionado = false;
          for (var m = 0; m < procSelecionados.length; m++) {
            if (
              this.listaTotalProcEsp[f].codigo === procSelecionados[m].classe
            ) {
              procSelecionado = true;
              break;
            }
          }
          if (procSelecionado == false) {
            jaExiste = false;
            for (var l = 0; l < this.listaProcUlt.length; l++) {
              if (
                this.listaProcUlt[l].classe === this.listaTotalProcEsp[f].codigo
              ) {
                jaExiste = true;
                break;
              }
            }
            if (jaExiste == false) {
              if (this.tabelaSelecao.procUltimos.length) {
                for (
                  var u = 0;
                  u < this.tabelaSelecao.procUltimos.length;
                  u++
                ) {
                  estavaGuardado = false;
                  if (
                    this.tabelaSelecao.procUltimos[u].classe ==
                    this.listaTotalProcEsp[f].codigo
                  ) {
                    this.listaProcUlt.push({
                      classe: this.tabelaSelecao.procUltimos[u].classe,
                      designacao: this.tabelaSelecao.procUltimos[u].designacao,
                      dono: this.tabelaSelecao.procUltimos[u].dono,
                      participante: this.tabelaSelecao.procUltimos[u]
                        .participante
                    });
                    estavaGuardado = true;
                    break;
                  }
                }
                if (!estavaGuardado) {
                  this.listaProcUlt.push({
                    classe: this.listaTotalProcEsp[f].codigo,
                    designacao: this.listaTotalProcEsp[f].titulo,
                    dono: false,
                    participante: false
                  });
                }
              } else {
                this.listaProcUlt.push({
                  classe: this.listaTotalProcEsp[f].codigo,
                  designacao: this.listaTotalProcEsp[f].titulo,
                  dono: false,
                  participante: false
                });
              }
            }
          }
        }
        this.listaProcUlt.sort((a, b) => (a.classe > b.classe ? 1 : -1));
        if (this.listaProcUlt.length) {
          this.listaProcUltReady = true;
        }
      } catch (err) {
        return err;
      }
    },
    // Processos pre selecionados para o ultimo componente resultantes das travessias da tabela de processos comuns, especificos e restantes especificos
    procPreSelUlt: function() {
      if (!this.listaProcUltReady) {
        for (var i = 0; i < this.listaProcUlt.length; i++) {
          if (
            this.procPreSelResTravComum.includes(this.listaProcUlt[i].classe) ||
            this.procPreSelResTravEspecifico.includes(
              this.listaProcUlt[i].classe
            ) ||
            this.procPreSelResTravRestante.includes(this.listaProcUlt[i].classe)
          ) {
            this.procPreSelUltimos.push(this.listaProcUlt[i].classe);
            this.numProcPreSelUlt += 1;
          }
        }
      }
    },
    // Contador dos processos selecionados ultimos
    contadorProcSelUlt: function(procSelec) {
      this.numProcSelUlt = procSelec.length;
      this.tabelaSelecao.procUltimos = procSelec;
    },
    // Contador dos ultimos processos pre selecionados
    contadorProcPreSelUlt: function(lista) {
      this.numProcPreSelUlt = lista.length;
    },
    parseProcessosSel: function() {
      if (!this.listaTotalProcSel.length) {
        this.listaTotalProcSel = this.listaTotalProcSel
          .concat(this.tabelaSelecao.procComuns)
          .concat(this.tabelaSelecao.procEspecificos)
          .concat(this.tabelaSelecao.procEspRestantes)
          .concat(this.tabelaSelecao.procUltimos);
        this.listaTotalProcSel.sort((a, b) => (a.classe > b.classe ? 1 : -1));
      }
      this.tabelaSelecao.listaProcSel = JSON.parse(
        this.tabelaSelecao.listaProcSel
      );
      for (var i = 0; i < this.tabelaSelecao.listaProcSel.length; i++) {
        var jaSel = false;
        for (var j = 0; j < this.listaTotalProcSel.length; j++) {
          if (
            this.tabelaSelecao.listaProcSel[i].classe ==
            this.listaTotalProcSel[j].classe
          ) {
            this.listaTotalProcSel[j] = this.tabelaSelecao.listaProcSel[i];
            jaSel = true;
            break;
          }
        }
      }
      this.listaTotalProcSelReady = true;
    },
    listaTotalSelUpdate: function(proc) {
      this.listaTotalProcSelUpdate = proc;
    },
    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      try {
        var userBD = this.$verifyTokenUser();

        var tsObj = {
          entidade: this.tabelaSelecao.idEntidade.split("_")[1],
          designacao: this.tabelaSelecao.designacao,
          tipologias: this.tipSel,
          processos: this.listaTotalProcSel.map(p => {
            return {
              codigo: p.classe,
              titulo: p.designacao,
              dono: p.dono,
              participante: p.participante ? p.participante : false
            };
          })
        };

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Organizacional",
          novoObjeto: { ts: tsObj },
          user: { email: userBD.email },
          entidade: userBD.entidade,
          token: this.$store.state.token,
          historico: []
        };

        var response = await this.$request("post", "/pedidos", pedidoParams);
        response = await this.$request("delete", "/pendentes/" + this.obj._id);
        this.$router.push("/pedidos/submissao");
      } catch (error) {
        return error;
      }
    },
    // Guarda o trabalho de criação de uma TS
    guardarTrabalho: async function() {
      try {
        var userBD = this.$verifyTokenUser();

        this.tabelaSelecao.tipologias = this.tipSel;

        if (this.listaTotalProcSelUpdate.length) {
          this.listaTotalProcSel = this.listaTotalProcSelUpdate;
        }

        this.tabelaSelecao.listaProcSel = JSON.stringify(
          this.listaTotalProcSel
        );

        this.obj.numInterv++;
        var cDate = Date.now();

</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
