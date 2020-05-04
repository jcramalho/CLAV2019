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
                    {{ e.label }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-col v-if="entidadesReady">
                  <v-autocomplete
                    v-model="entSel"
                    :items="entidades"
                    item-text="label"
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
                    entidadesSelecionadas();
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
                  >Continuar</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 3" step="3"
                >Processos Comuns
                <small>Processos passíveis de existir em qualquer entidade</small>
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
                          <ListaProcessosComunsJcr
                            v-if="listaProcComunsReady && entSelReady"
                            :listaProcs="listaProcComuns"
                            :entidades="tabelaSelecao.entidades"
                            @procPreSelResTravCom="procPreSelResTravCom($event)"
                            @guardarTSProcComuns="guardarTSProcComuns($event)"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex>
                    <span>
                        <v-chip class="ma-2" color="primary">
                            Nº de processos comuns selecionados:
                            {{ listaProcComuns.numProcSelCom }}
                        </v-chip>
                    </span>
                    <span>
                        <v-chip class="ma-2" color="primary">
                            Nº de processos comuns selecionados:
                            {{ listaProcComuns.numProcPreSelCom }}
                        </v-chip>
                    </span>
                    
                  </v-flex>
                </v-layout>
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
                          <ListaProcessosEspecificos
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
                          <ListaProcessosEspRestantes
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
                          <ListaProcessosUltimos
                            v-if="listaProcUltReady"
                            v-bind:lista="listaProcUlt"
                            v-bind:listaPreSel="procPreSelUltimos"
                            v-bind:entidades="tabelaSelecao.entidades"
                            @contadorProcSelUlt="contadorProcSelUlt($event)"
                            @contadorProcPreSelUlt="
                              contadorProcPreSelUlt($event)
                            "
                            @guardarTSProcUlt="guardarTSProcUlt($event)"
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
                            it="1"
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
                  <v-dialog v-model="eliminarTabela" persistent max-width="320">
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
import ListaProcessosComuns from "@/components/tabSel/criacaoTSPluri/ListaProcessosComuns.vue";
import ListaProcessosComunsJcr from "@/components/tabSel/criacaoTSPluri/ListaProcessosComuns-jcr.vue";
import ListaProcessosEspecificos from "@/components/tabSel/criacaoTSPluri/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/criacaoTSPluri/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/criacaoTSPluri/ListaProcessosUltimos.vue";
import ListaParteDescritiva from "@/components/tabSel/parteDescritiva/ListaProcSel.vue";

export default {
  components: {
    ListaProcessosComunsJcr,
    ListaProcessosEspecificos,
    ListaProcessosEspRestantes,
    ListaProcessosUltimos,
    ListaParteDescritiva
  },
  data() {
    return {
      // Objeto Tabela de Seleção
      tabelaSelecao: {
        designacao: "",
        idEntidade: "",
        entidades: [],
        procComuns: {},
        procEspecificos: {},
        procEspRestantes: {},
        procUltimos: {},
        // Lista de todos os processos selecionados
        listaProcSel: {
          procSelComuns: [],
          procSelEspecificos: [],
          procSelEspRestantes: [],
          procSelUltimos: []
        },
        parteDescritivaUpdate: {}
      },
      // Numero do passo da criação de TS
      stepNo: 1,
      // Valor da barra de progresso
      valorBarra: 0,
      // Lista de todas as entidades existentes
      entidades: [],
      // Lista com as entidades selecionadas
      entSel: [],
      // True quando a lista de entidades estiver carregada
      entidadesReady: false,
      // Lista com todos os processos comuns
      listaProcComuns: {},
      // Passa a true quando o utilizador tiver selecionado todas as entidades no primeiro passo
      entSelReady: false,
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcComunsReady: false,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs comuns)
      procPreSelResTravComum: [],
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
    // Valor da barra de progresso
    barra: async function(valor) {
      this.valorBarra = valor;
    },
    // Função que retira o nome da entidade e o id da Entidade associada ao utilizador do token
    infoUserEnt: async function() {
      var resUser = this.$verifyTokenUser();
      this.tabelaSelecao.idEntidade = resUser.entidade;
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
            label: item.sigla + " - " + item.designacao
          };
        });

        // Carrega a entidade do utilizador nas entidades selecionadas
        var index = this.entidades.findIndex(
          e => e.id === this.tabelaSelecao.idEntidade
        );

        if(index != -1)
          this.entSel.push({
              sigla: this.entidades[index].sigla,
              designacao: this.entidades[index].designacao,
              id: this.entidades[index].id,
              label: this.entidades[index].sigla + " - " + this.entidades[index].designacao
            });

        this.entidadesReady = true;
      }
        catch (err) {
          return err;
      }
    },
    
    // Carrega todos os processos comuns
    loadProcComuns: async function() {
      try {
        if (!this.listaProcComunsReady) {
          this.listaProcComuns.numProcSelCom = 0;
          this.listaProcComuns.numProcPreSelCom = 0;
          this.listaProcComuns.procs = [];
          var response = await this.$request("get", "/classes?tipo=comum");
          for (let i = 0; i < response.data.length; i++) {
            this.listaProcComuns.procs.push({
              proc: response.data[i].codigo,
              designacao: response.data[i].titulo,
              chave: i,
              edited: false
            });
            this.listaProcComuns.procs[i].entidades = [];
          } 
          this.listaProcComuns.procs.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          this.listaProcComunsReady = true;
          return this.listaProcComuns;
        }
      } catch (err) {
        return err;
      }
    },
    // Quando se termina a seleção das entidades
    entidadesSelecionadas: function(){
        this.entSel.sort((a, b) => a.designacao > b.designacao ? 1 : -1 );
        this.tabelaSelecao.entidades = this.entSel;
        for(let i=0; i < this.listaProcComuns.procs.length; i++){
            for(let j=0; j < this.tabelaSelecao.entidades.length; j++){
                this.listaProcComuns.procs[i].entidades.push({
                    sigla: this.tabelaSelecao.entidades[j].sigla,
                    designacao: this.tabelaSelecao.entidades[j].designacao,
                    id: this.tabelaSelecao.entidades[j].id,
                    label: this.tabelaSelecao.entidades[j].label,
                    dono: false,
                    participante: "NP"
                });
            }
        }
        this.entSelReady = true;
    },

    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravCom: function(procPreSelResTravCom) {
      
    },
    // Guarda na tabela de seleção a lista processos comuns, depois de selecionados no componente
    guardarTSProcComuns: function(procComuns) {
      
    },
    // Carrega os processos específicos das entidades em causa
    loadProcEspecificos: async function() {
      try {
        if (!this.listaProcEspReady) {
          this.listaProcEsp.numProcSelCom = 0;
          this.listaProcEsp.numProcPreSelCom = 0;
          this.listaProcEsp.procs = [];

          var url = "/classes?tipo=especifico&ents=";
          for (var i = 0; i < this.tabelaSelecao.entidades.length - 1; i++) {
            url += this.tabelaSelecao.entidades[i].id + ",";
          }
          url += this.tabelaSelecao.entidades[i].id;
        }
      
        var response = await this.$request("get", url);

        for (var j = 0; j < response.data.length; j++) {
          this.listaProcEsp.push({
            proc: response.data[i].codigo,
            designacao: response.data[i].titulo,
            chave: i,
            edited: false
          });
        }

        this.listaProcEsp.sort((a, b) => (a.classe > b.classe ? 1 : -1));
        this.listaProcEspReady = true;
      } catch (error) {
        return error;
      }
    },
    procPreSelEspecificos: function() {
      
    },
    // Contador dos processos selecionados especificos
    contadorProcSelEsp: function(procSelec) {
      
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravEsp: function(procPreSelResTravEsp) {
      
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelEsp: function(lista) {
      
    },
    // Guarda na tabela de seleção a lista processos comuns, depois de selecionados no componente
    guardarTSProcEsp: function(procEsp) {
      
    },
    // Carrega todos os processos especificos restantes
    loadProcEspRestantes: async function() {
      
    },
    // Processos pre selecionados restantes especificos resultantes das travessias da tabela de processos comuns e especificos
    procPreSelRestantes: function() {
      
    },
    // Contador dos processos selecionados especificos
    contadorProcSelRes: function(procSelec) {
      
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravRes: function(procPreSelResTravRes) {
      
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelRes: function(lista) {
      
    },
    // Guarda na tabela de seleção a lista processos comuns, depois de selecionados no componente
    guardarTSProcRes: function(procEsp) {
      
    },
    // Carrega os ultimos processos (processos que não foram selecionados nas 3 etapas anteriores)
    loadUltimosProcessos: function() {
      
    },
    // Processos pre selecionados para o ultimo componente resultantes das travessias da tabela de processos comuns, especificos e restantes especificos
    procPreSelUlt: function() {
     
    },
    
    parseProcessosSel: function() {
      
    },
    listaTotalSelUpdate: function(proc) {
  
    },
    // Guarda na tabela de seleção a lista dos ultimos processos, depois de selecionados no componente
    guardarTSProcUlt: function(procUlt) {
      
    },
    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      
    },
    
    // Elimina todo o trabalho feito até esse momento
    eliminarTS: async function() {
      this.$router.push("/");
    }
  },

  created: async function() {
      try{
            await this.infoUserEnt();
            await this.loadEntidades();
            await this.loadProcComuns();
      }
      catch(e){
          console.log('Erro ao carregar a informação: ' + e);
      }
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}

.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
