<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Nova Tabela de Seleção</v-toolbar-title
          >
        </v-app-bar>
        <v-card-text class="panel-body">
            <v-stepper v-model="stepNo" vertical>
              <v-stepper-step :complete="stepNo > 1" step="1">
                Identificação da entidade da tabela de seleção:
                <span v-if="stepNo > 1">
                  <v-chip
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ tabelaSelecao.idEntidade.split("_")[1] + ": " + tabelaSelecao.designacaoEntidade }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-col>
                  <v-autocomplete
                    :items="entidades"
                    label="Selecione a entidade"
                    v-model="ent"
                    prepend-icon="account_balance"
                  >
                  </v-autocomplete>
                </v-col>
                <v-btn
                  v-if="ent != ''"
                  color="primary"
                  @click="guardaEntidade"
                  >Continuar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 2" step="2">
                Tipologias de entidade a que pertence
                <span v-if="stepNo > 2">
                  <v-chip
                    v-for="(t,i) in tipSel" :key="i"
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ t.label }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-col>
                  <v-autocomplete
                    v-model="tipSel"
                    :items="tipologias"
                    item-text="label"
                    placeholder="Selecione as tipologias de entidade a que pertence"
                    multiple
                    chips
                    deletable-chips
                    return-object
                  >
                  </v-autocomplete>
                </v-col>
                <hr style="border-top: 0px" />
                <v-btn
                  color="primary"
                  @click="
                    stepNo = stepNo + 1;
                    barra(14);
                  "
                  >Continuar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 3" step="3">
                Designação da Tabela de Seleção
                <span v-if="stepNo > 3">
                  <v-chip
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    {{ tabelaSelecao.designacao }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-flex xs12 sm6 md10>
                  <v-text-field
                    :placeholder="tabelaSelecao.designacao"
                    v-model="tabelaSelecao.designacao"
                  ></v-text-field>
                </v-flex>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = stepNo + 1;
                    barra(28);
                    loadProcEspecificos();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = stepNo - 1;
                    barra(0);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 4" step="4">
                Seleção dos Processos
              </v-stepper-step>
              <v-stepper-content step="4">
                <v-col v-if="listaProcessosReady">
                  <v-card>
                    <v-card-text>
                      <ListaProcessos
                            :listaProcs="listaProcessos"
                            :listaCodigosEsp="listaCodigosEsp"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col v-else>Ainda não foi possível carregar a informação dos Processos...</v-col>

                <v-btn
                  color="primary"
                  @click="
                    stepNo = stepNo + 1;
                    barra(42);
                    procPreSelEspecificos();
                    loadProcEspRestantes();
                  "
                  >Continuar</v-btn>
                <v-btn
                  text
                  @click="
                    stepNo = stepNo - 1;
                    barra(14);
                  ">Voltar</v-btn>
              </v-stepper-content>

              

              <hr style="border-top: 0px" />

              <v-row align="center" justify="center">
                <v-btn color="primary" v-if="stepNo > 8" @click="submeterTS()"
                  >Submeter
                </v-btn>
                <v-btn
                  color="primary"
                  v-else-if="stepNo >= 1"
                  @click="guardarTrabalho()"
                  >Guardar trabalho
                  <v-dialog v-model="pendenteGuardado" width="60%">
                    <v-card>
                      <v-card-title>Trabalho pendente guardado</v-card-title>
                      <v-card-text>
                        <p>
                          Os seus dados foram guardados para que possa retomar o
                          trabalho mais tarde.
                        </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" dark @click="$router.push('/')"
                          >Fechar</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-btn>

                <v-btn
                  dark
                  text
                  color="red darken-4"
                  @click="eliminarTabela = true"
                  >Cancelar criação
                  <v-dialog v-model="eliminarTabela" persistent max-width="320">
                    <v-card>
                      <v-card-title class="title">Eliminar Tabela</v-card-title>
                      <v-card-text>
                        <p>Pretende eliminar todo o trabalho realizado?</p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click="eliminarTabela = false">
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="primary"
                          text
                          @click="
                            eliminarTS();
                            eliminarTabela = false;
                          "
                        >
                          Confirmar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-btn>
              </v-row>
            </v-stepper>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ListaProcessos from "@/components/tabSel/criacaoTSOrg/ListaProcessos.vue";

export default {
  components: {
    ListaProcessos
  },
  data() {
    return {
      // Objeto da TS
      tabelaSelecao: {
        idEntidade: "",
        designacaoEntidade: "",
        designacao: "",
        tipologias: [],
        listaProcessos: []
      },
      // Numero do passo da criação de TS
      stepNo: null,
      // Valor da barra de progresso
      valorBarra: 0,
      // Se a entidade do utilizador for a DGLAB, o primeiro passo deve ser a seleção
      // da entidade que se quer fazer a TS. Pois a DGLAB irá fazer TS para outras entidades.
      entidadeDGLAB: false,
      entidades: [],
      entidadesReady: false,
      ent: "",
      // Lista de todas as tipologias existentes
      tipologias: [],
      // True quando a lista de tipologias estiver carregada
      tipologiasReady: false,
      // Lista com as tipologias selecionadas
      tipSel: [],
      // Lista com todos os processos comuns
      listaProcessos: [],
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcessosReady: false,
      // Lista com os códigos dos processos específicos da entidade selecionada
      listaCodigosEsp: [],
      
      // Para o snackbar de pedido criado e trabalho guardado
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação finalização de TS
      finalizaUltPasso: false,
    };
  },
  methods: {
    debug: function(obj){
      alert(JSON.stringify(obj));
    },
    // Função que procura o nome da entidade e o id da Entidade associada ao utilizador
    infoUserEnt: async function() {
      var resUser = this.$verifyTokenUser();

      if (resUser.entidade === "ent_DGLAB") {
        this.stepNo = 1;
        this.entidadeDGLAB = true;
        this.loadEntidades();
      } else {
        var resEnt = await this.$request(
          "get",
          "/entidades/" + resUser.entidade
        );

        this.tabelaSelecao.designacao = resEnt.data.designacao;
        this.tabelaSelecao.idEntidade = resUser.entidade;
        this.tabelaSelecao.designacaoEntidade = resEnt.data.designacao;
        this.stepNo = 2;
        await this.loadTipologias();
      }
    },
    // Vai à API buscar todas as entidades
    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        this.entidadesReady = true;
      }
        catch (err) {
          console.log("Erro ao recuperar a lista de entidades: " + err);
      }
    },
    guardaEntidade: async function() {
      try {
        this.tabelaSelecao.designacao = this.ent.split(" - ")[1];
        this.tabelaSelecao.designacaoEntidade = this.ent.split(" - ")[1];
        this.tabelaSelecao.idEntidade = "ent_" + this.ent.split(" - ")[0];
        await this.loadTipologias();
        this.stepNo = this.stepNo + 1;
        this.barra(0);
      } catch (err) {
        return err;
      }
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
            label: item.sigla + " - " + item.designacao
          };
        });
        this.tipologiasReady = true;

        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        }); 
      } catch (error) {
        return error;
      }
    },

    // Carrega apenas as tipologias da entidade selecionada
    loadTipologiasDaEntidade: async function() {
      try {
        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        // Retira da lista de todas as tipologias as que já pertencem à entidade selecionada
        for (var i = 0; i < this.tipSel.length; i++) {
          var index = this.tipologias.findIndex(
            e => e.id === this.tipSel[i].id
          );
          this.tipologias.splice(index, 1);
        }
      } catch (error) {
        return error;
      }
    },

    // Carregamento dos processos
    loadProcessos: async function(){
      try {
        if (!this.listaProcessosReady) {
          this.listaProcessos.numProcessosSelecionados = 0;
          this.listaProcessos.numProcessosPreSelecionados = 0;
          this.listaProcessos.procs = [];
          var response = await this.$request("get", "/classes?nivel=3&info=completa");
          for (let i = 0; i < response.data.length; i++) {

            this.listaProcessos.procs.push(response.data[i]);
            this.listaProcessos.procs[i].chave = i;
            this.listaProcessos.procs[i].edited = false;
            this.listaProcessos.procs[i].descriptionEdited = false;
            this.listaProcessos.procs[i].preSelected = 0;
            // Para poder ser filtrado na tabela
            this.listaProcessos.procs[i].preSelectedLabel = "";
            this.listaProcessos.procs[i].entidades = [];
          } 
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },

    loadProcessosEspecificos: async function(entidade){
      try{
        var url = "/classes?tipo=especifico&ents=" + entidade.id;
        var response = await this.$request("get", url);
        
        for (let j = 0; j < response.data.length; j++) {
          this.listaCodigosEsp.push(response.data[j].codigo);
        }
        // Marcamos os processos que não são específicos desta entidade como restantes
        var index;
        for(let j = 0; j < this.listaProcessos.procs.length; j++){
          if(this.listaProcessos.procs[j].tipoProc != "Processo Comum"){
            index = this.listaCodigosEsp.indexOf(this.listaProcessos.procs[j].codigo);
            if(index == -1) this.listaProcessos.procs[j].tipoProc = "Processo Restante";
          }
        }
      }
      catch(e){
        console.log("Erro ao calcular os processos específicos das entidades: " + e);
      }
    },

    // Retira da lista de tipologias selecionadas
    unselectTipologia: function(tipologia) {
      this.tipologias.push(tipologia);
      var index = this.tipSel.findIndex(e => e.id === tipologia.id);
      this.tipSel.splice(index, 1);
    },
    // Coloca na lista de tipologias selecionadas
    selectTipologia: function(tipologia) {
      this.tipSel.push(tipologia);
      var index = this.tipologias.findIndex(e => e.id === tipologia.id);
      this.tipologias.splice(index, 1);
    },
    // Valor da barra de progresso
    barra: async function(valor) {
      this.valorBarra = valor;
    },
    // Carrega os processos específicos da entidade e das tipologias em causa
    loadProcEspecificos: async function() {
      try {
        if (!this.listaProcEspReady) {
          var url =
            "/classes?tipo=especifico&ents=" + this.tabelaSelecao.idEntidade;
          if (this.tipSel.length || this.tipSel.length) {
            url += "&tips=";
          }
          if (this.tipSel.length) {
            for (var i = 0; i < this.tipSel.length - 1; i++) {
              url += this.tipSel[i].id + ",";
            }
            url += this.tipSel[i].id;
          }
          var response = await this.$request("get", url);
          for (var x = 0; x < response.data.length; x++) {
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
                dono: true
              });
            }
          }
          this.listaProcEsp.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          return this.listaProcEsp;
        }
      } catch (error) {
        return error;
      }
    },
    // Contador dos processos selecionados comuns
    contadorProcSelCom: function(procSelec) {
      this.numProcSelCom = procSelec.length;
      this.tabelaSelecao.procComuns = procSelec;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravCom: function(procPreSelResTravCom) {
      this.procPreSelResTravComum = procPreSelResTravCom;
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelCom: function(lista) {
      this.numProcPreSelCom = lista.length;
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
    // Carrega todos os processos especificos restantes
    loadProcEspRestantes: async function() {
      try {
        if (!this.listaProcEspResReady) {
          var response = await this.$request("get", "/classes?tipo=especifico");
          this.listaTotalProcEsp = response.data;
          for (var i = 0; i < this.listaTotalProcEsp.length; i++) {
            var espEntTip = false;
            for (var j = 0; j < this.listaProcEsp.length; j++) {
              if (
                this.listaTotalProcEsp[i].codigo === this.listaProcEsp[j].classe
              ) {
                espEntTip = true;
                break;
              }
            }
            if (espEntTip === false) {
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
                  dono: true
                });
              }
            }
          }
          this.listaProcEspRes.sort((a, b) => (a.classe > b.classe ? 1 : -1));
        }
      } catch (error) {
        return error;
      }
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
    loadUltimosProcessos: function() {
      if (!this.listaProcUltReady) {
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
              this.listaProcUlt.push(this.listaProcComuns[i]);
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
            for (var c = 0; c < this.listaProcUlt.length; c++) {
              if (
                this.listaProcUlt[c].classe === this.listaTotalProcEsp[f].codigo
              ) {
                jaExiste = true;
                break;
              }
            }
            if (jaExiste == false) {
              this.listaProcUlt.push({
                classe: this.listaTotalProcEsp[f].codigo,
                designacao: this.listaTotalProcEsp[f].titulo,
                dono: false,
                participante: false
              });
            }
          }
        }
        this.listaProcUlt.sort((a, b) => (a.classe > b.classe ? 1 : -1));
        if (this.listaProcUlt.length) {
          this.listaProcUltReady = true;
        }
      }
    },
    // Processos pre selecionados para o ultimo componente resultantes das travessias da tabela de processos comuns, especificos e restantes especificos
    procPreSelUlt: function() {
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
        this.listaTotalProcSelReady = true;
      }
    },
    listaTotalSelUpdate: function(proc) {
      this.listaTotalProcSelUpdate = proc;
    },
    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      try {
        var userBD = this.$verifyTokenUser();

        var tsObj = {
          entidade: this.tabelaSelecao.idEntidade,
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
          token: this.$store.state.token
        };

        var response = await this.$request("post", "/pedidos", pedidoParams);
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

        this.debug(this.listaTotalProcSel)
        this.tabelaSelecao.listaProcSel = JSON.stringify(
          this.listaTotalProcSel
        );

        var pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "TS Organizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          token: this.$store.state.token
        };

        var response = await this.$request(
          "post",
          "/pendentes",
          pendenteParams
        );
        this.pendenteGuardado = true;
      } catch (err) {
        return err;
      }
    },
    // Elimina todo o trabalho feito até esse momento
    eliminarTS: async function() {
      this.$router.push("/");
    }
  },
  created: async function() {
    await this.infoUserEnt();
    await this.loadProcessos();
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}

.info-label {
  color: #1a237e !important;
  padding: 5px;
  font-weight: 400;
  width: auto;
  height: auto;
  background-color: #e8eaf6;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
