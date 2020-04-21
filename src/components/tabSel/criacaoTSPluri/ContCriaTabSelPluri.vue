<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Nova Tabela de Seleção Pluriorganizacional</v-toolbar-title
          >
        </v-app-bar>
        <v-card-text class="panel-body">
          <v-container grid-list-md fluid>
            <v-stepper v-model="stepNo" vertical>
              <v-progress-linear v-model="valorBarra"></v-progress-linear>
              <v-stepper-step :complete="stepNo > 1" step="1">
                Entidades abrangidas pela TS
                <span v-if="stepNo > 1">
                  <v-chip
                    v-for="(e,i) in entSel" :key="i"
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ e.searchField }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="1">
                
                <v-col v-if="entidadesReady">
                  <v-autocomplete
                    v-model="entSel"
                    :items="entidades"
                    item-text="searchField"
                    placeholder="Selecione as entidades abrangidas pela TS"
                    multiple
                    chips
                    deletable-chips
                    return-object
                  >
                  </v-autocomplete>
                </v-col>
                <v-col v-else>
                  <v-alert dense type="info">
                    Ainda não foi possível carregar as entidades...
                  </v-alert>
                </v-col>

                <hr style="border-top: 0px" />
                <v-btn
                  color="primary"
                  @click="
                    stepNo = 2;
                    barra(14);
                    entSel.sort((a, b) =>
                      a.designacao > b.designacao ? 1 : -1
                    );
                    tabelaSelecao.entidades = entSel;
                    entSelReady = true;
                  "
                  >Continuar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 2" step="2">
                Designação da Tabela de Seleção
                <span v-if="stepNo > 2">
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
              <v-stepper-content step="2">
                <v-flex xs12 sm6 md10>
                  <v-text-field
                    placeholder="Designação da Nova Tabela de Seleção"
                    v-model="tabelaSelecao.designacao"
                  ></v-text-field>
                </v-flex>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = 3;
                    barra(28);
                    loadProcEspecificos();
                  "
                  >Continuar</v-btn
                >
                <!--v-btn
                  text
                  @click="
                    stepNo = 1;
                    barra(0);
                  "
                  >Voltar</v-btn
                -->
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 3" step="3"
                >Processos Comuns
                <small
                  >Processos passíveis de existir em qualquer entidade</small
                >
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-layout wrap>
                  <v-flex>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="expansion-panel-heading"
                        >
                          Selecione os processos de negócio comuns
                        </v-expansion-panel-header>
                        <v-expansion-panel-content eager>
                          <ContListaProcessosComuns
                            v-if="listaProcComunsReady && entSelReady"
                            v-bind:lista="listaProcComuns"
                            v-bind:entidades="tabelaSelecao.entidades"
                            @contadorProcSelCom="contadorProcSelCom($event)"
                            @contadorProcPreSelCom="
                              contadorProcPreSelCom($event)
                            "
                            @procPreSelResTravCom="procPreSelResTravCom($event)"
                            @guardarTSProcComuns="guardarTSProcComuns($event)"
                            v-bind:procSelGuardados="tabelaSelecao.procComuns"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs3>
                    <v-text-field
                      readonly
                      label="Nº de processos comuns selecionados"
                      :value="numProcSelCom"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos comuns pré selecionados"
                      :value="numProcPreSelCom"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <!-- apenas pode avançar se o num de proc pré selecionados estiver a 0 -->
                <v-btn
                  color="primary"
                  @click="
                    stepNo = 4;
                    barra(42);
                    procPreSelEspecificos();
                    loadProcEspRestantes();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = 2;
                    barra(14);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 4" step="4"
                >Processos Específicos
                <small
                  >Processos específicos da entidade e tipologia em que se
                  enquadra</small
                >
              </v-stepper-step>
              <v-stepper-content step="4">
                <v-layout wrap>
                  <v-flex>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="expansion-panel-heading"
                        >
                          Selecione os processos de negócio específicos
                        </v-expansion-panel-header>
                        <v-expansion-panel-content eager>
                          <ContListaProcessosEspecificos
                            v-if="listaProcEspReady"
                            v-bind:lista="listaProcEsp"
                            v-bind:listaPreSel="procPreSelResTravComum"
                            v-bind:entidades="tabelaSelecao.entidades"
                            @contadorProcSelEsp="contadorProcSelEsp($event)"
                            @contadorProcPreSelEsp="
                              contadorProcPreSelEsp($event)
                            "
                            @procPreSelResTravEsp="procPreSelResTravEsp($event)"
                            @guardarTSProcEsp="guardarTSProcEsp($event)"
                            v-bind:procSelGuardados="
                              tabelaSelecao.procEspecificos
                            "
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs3>
                    <v-text-field
                      readonly
                      label="Nº de processos específicos selecionados"
                      :value="numProcSelEsp"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos específicos pré selecionados"
                      :value="numProcPreSelEsp"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = 5;
                    barra(56);
                    procPreSelRestantes();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = 3;
                    barra(28);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 5" step="5"
                >Processos Específicos Restantes
              </v-stepper-step>
              <v-stepper-content step="5">
                <v-layout wrap>
                  <v-flex>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="expansion-panel-heading"
                        >
                          Selecione os processos de negócio específicos
                          restantes
                        </v-expansion-panel-header>
                        <v-expansion-panel-content eager>
                          <ContListaProcessosEspRestantes
                            v-if="listaProcEspResReady"
                            v-bind:lista="listaProcEspRes"
                            v-bind:listaPreSel="procPreSelEspRestantes"
                            v-bind:entidades="tabelaSelecao.entidades"
                            @contadorProcSelRes="contadorProcSelRes($event)"
                            @contadorProcPreSelRes="
                              contadorProcPreSelRes($event)
                            "
                            @procPreSelResTravRes="procPreSelResTravRes($event)"
                            @guardarTSProcRes="guardarTSProcRes($event)"
                            v-bind:procSelGuardados="
                              tabelaSelecao.procEspRestantes
                            "
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs3>
                    <v-text-field
                      readonly
                      label="Nº de processos restantes selecionados"
                      :value="numProcSelRes"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos restantes pré selecionados"
                      :value="numProcPreSelRes"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = 6;
                    barra(70);
                    loadUltimosProcessos();
                    procPreSelUlt();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = 4;
                    barra(42);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 6" step="6"
                >Outros processos
                <small
                  >Revisão de processos de negócio não selecionados nas etapas
                  anteriores</small
                >
              </v-stepper-step>
              <v-stepper-content step="6">
                <v-layout wrap>
                  <v-flex>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="expansion-panel-heading"
                        >
                          Selecione os processos de negócio restantes
                        </v-expansion-panel-header>
                        <v-expansion-panel-content eager>
                          <ContListaProcessosUltimos
                            v-if="listaProcUltReady"
                            v-bind:lista="listaProcUlt"
                            v-bind:listaPreSel="procPreSelUltimos"
                            v-bind:entidades="tabelaSelecao.entidades"
                            @contadorProcSelUlt="contadorProcSelUlt($event)"
                            @contadorProcPreSelUlt="
                              contadorProcPreSelUlt($event)
                            "
                            @guardarTSProcUlt="guardarTSProcUlt($event)"
                            v-bind:procSelGuardados="tabelaSelecao.procUltimos"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs3>
                    <v-text-field
                      readonly
                      label="Nº dos últimos processos selecionados"
                      :value="numProcSelUlt"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº dos últimos processos pré selecionados"
                      :value="numProcPreSelUlt"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = 7;
                    barra(84);
                    parseProcessosSel();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = 5;
                    barra(56);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 7" step="7"
                >Alterações na parte descritiva
                <small>
                  Adicionar, remover ou editar Notas de Aplicação (NA), Exclusão
                  (NE), Exemplos de Notas de Aplicação (ENA) e Termos de Ìndice
                  (TI) nos processos selecionados
                </small>
              </v-stepper-step>
              <v-stepper-content step="7">
                <v-layout wrap>
                  <v-flex>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="expansion-panel-heading"
                        >
                          Lista de processos selecionados
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <ListaParteDescritiva
                            v-if="listaTotalProcSelReady"
                            v-bind:lista="listaTotalProcSel"
                            @listaTotalSelUpdate="listaTotalSelUpdate($event)"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <hr style="border-top: 0px" />
                <v-btn color="primary" @click="finalizaUltPasso = true"
                  >Finalizar
                  <v-dialog
                    v-model="finalizaUltPasso"
                    persistent
                    max-width="380"
                  >
                    <v-card>
                      <v-card-title class="title"
                        >Finalizar último passo?</v-card-title
                      >
                      <v-card-text>
                        <p>
                          Chegou ao fim do preenchimento do formulário de
                          criação da TS!
                        </p>
                        <p>
                          Caso pretenda finalizar o mesmo e submeter a TS,
                          selecione "Confirmar". Caso ainda pretenda realizar
                          alguma alteração à TS, clique em "Voltar" e guarde o
                          trabalho.
                        </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red"
                          text
                          @click="finalizaUltPasso = false"
                        >
                          Voltar
                        </v-btn>
                        <v-btn
                          color="primary"
                          text
                          @click="
                            stepNo = 8;
                            barra(100);
                            finalizaUltPasso = false;
                          "
                        >
                          Confirmar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-btn>
                <v-btn
                  text
                  @click="
                    stepNo = 6;
                    barra(72);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <hr style="border-top: 0px" />

              <v-row align="center" justify="center">
                <v-btn color="primary" v-if="stepNo > 7" @click="submeterTS()"
                  >Submeter</v-btn
                >
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
                  <v-dialog v-model="eliminarTabela" persistent max-width="290">
                    <v-card>
                      <v-card-title class="headline"
                        >Eliminar Tabela</v-card-title
                      >
                      <v-card-text>
                        Pretende eliminar todo o trabalho realizado?
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
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ContListaProcessosComuns from "@/components/tabSel/criacaoTSPluri/ContListaProcessosComuns.vue";
import ContListaProcessosEspecificos from "@/components/tabSel/criacaoTSPluri/ContListaProcessosEspecificos.vue";
import ContListaProcessosEspRestantes from "@/components/tabSel/criacaoTSPluri/ContListaProcessosEspRestantes.vue";
import ContListaProcessosUltimos from "@/components/tabSel/criacaoTSPluri/ContListaProcessosUltimos.vue";
import ListaParteDescritiva from "@/components/tabSel/parteDescritiva/ListaProcSel.vue";

export default {
  props: ["obj"],
  components: {
    ContListaProcessosComuns,
    ContListaProcessosEspecificos,
    ContListaProcessosEspRestantes,
    ContListaProcessosUltimos,
    ListaParteDescritiva
  },
  data() {
    return {
      // Objeto Tabela de Seleção
      tabelaSelecao: {},
      // Numero do passo da criação de TS
      stepNo: 1,
      // Valor da barra de progresso
      valorBarra: 0,
      // Lista de todas as entidades existentes
      entidades: [],
      // Lista com as entidades selecionadas
      entSel: [],
      // Lista das entidades
      entTip: [],
      // True quando a lista de entidades estiver carregada
      entidadesReady: false,
      // Lista com todos os processos comuns
      listaProcComuns: [],
      // Passa a true quando o utilizador tiver selecionado todas as entidades no primeiro passo
      entSelReady: false,
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcComunsReady: false,
      // Numero de processos comuns selecionados
      numProcSelCom: 0,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs comuns)
      procPreSelResTravComum: [],
      // Numero de processos comuns que se encontram pré selecionados
      numProcPreSelCom: 0,
      // True quando a lista de todos os processos especificos da entidade e tipologias em causa estiver completa
      listaProcEspReady: false,
      // Lista com todos os processos especificos da entidade e tipologias em causa
      listaProcEsp: [],
      // Numero de processos pre selecionados especificos
      numProcPreSelEsp: 0,
      // Numero de processos especificos selecionados
      numProcSelEsp: 0,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs especificos)
      procPreSelResTravEspecifico: [],
      // True quando a lista dos processos especificos restantes estiver completa
      listaProcEspResReady: false,
      // Lista com Todos os processos especificos existentes
      listaTotalProcEsp: [],
      // Lista dos processos especificos restantes (que não são especificos da entidade nem da tipologia em causa)
      listaProcEspRes: [],
      // Lista dos processos pré selecionados resultantes das travessias dos comuns e especificos
      procPreSelEspRestantes: [],
      // Numero de processos restantes que se encontram pré selecionados
      numProcPreSelRes: 0,
      // Lista dos processos pré selecionados restantes (resultado das travessias pos PNs especificos restantes)
      procPreSelResTravRestante: [],
      // Numero de processos especificos restantes selecionados
      numProcSelRes: 0,
      // Lista de todos os processos que ainda não foram selecionados nas etapas anteriores
      listaProcUlt: [],
      // True quando a ultima lista estiver pronta
      listaProcUltReady: false,
      // Numero de processos pré selecionados no ultimo componente de seleção
      numProcPreSelUlt: 0,
      // Numero dos ultimos processos selecionados
      numProcSelUlt: 0,
      // Lista dos ultimos processos pre selecionados
      procPreSelUltimos: [],
      // Lista de todos os processos selecionados
      listaProcSel: {
        procSelComuns: [],
        procSelEspecificos: [],
        procSelEspRestantes: []
      },
      // Para o snackbar de pedido criado e trabalho guardado
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação finalização de TS
      finalizaUltPasso: false,
      listaTotalProcSel: [],
      listaTotalProcSelReady: false,
      listaTotalProcSelUpdate: []
    };
  },
  methods: {
    // Valor da barra de progresso
    barra: async function(valor) {
      this.valorBarra = valor;
    },
    // Faz load de todas as entidades
    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            searchField: item.sigla + " - " + item.designacao
          };
        });

        if(this.tabelaSelecao.entidades.length > 0)
          this.entSel = this.tabelaSelecao.entidades;
        else{
          var index = this.entidades.findIndex(
            e => e.id === this.tabelaSelecao.idEntidade
          );

          if(index != -1)
            this.entSel.push({
                sigla: this.entidades[index].sigla,
                designacao: this.entidades[index].designacao,
                id: this.entidades[index].id,
                searchField: this.entidades[index].sigla + " - " + this.entidades[index].designacao
            });
        }

        this.entidadesReady = true;
      } catch (err) {
        return err;
      }
    },
    
    // Carrega todos os processos comuns
    loadProcComuns: async function() {
      try {
        if (!this.listaProcComunsReady) {
          var response = await this.$request("get", "/classes?tipo=comum");
          for (var i = 0; i < response.data.length; i++) {
            for (
              var j = 0;
              j < this.tabelaSelecao.listaProcSel.procSelComuns.length;
              j++
            ) {
              var estavaGuardado = false;
              if (
                this.tabelaSelecao.listaProcSel.procSelComuns[j].classe ==
                response.data[i].codigo
              ) {
                this.listaProcComuns.push({
                  classe: response.data[i].codigo,
                  designacao: response.data[i].titulo,
                  dono: false,
                  participante: false
                });
                estavaGuardado = true;
                break;
              }
            }
            if (!estavaGuardado) {
              this.listaProcComuns.push({
                classe: response.data[i].codigo,
                designacao: response.data[i].titulo,
                dono: false,
                participante: false
              });
            }
          }
          this.listaProcComuns.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          this.listaProcComunsReady = true;
          return this.listaProcComuns;
        }
      } catch (err) {
        return err;
      }
    },
    // Contador dos processos selecionados comuns
    contadorProcSelCom: function(procSelec) {
      this.tabelaSelecao.listaProcSel.procSelComuns = procSelec;
      this.numProcSelCom = procSelec.length;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravCom: function(procPreSelResTravCom) {
      this.procPreSelResTravComum = procPreSelResTravCom;
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelCom: function(lista) {
      this.numProcPreSelCom = lista.length;
    },
    // Guarda na tabela de seleção a lista processos comuns, depois de selecionados no componente
    guardarTSProcComuns: function(procComuns) {
      if (Object.keys(procComuns) == "dono") {
        for (var i = 0; i < this.listaProcComuns.length; i++) {
          this.tabelaSelecao.procComuns[this.listaProcComuns[i].classe].dono =
            procComuns["dono"][this.listaProcComuns[i].classe];
        }
      } else {
        for (var j = 0; j < this.listaProcComuns.length; j++) {
          this.tabelaSelecao.procComuns[this.listaProcComuns[j].classe].part =
            procComuns["part"][this.listaProcComuns[j].classe];
        }
      }
    },
    // Carrega os processos específicos das entidades em causa
    loadProcEspecificos: async function() {
      try {
        if (!this.listaProcEspReady) {
          var url = "/classes?tipo=especifico&ents=";
          for (var i = 0; i < this.tabelaSelecao.entidades.length - 1; i++) {
            url += this.tabelaSelecao.entidades[i].id + ",";
          }
          url += this.tabelaSelecao.entidades[i].id;
        }
        var response = await this.$request("get", url);
        for (var j = 0; j < response.data.length; j++) {
          for (
            var k = 0;
            k < this.tabelaSelecao.listaProcSel.procSelEspecificos.length;
            k++
          ) {
            var estavaGuardado = false;
            if (
              this.tabelaSelecao.listaProcSel.procSelEspecificos[k].classe ==
              response.data[j].codigo
            ) {
              this.listaProcEsp.push({
                classe: response.data[j].codigo,
                designacao: response.data[j].titulo,
                dono: false,
                participante: false
              });
              estavaGuardado = true;
              break;
            }
          }
          if (!estavaGuardado) {
            this.listaProcEsp.push({
              classe: response.data[j].codigo,
              designacao: response.data[j].titulo,
              dono: false,
              participante: false
            });
          }
        }
        this.listaProcEsp.sort((a, b) => (a.classe > b.classe ? 1 : -1));
        if (JSON.stringify(this.tabelaSelecao.procEspecificos) == "{}") {
          // coloca os ultimos processos prontos para receber a info da seleção
          for (var l = 0; l < this.listaProcEsp.length; l++) {
            this.tabelaSelecao.procEspecificos[this.listaProcEsp[l].classe] = {
              dono: {},
              part: {}
            };
          }
        }
      } catch (error) {
        return error;
      }
    },
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
      this.tabelaSelecao.listaProcSel.procSelEspecificos = procSelec;
      this.numProcSelEsp = procSelec.length;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravEsp: function(procPreSelResTravEsp) {
      this.procPreSelResTravEspecifico = procPreSelResTravEsp;
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelEsp: function(lista) {
      this.numProcPreSelEsp = lista.length;
    },
    // Guarda na tabela de seleção a lista processos comuns, depois de selecionados no componente
    guardarTSProcEsp: function(procEsp) {
      if (Object.keys(procEsp) == "dono") {
        for (var i = 0; i < this.listaProcEsp.length; i++) {
          this.tabelaSelecao.procEspecificos[this.listaProcEsp[i].classe].dono =
            procEsp["dono"][this.listaProcEsp[i].classe];
        }
      } else {
        for (var j = 0; j < this.listaProcEsp.length; j++) {
          this.tabelaSelecao.procEspecificos[this.listaProcEsp[j].classe].part =
            procEsp["part"][this.listaProcEsp[j].classe];
        }
      }
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
              for (
                var k = 0;
                k < this.tabelaSelecao.listaProcSel.procSelEspRestantes.length;
                k++
              ) {
                var estavaGuardado = false;
                if (
                  this.tabelaSelecao.listaProcSel.procSelEspRestantes[k]
                    .classe == this.listaTotalProcEsp[i].codigo
                ) {
                  this.listaProcEspRes.push({
                    classe: this.listaTotalProcEsp[i].codigo,
                    designacao: this.listaTotalProcEsp[i].titulo,
                    dono: false,
                    participante: false
                  });
                  estavaGuardado = true;
                  break;
                }
              }
              if (!estavaGuardado) {
                this.listaProcEspRes.push({
                  classe: this.listaTotalProcEsp[i].codigo,
                  designacao: this.listaTotalProcEsp[i].titulo,
                  dono: false,
                  participante: false
                });
              }
            }
          }
          this.listaProcEspRes.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          if (JSON.stringify(this.tabelaSelecao.procEspRestantes) == "{}") {
            // coloca os ultimos processos prontos para receber a info da seleção
            for (var l = 0; l < this.listaProcEspRes.length; l++) {
              this.tabelaSelecao.procEspRestantes[
                this.listaProcEspRes[l].classe
              ] = {
                dono: {},
                part: {}
              };
            }
          }
        }
      } catch (error) {
        return error;
      }
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
    // Contador dos processos selecionados especificos
    contadorProcSelRes: function(procSelec) {
      this.tabelaSelecao.listaProcSel.procSelEspRestantes = procSelec;
      this.numProcSelRes = procSelec.length;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravRes: function(procPreSelResTravRes) {
      this.procPreSelResTravRestante = procPreSelResTravRes;
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelRes: function(lista) {
      this.numProcPreSelRes = lista.length;
    },
    // Guarda na tabela de seleção a lista processos comuns, depois de selecionados no componente
    guardarTSProcRes: function(procEsp) {
      if (Object.keys(procEsp) == "dono") {
        for (var i = 0; i < this.listaProcEspRes.length; i++) {
          this.tabelaSelecao.procEspRestantes[
            this.listaProcEspRes[i].classe
          ].dono = procEsp["dono"][this.listaProcEspRes[i].classe];
        }
      } else {
        for (var j = 0; j < this.listaProcEspRes.length; j++) {
          this.tabelaSelecao.procEspRestantes[
            this.listaProcEspRes[j].classe
          ].part = procEsp["part"][this.listaProcEspRes[j].classe];
        }
      }
    },
    // Carrega os ultimos processos (processos que não foram selecionados nas 3 etapas anteriores)
    loadUltimosProcessos: function() {
      // Vai a lista dos processos comuns e, caso estes ainda não se encontrem selecionados, coloca na lista dos ultimos processos
      var c;
      for (var i = 0; i < this.listaProcComuns.length; i++) {
        var procSelecionado = false;
        for (
          var j = 0;
          j < this.tabelaSelecao.listaProcSel.procSelComuns.length;
          j++
        ) {
          if (
            this.listaProcComuns[i].classe ===
            this.tabelaSelecao.listaProcSel.procSelComuns[j].classe
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
            if (this.tabelaSelecao.listaProcSel.procSelUltimos.length) {
              for (
                c = 0;
                c < this.tabelaSelecao.listaProcSel.procSelUltimos.length;
                c++
              ) {
                var estavaGuardado = false;
                if (
                  this.tabelaSelecao.listaProcSel.procSelUltimos[c].classe ==
                  this.listaProcComuns[i].classe
                ) {
                  this.listaProcUlt.push({
                    classe: this.listaProcComuns[i].classe,
                    designacao: this.listaProcComuns[i].designacao,
                    dono: false,
                    participante: false
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
      var procSelecionados = this.tabelaSelecao.listaProcSel.procSelEspecificos.concat(
        this.tabelaSelecao.listaProcSel.procSelEspRestantes
      );
      // Caso esse processo ainda não se encontre selecionado, irá para a lista listaProcUlt
      for (var f = 0; f < this.listaTotalProcEsp.length; f++) {
        procSelecionado = false;
        for (var m = 0; m < procSelecionados.length; m++) {
          if (this.listaTotalProcEsp[f].codigo === procSelecionados[m].classe) {
            procSelecionado = true;
            break;
          }
        }
        if (procSelecionado == false) {
          jaExiste = false;
          for (c = 0; c < this.listaProcUlt.length; c++) {
            if (
              this.listaProcUlt[c].classe === this.listaTotalProcEsp[f].codigo
            ) {
              jaExiste = true;
              break;
            }
          }
          if (jaExiste == false) {
            if (this.tabelaSelecao.listaProcSel.procSelUltimos.length) {
              for (
                var u = 0;
                u < this.tabelaSelecao.listaProcSel.procSelUltimos.length;
                u++
              ) {
                estavaGuardado = false;
                if (
                  this.tabelaSelecao.listaProcSel.procSelUltimos[u].classe ==
                  this.listaTotalProcEsp[f].codigo
                ) {
                  this.listaProcUlt.push({
                    classe: this.listaTotalProcEsp[f].codigo,
                    designacao: this.listaTotalProcEsp[f].titulo,
                    dono: false,
                    participante: false
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

      if (JSON.stringify(this.tabelaSelecao.procUltimos) == "{}") {
        // coloca os ultimos processos prontos para receber a info da seleção
        for (var l = 0; l < this.listaProcUlt.length; l++) {
          this.tabelaSelecao.procUltimos[this.listaProcUlt[l].classe] = {
            dono: {},
            part: {}
          };
        }
      }
      this.listaProcUlt.sort((a, b) => (a.classe > b.classe ? 1 : -1));
      if (this.listaProcUlt.length) {
        this.listaProcUltReady = true;
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
      this.tabelaSelecao.listaProcSel.procSelUltimos = procSelec;
      this.numProcSelUlt = procSelec.length;
    },
    // Contador dos ultimos processos pre selecionados
    contadorProcPreSelUlt: function(lista) {
      this.numProcPreSelUlt = lista.length;
    },
    // Guarda na tabela de seleção a lista dos ultimos processos, depois de selecionados no componente
    guardarTSProcUlt: function(procUlt) {
      if (Object.keys(procUlt) == "dono") {
        for (var i = 0; i < this.listaProcUlt.length; i++) {
          this.tabelaSelecao.procUltimos[this.listaProcUlt[i].classe].dono =
            procUlt["dono"][this.listaProcUlt[i].classe];
        }
      } else {
        for (var j = 0; j < this.listaProcUlt.length; j++) {
          this.tabelaSelecao.procUltimos[this.listaProcUlt[j].classe].part =
            procUlt["part"][this.listaProcUlt[j].classe];
        }
      }
    },
    parseProcessosSel: function() {
      if (!this.listaTotalProcSel.length) {
        this.listaTotalProcSel = this.listaTotalProcSel
          .concat(this.tabelaSelecao.listaProcSel.procSelComuns)
          .concat(this.tabelaSelecao.listaProcSel.procSelEspecificos)
          .concat(this.tabelaSelecao.listaProcSel.procSelEspRestantes)
          .concat(this.tabelaSelecao.listaProcSel.procSelUltimos);
        this.listaTotalProcSel.sort((a, b) => (a.classe > b.classe ? 1 : -1));
      }
      if (this.tabelaSelecao.parteDescritivaUpdate != {}) {
        this.tabelaSelecao.parteDescritivaUpdate = JSON.parse(
          this.tabelaSelecao.parteDescritivaUpdate
        );
        for (
          var i = 0;
          i < this.tabelaSelecao.parteDescritivaUpdate.length;
          i++
        ) {
          var jaSel = false;
          for (var j = 0; j < this.listaTotalProcSel.length; j++) {
            if (
              this.tabelaSelecao.parteDescritivaUpdate[i].classe ==
              this.listaTotalProcSel[j].classe
            ) {
              this.listaTotalProcSel[
                j
              ] = this.tabelaSelecao.parteDescritivaUpdate[i];
              jaSel = true;
              break;
            }
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

        var tsObj = [];

        //Criação do objeto para enviar no pedido
        for (var k in this.tabelaSelecao.listaProcSel) {
          this.tabelaSelecao.listaProcSel[k].forEach(c => {
            var p = {
              codigo: c.classe,
              entidades: []
            };

            //adicionar titulo
            var lista = null;
            switch (k) {
              case "procSelComuns":
                lista = "listaProcComuns";
                break;
              case "procSelEspecificos":
                lista = "listaProcEsp";
                break;
              case "procSelEspRestantes":
                lista = "listaProcEspRes";
                break;
              case "procSelUltimos":
                lista = "listaProcUlt";
                break;
              default:
                break;
            }

            var index;
            if (lista) {
              index = this[lista].findIndex(e => e.classe == p.codigo);
              if (index != -1) {
                p.titulo = this[lista][index].designacao;
              }
            }

            //Adicionar donos
            var kr = k.replace(/Sel/g, "");
            for (var ent in this.tabelaSelecao[kr][p.codigo].dono) {
              if (this.tabelaSelecao[kr][p.codigo].dono[ent]) {
                p.entidades.push({
                  sigla: ent.split("_")[1],
                  dono: this.tabelaSelecao[kr][p.codigo].dono[ent],
                  participante: false
                });
              }
            }

            //Adicionar participantes
            for (ent in this.tabelaSelecao[kr][p.codigo].part) {
              index = p.entidades.findIndex(e => "ent_" + e.sigla == ent);
              if (index != -1) {
                p.entidades[index].participante = this.tabelaSelecao[kr][
                  p.codigo
                ].part[ent];
              } else {
                if (this.tabelaSelecao[kr][p.codigo].part[ent]) {
                  p.entidades.push({
                    sigla: ent.split("_")[1],
                    dono: false,
                    participante: this.tabelaSelecao[kr][p.codigo].part[ent]
                  });
                }
              }
            }
            tsObj.push(p);
          });
        }

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Pluriorganizacional web",
          novoObjeto: {
            ts: {
              entidades: this.entSel,
              processos: tsObj,
              designacao: this.tabelaSelecao.designacao
            }
          },
          user: { email: userBD.email },
          entidade: userBD.entidade,
          token: this.$store.state.token
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
        if (this.stepNo < 2) {
          this.tabelaSelecao.entidades = this.entSel;
        }

        this.tabelaSelecao.procComuns = JSON.stringify(
          this.tabelaSelecao.procComuns
        );
        this.tabelaSelecao.procEspecificos = JSON.stringify(
          this.tabelaSelecao.procEspecificos
        );
        this.tabelaSelecao.procEspRestantes = JSON.stringify(
          this.tabelaSelecao.procEspRestantes
        );
        this.tabelaSelecao.procUltimos = JSON.stringify(
          this.tabelaSelecao.procUltimos
        );

        if (this.listaTotalProcSelUpdate.length) {
          this.listaTotalProcSel = this.listaTotalProcSelUpdate;
        }

        this.tabelaSelecao.parteDescritivaUpdate = JSON.stringify(
          this.listaTotalProcSel
        );

        this.obj.numInterv++;
        var cDate = Date.now();

        var pendenteParams = {
          _id: this.obj._id,
          dataAtualizacao: cDate,
          numInterv: this.obj.numInterv,
          acao: this.obj.acao,
          tipo: this.obj.tipo,
          objeto: this.tabelaSelecao,
          criadoPor: this.obj.criadoPor,
          user: {
            token: this.$store.state.token
          }
        };

        var response = await this.$request(
          "put",
          "/pendentes",
          pendenteParams
        );
        this.pendenteGuardado = true;
      } catch (err) {
        return err;
      }
    },
    // Elimina todo o trabalho feito até o momento
    eliminarTS: async function() {
      this.id = window.location.pathname.split("/")[3];
      this.$request("delete", "/pendentes/" + this.id);
      this.$router.push("/");
    }
  },
  created: async function() {
    this.tabelaSelecao = this.obj.objeto;
    this.tabelaSelecao.procComuns = JSON.parse(this.tabelaSelecao.procComuns);
    if (this.tabelaSelecao.procEspecificos != {}) {
      this.tabelaSelecao.procEspecificos = JSON.parse(
        this.tabelaSelecao.procEspecificos
      );
    }
    if (this.tabelaSelecao.procEspRestantes != {}) {
      this.tabelaSelecao.procEspRestantes = JSON.parse(
        this.tabelaSelecao.procEspRestantes
      );
    }
    if (this.tabelaSelecao.procUltimos != {}) {
      this.tabelaSelecao.procUltimos = JSON.parse(
        this.tabelaSelecao.procUltimos
      );
    }
    this.loadEntidades();
    this.loadProcComuns();
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}
</style>
