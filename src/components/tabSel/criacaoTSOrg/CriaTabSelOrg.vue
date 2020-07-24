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
          <v-container grid-list-md fluid>
            <v-stepper v-model="stepNo" vertical>
              <v-progress-linear v-model="valorBarra"></v-progress-linear>
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
                    {{
                      tabelaSelecao.idEntidade.split("_")[1] +
                        ": " +
                        tabelaSelecao.designacaoEntidade
                    }}
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
                <v-btn v-if="ent != ''" color="primary" @click="guardaEntidade"
                  >Continuar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 2" step="2">
                Tipologias de entidade a que pertence
                <span v-if="stepNo > 2">
                  <v-chip
                    v-for="(t, i) in tipSel"
                    :key="i"
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ t.searchField }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-col>
                  <v-autocomplete
                    v-model="tipSel"
                    :items="tipologias"
                    item-text="searchField"
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
                <v-btn
                  text
                  @click="
                    stepNo = stepNo - 1;
                    barra(0);
                  "
                  >Voltar</v-btn
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

              <v-stepper-step :complete="stepNo > 4" step="4"
                >Processos de negócio comuns
                <small
                  >Processos passíveis de existir em qualquer entidade</small
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
                          Selecione os processos de negócio comuns
                        </v-expansion-panel-header>
                        <v-expansion-panel-content eager>
                          <ListaProcessosComuns
                            v-if="listaProcComunsReady"
                            v-bind:lista="listaProcComuns"
                            it="1"
                            @contadorProcSelCom="contadorProcSelCom($event)"
                            @contadorProcPreSelCom="
                              contadorProcPreSelCom($event)
                            "
                            @procPreSelResTravCom="procPreSelResTravCom($event)"
                            @contadorProcSelComSistema="
                              contadorProcSelComSistema($event)
                            "
                            @contadorProcSelComUtilizador="
                              contadorProcSelComUtilizador($event)
                            "
                            @contadorComDecrementarSistema="
                              contadorComDecrementarSistema($event)
                            "
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs5>
                    <v-text-field
                      readonly
                      label="Nº total de processos comuns selecionados"
                      :value="numProcSelCom"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos comuns pré selecionados"
                      :value="numProcPreSelCom"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs5>
                    <v-text-field
                      readonly
                      label="Nº de processos comuns selecionados pelo sistema"
                      :value="numProcSelComSistema"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos comuns selecionados pelo utilizador"
                      :value="numProcSelComUtilizador"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <!-- apenas pode avançar se o num de proc pré selecionados estiver a 0 -->
                <v-btn
                  color="primary"
                  @click="
                    stepNo = stepNo + 1;
                    barra(42);
                    procPreSelEspecificos();
                    loadProcEspRestantes();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = stepNo - 1;
                    barra(14);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 5" step="5"
                >Processos de negócio específicos
                <small
                  >Processos específicos da entidade e tipologia em que se
                  enquadram</small
                >
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
                        </v-expansion-panel-header>
                        <v-expansion-panel-content eager>
                          <ListaProcessosEspecificos
                            v-if="listaProcEspReady"
                            v-bind:lista="listaProcEsp"
                            it="1"
                            v-bind:listaPreSel="procPreSelResTravComum"
                            @contadorProcSelEsp="contadorProcSelEsp($event)"
                            @contadorProcPreSelEsp="
                              contadorProcPreSelEsp($event)
                            "
                            @procPreSelResTravEsp="procPreSelResTravEsp($event)"
                            @contadorProcSelEspSistema="
                              contadorProcSelEspSistema($event)
                            "
                            @contadorProcSelEspUtilizador="
                              contadorProcSelEspUtilizador($event)
                            "
                            @contadorEspDecrementarSistema="
                              contadorEspDecrementarSistema($event)
                            "
                          />
                          <div v-else>a carregar</div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs5>
                    <v-text-field
                      readonly
                      label="Nº total de processos específicos selecionados"
                      :value="numProcSelEsp"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos específicos pré selecionados"
                      :value="numProcPreSelEsp"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs5>
                    <v-text-field
                      readonly
                      label="Nº de processos específicos selecionados pelo sistema"
                      :value="numProcSelEspSistema"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos específicos selecionados pelo utilizador"
                      :value="numProcSelEspUtilizador"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = stepNo + 1;
                    barra(56);
                    procPreSelRestantes();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = stepNo - 1;
                    barra(28);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 6" step="6"
                >Processos de negócio específicos restantes
              </v-stepper-step>
              <v-stepper-content step="6">
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
                            it="1"
                            v-bind:listaPreSel="procPreSelEspRestantes"
                            @contadorProcSelRes="contadorProcSelRes($event)"
                            @procPreSelResTravRes="procPreSelResTravRes($event)"
                            @contadorProcPreSelRes="
                              contadorProcPreSelRes($event)
                            "
                            @contadorProcSelEspResSistema="
                              contadorProcSelEspResSistema($event)
                            "
                            @contadorProcSelEspResUtilizador="
                              contadorProcSelEspResUtilizador($event)
                            "
                            @contadorEspResDecrementarSistema="
                              contadorEspResDecrementarSistema($event)
                            "
                          />
                          <div v-else>a carregar</div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs5>
                    <v-text-field
                      readonly
                      label="Nº total de processos restantes selecionados"
                      :value="numProcSelRes"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos restantes pré selecionados"
                      :value="numProcPreSelRes"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs5>
                    <v-text-field
                      readonly
                      label="Nº de processos específicos restantes selecionados pelo sistema"
                      :value="numProcSelEspResSistema"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 style="padding-left:60px;">
                    <v-text-field
                      readonly
                      label="Nº de processos específicos restantes selecionados pelo utilizador"
                      :value="numProcSelEspResUtilizador"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = stepNo + 1;
                    barra(70);
                    loadUltimosProcessos();
                    procPreSelUlt();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = stepNo - 1;
                    barra(42);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 7" step="7"
                >Processos de negócio não selecionados anteriormente
                <small
                  >Revisão de processos de negócio não selecionados nas etapas
                  anteriores</small
                >
              </v-stepper-step>
              <v-stepper-content step="7">
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
                            @contadorProcSelUlt="contadorProcSelUlt($event)"
                            @contadorProcPreSelUlt="
                              contadorProcPreSelUlt($event)
                            "
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex xs4>
                    <v-text-field
                      readonly
                      label="Nº dos últimos processos selecionados"
                      :value="numProcSelUlt"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5 style="padding-left:60px;">
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
                    stepNo = stepNo + 1;
                    barra(84);
                    parseProcessosSel();
                  "
                  >Continuar</v-btn
                >
                <v-btn
                  text
                  @click="
                    stepNo = stepNo - 1;
                    barra(56);
                  "
                  >Voltar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 8" step="8"
                >Alterações na parte descritiva
                <small>
                  Adicionar, remover ou editar Notas de Aplicação (NA), Exclusão
                  (NE), Exemplos de Notas de Aplicação (ENA) e Termos de Ìndice
                  (TI) nos processos selecionados
                </small>
              </v-stepper-step>
              <v-stepper-content step="8">
                <v-layout wrap>
                  <v-flex xs10>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="expansion-panel-heading"
                        >
                          Lista de processos selecionados
                        </v-expansion-panel-header>
                        <v-expansion-panel-content eager>
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
                          @click="
                            finalizaUltPasso = false;
                            stepNo = stepNo - 1;
                          "
                        >
                          Voltar
                        </v-btn>
                        <v-btn
                          color="primary"
                          text
                          @click="
                            stepNo = stepNo + 1;
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
                    stepNo = stepNo - 1;
                    barra(72);
                  "
                  >Voltar</v-btn
                >
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
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ListaProcessosComuns from "@/components/tabSel/criacaoTSOrg/ListaProcessosComuns.vue";
import ListaProcessosEspecificos from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/criacaoTSOrg/ListaProcessosUltimos.vue";
import ListaParteDescritiva from "@/components/tabSel/parteDescritiva/ListaProcSel.vue";

export default {
  components: {
    ListaProcessosComuns,
    ListaProcessosEspecificos,
    ListaProcessosEspRestantes,
    ListaProcessosUltimos,
    ListaParteDescritiva
  },
  data() {
    return {
      // Objeto da TS
      tabelaSelecao: {
        idEntidade: "",
        designacaoEntidade: "",
        designacao: "",
        tipologias: [],
        procComuns: [],
        procEspecificos: [],
        procEspRestantes: [],
        procUltimos: [],
        listaProcSel: []
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
      listaProcComuns: [],
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcComunsReady: false,
      // Lista com todos os processos especificos da entidade e tipologias em causa
      listaProcEsp: [],
      // True quando a lista de todos os processos especificos da entidade e tipologias em causa estiver completa
      listaProcEspReady: false,
      // Numero de processos comuns selecionados
      numProcSelCom: 0,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs comuns)
      procPreSelResTravComum: [],
      // Numero de processos comuns que se encontram pré selecionados
      numProcPreSelCom: 0,
      // Numero de processos comuns selecionados pelo sistema
      numProcSelComSistema: 0,
      // Numero de processos comuns selecionados pelo utilizador
      numProcSelComUtilizador: 0,
      // Numero de processos pre selecionados especificos
      numProcPreSelEsp: 0,
      // True quando a lista dos processos especificos restantes estiver completa
      listaProcEspResReady: false,
      // Lista com Todos os processos especificos existentes
      listaTotalProcEsp: [],
      // Numero de processos especificos selecionados
      numProcSelEsp: 0,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs especificos)
      procPreSelResTravEspecifico: [],
      // Numero de processos especificos selecionados pelo sistema
      numProcSelEspSistema: 0,
      // Numero de processos especificos selecionados pelo utilizador
      numProcSelEspUtilizador: 0,
      // Lista dos processos especificos restantes (que não são especificos da entidade nem da tipologia em causa)
      listaProcEspRes: [],
      // Numero de processos restantes que se encontram pré selecionados
      numProcPreSelRes: 0,
      // Lista dos processos pré selecionados resultantes das travessias dos comuns e especificos
      procPreSelEspRestantes: [],
      // Numero de processos restantes selecionados
      numProcSelRes: 0,
      // Lista dos processos pré selecionados restantes (resultado das travessias pos PNs especificos restantes)
      procPreSelResTravRestante: [],
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
    debug: function(obj) {
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
        for (var i = 0; i < response.data.length; i++) {
          this.entidades[i] =
            response.data[i].sigla + " - " + response.data[i].designacao;
        }
        this.entidades.sort();
        this.entidadesReady = true;
      } catch (error) {
        return error;
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
            searchField: item.sigla + " - " + item.designacao
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
            searchField: item.sigla + " - " + item.designacao
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
            searchField: item.sigla + " - " + item.designacao
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

    // Carrega todos os processos comuns
    loadProcComuns: async function() {
      try {
        if (!this.listaProcComunsReady) {
          var response = await this.$request("get", "/classes?tipo=comum");
          for (var i = 0; i < response.data.length; i++) {
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
                dono: true
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
          token: this.$store.state.token,
          historico: []
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

        this.debug(this.listaTotalProcSel);
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
    this.loadProcComuns();
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}

.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}

.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
