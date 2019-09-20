<template>
  <v-container grid-list-md fluid>
    <v-stepper v-model="stepNo" vertical>
      <v-progress-linear v-model="valorBarra"></v-progress-linear>
      <v-stepper-step :complete="stepNo > 1" step="1">
        Entidades abrangidas pela TS
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Selecione as Entidades abrangidas pela TS
            </v-expansion-panel-header>
            <v-expansion-panel-content class="expansion-panel-heading">
              <v-card style="padding-top:30px;">
                <v-card-text>
                  <v-row>
                    <v-col cols="2">
                      <v-subheader
                        class="info-label"
                        style="border-color: white; border-style:solid; color: #1A237E;"
                        >Entidades pré selecionadas:</v-subheader
                      >
                    </v-col>
                    <v-col>
                      <v-data-table
                        :headers="[
                          { text: 'Sigla', align: 'left', value: 'sigla' },
                          { text: 'Designação', value: 'designacao' }
                        ]"
                        :items="entTip"
                        class="elevation-1"
                        hide-default-footer
                      >
                        <template v-slot:item="props">
                          <tr>
                            <td>{{ props.item.sigla }}</td>
                            <td>{{ props.item.designacao }}</td>
                          </tr>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>

                  <DesSelEnt
                    :entidades="entSel"
                    @unselectEntidade="unselectEntidade($event)"
                  />

                  <hr style="border-top: 1px dashed #dee2f8;" />

                  <SelEnt
                    :entidadesReady="entidadesReady"
                    :entidades="entidades"
                    @selectEntidade="selectEntidade($event)"
                  />
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-btn
          color="primary"
          @click="
            stepNo = 2;
            barra(16);
            tabelaSelecao.entidades = entSel.concat(entTip);
            entSelReady = true;
          "
          >Continuar</v-btn
        >
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 2" step="2"
        >Designação
        <small>Designação da Nova Tabela de Seleção</small>
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
            barra(32);
            loadProcEspecificos();
          "
          >Continuar</v-btn
        >
        <v-btn
          text
          @click="
            stepNo = 1;
            barra(0);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 3" step="3"
        >Processos Comuns
        <small>Processos passíveis de existir em qualquer entidade</small>
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-layout wrap>
          <v-flex xs10>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Selecione os Processos de Negócio Comuns
                </v-expansion-panel-header>
                <v-expansion-panel-content class="expansion-panel-heading">
                  <ListaProcessosComuns
                    v-if="listaProcComunsReady && entSelReady"
                    v-bind:lista="listaProcComuns"
                    v-bind:entidades="tabelaSelecao.entidades"
                    @contadorProcSelCom="contadorProcSelCom($event)"
                    @contadorProcPreSelCom="contadorProcPreSelCom($event)"
                    @procPreSelResTravCom="procPreSelResTravCom($event)"
                    @guardarTSProcComuns="guardarTSProcComuns($event)"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs3>
            <v-text-field
              label="Nº de processos comuns selecionados"
              :value="numProcSelCom"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 style="padding-left:60px;">
            <v-text-field
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
            barra(48);
            procPreSelEspecificos();
            loadProcEspRestantes();
          "
          >Continuar</v-btn
        >
        <v-btn
          text
          @click="
            stepNo = 2;
            barra(16);
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
          <v-flex xs10>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Selecione os Processos de Negócio Específicos
                </v-expansion-panel-header>
                <v-expansion-panel-content class="expansion-panel-heading">
                  <ListaProcessosEspecificos
                    v-if="listaProcEspReady"
                    v-bind:lista="listaProcEsp"
                    v-bind:listaPreSel="procPreSelResTravComum"
                    v-bind:entidades="tabelaSelecao.entidades"
                    @contadorProcSelEsp="contadorProcSelEsp($event)"
                    @contadorProcPreSelEsp="contadorProcPreSelEsp($event)"
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
              label="Nº de processos específicos selecionados"
              :value="numProcSelEsp"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 style="padding-left:60px;">
            <v-text-field
              label="Nº de processos específicos pré selecionados"
              :value="numProcPreSelEsp"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="
            stepNo = 5;
            barra(64);
            procPreSelRestantes();
          "
          >Continuar</v-btn
        >
        <v-btn
          text
          @click="
            stepNo = 3;
            barra(32);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 5" step="5"
        >Processos Específicos Restantes
      </v-stepper-step>
      <v-stepper-content step="5">
        <v-layout wrap>
          <v-flex xs10>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Selecione os Processos de Negócio Específicos Restantes
                </v-expansion-panel-header>
                <v-expansion-panel-content class="expansion-panel-heading">
                  <ListaProcessosEspRestantes
                    v-if="listaProcEspResReady"
                    v-bind:lista="listaProcEspRes"
                    v-bind:listaPreSel="procPreSelEspRestantes"
                    v-bind:entidades="tabelaSelecao.entidades"
                    @contadorProcSelRes="contadorProcSelRes($event)"
                    @contadorProcPreSelRes="contadorProcPreSelRes($event)"
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
              label="Nº de processos restantes selecionados"
              :value="numProcSelRes"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 style="padding-left:60px;">
            <v-text-field
              label="Nº de processos restantes pré selecionados"
              :value="numProcPreSelRes"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="
            stepNo = 6;
            barra(80);
            loadUltimosProcessos();
            procPreSelUlt();
          "
          >Continuar</v-btn
        >
        <v-btn
          text
          @click="
            stepNo = 4;
            barra(48);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 6" step="6" v-if="listaProcUltReady"
        >Outros processos
        <small
          >Revisão de processos de negócio não selecionados nas etapas
          anteriores</small
        >
      </v-stepper-step>
      <v-stepper-content step="6">
        <v-layout wrap>
          <v-flex xs10>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1">
                  Selecione os Processos de Negócio Restantes
                </v-expansion-panel-header>
                <v-expansion-panel-content class="expansion-panel-heading">
                  <ListaProcessosUltimos
                    v-if="listaProcUltReady"
                    v-bind:lista="listaProcUlt"
                    v-bind:listaPreSel="procPreSelUltimos"
                    v-bind:entidades="tabelaSelecao.entidades"
                    @contadorProcSelUlt="contadorProcSelUlt($event)"
                    @contadorProcPreSelUlt="contadorProcPreSelUlt($event)"
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
              label="Nº dos últimos processos selecionados"
              :value="numProcSelUlt"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 style="padding-left:60px;">
            <v-text-field
              label="Nº dos últimos processos pré selecionados"
              :value="numProcPreSelUlt"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="
            stepNo = 7;
            barra(100);
          "
          >Continuar</v-btn
        >
        <v-btn
          text
          @click="
            stepNo = 5;
            barra(64);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>

      <v-btn color="primary" v-if="stepNo > 6" @click="submeterTS()"
        >Submeter</v-btn
      >
      <v-btn color="primary" v-else @click="guardarTrabalho()"
        >Guardar trabalho</v-btn
      >
      <v-btn dark text color="red darken-4" @click="eliminarTabela = true"
        >Eliminar TS
        <v-dialog v-model="eliminarTabela" persistent max-width="320">
          <v-card>
            <v-card-title class="headline">Eliminar Tabela</v-card-title>
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
    </v-stepper>

    <v-snackbar v-model="pedidoCriado" :color="'success'" :timeout="60000">
      {{ mensagemPedidoCriadoOK }}
      <v-btn dark text @click="pedidoCriadoOK">
        Fechar
      </v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="pendenteGuardado"
      color="primary"
      :timeout="60000"
      :top="true"
    >
      Trabalho guardado com sucesso.
      <v-btn dark text @click="pendenteGuardadoOK">
        Fechar
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import ListaProcessosComuns from "@/components/tabSel/criacaoTSPluri/ListaProcessosComuns.vue";
import ListaProcessosEspecificos from "@/components/tabSel/criacaoTSPluri/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/criacaoTSPluri/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/criacaoTSPluri/ListaProcessosUltimos.vue";

export default {
  components: {
    DesSelEnt,
    SelEnt,
    ListaProcessosComuns,
    ListaProcessosEspecificos,
    ListaProcessosEspRestantes,
    ListaProcessosUltimos
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
        }
      },
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
      // Para o snackbar de pedido criado e trabalho guardado
      pendenteGuardado: false,
      pedidoCriado: false,
      mensagemPedidoCriadoOK: "Pedido criado com sucesso: ",
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false
    };
  },
  methods: {
    // Valor da barra de progresso
    barra: async function(valor) {
      this.valorBarra = valor;
    },
    // Função que procura o nome da entidade e o id da Entidade associada ao utilizador
    infoUserEnt: async function() {
      var resUser = await axios.get(
        lhost + "/api/users/listarToken/" + this.$store.state.token
      );
      var resEnt = await axios.get(
        lhost + "/api/entidades/" + resUser.data.entidade
      );
      this.tabelaSelecao.idEntidade = resUser.data.entidade;
    },
    // Faz load de todas as entidades
    loadEntidades: async function() {
      try {
        var response = await axios.get(lhost + "/api/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });

        for (var i = 0; i < this.entidades.length; i++) {
          if ("ent_" + this.entidades[i].sigla === this.tabelaSelecao.idEntidade) {
            this.entTip.push({
              sigla: this.entidades[i].sigla,
              designacao: this.entidades[i].designacao,
              id: this.entidades[i].id
            });
            break;
          }
        }
        // Retira da lista das entidades a entidade a que pertence o utilizador
        var index = this.entidades.findIndex(e => e.id === this.tabelaSelecao.idEntidade);
        this.entidades.splice(index, 1);

        this.tabelaSelecao.entidades = this.entTip;

        this.entidadesReady = true;
      } catch (err) {
        return err;
      }
    },
    // Retira da lista de entidades selecionadas
    unselectEntidade: function(entidade) {
      this.entidades.push(entidade);
      var index = this.entSel.findIndex(e => e.id === entidade.id);
      this.entSel.splice(index, 1);
    },
    // Coloca na lista de entidades selecionadas
    selectEntidade: function(entidade) {
      this.entSel.push(entidade);
      var index = this.entidades.findIndex(e => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },
    // Carrega todos os processos comuns
    loadProcComuns: async function() {
      try {
        if (!this.listaProcComunsReady) {
          var response = await axios.get(lhost + "/api/classes?tipo=comum");
          for (var i = 0; i < response.data.length; i++) {
            this.listaProcComuns.push({
              classe: response.data[i].codigo,
              designacao: response.data[i].titulo,
              dono: false,
              participante: false
            });
          }
          this.listaProcComunsReady = true;

          // coloca os proc comuns prontos para receber a info da seleção
          for (var j = 0; j < this.listaProcComuns.length; j++) {
            this.tabelaSelecao.procComuns[this.listaProcComuns[j].classe] = ({
              dono: {},
              part: {}
            });
          }
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
          this.tabelaSelecao.procComuns[this.listaProcComuns[i].classe].dono = procComuns['dono'][this.listaProcComuns[i].classe]
        }
      } else {
        for (var j = 0; j < this.listaProcComuns.length; j++) {
          this.tabelaSelecao.procComuns[this.listaProcComuns[j].classe].part = procComuns['part'][this.listaProcComuns[j].classe]
        }
      }
    },
    // Carrega os processos específicos das entidades em causa
    loadProcEspecificos: async function() {
      try {
        if (!this.listaProcEspReady) {
          var url = lhost + "/api/classes?tipo=especifico&ents=";
          for (var i = 0; i < this.tabelaSelecao.entidades.length - 1; i++) {
            url += this.tabelaSelecao.entidades[i].id + ",";
          }
          url += this.tabelaSelecao.entidades[i].id;
        }
        var response = await axios.get(url);
        for (var j = 0; j < response.data.length; j++) {
          this.listaProcEsp.push({
            classe: response.data[j].codigo,
            designacao: response.data[j].titulo,
            dono: false,
            participante: false
          });
        }

        // coloca os proc especificos prontos para receber a info da seleção
        for (var l = 0; l < this.listaProcEsp.length; l++) {
          this.tabelaSelecao.procEspecificos[this.listaProcEsp[l].classe] = ({
            dono: {},
            part: {}
          })
        }

      } catch (error) {
        return error;
      }
    },
    procPreSelEspecificos: function() {
      if (!this.listaProcEspReady) {
        for (var i = 0; i < this.listaProcEsp.length; i++) {
          if (this.procPreSelResTravComum.includes(this.listaProcEsp[i].classe)) {
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
          this.tabelaSelecao.procEspecificos[this.listaProcEsp[i].classe].dono = procEsp['dono'][this.listaProcEsp[i].classe];
        }
      } else {
        for (var j = 0; j < this.listaProcEsp.length; j++) {
          this.tabelaSelecao.procEspecificos[this.listaProcEsp[j].classe].part = procEsp['part'][this.listaProcEsp[j].classe];
        }
      }
    },
    // Carrega todos os processos especificos restantes
    loadProcEspRestantes: async function() {
      try {
        if (!this.listaProcEspResReady) {
          var response = await axios.get(
            lhost + "/api/classes?tipo=especifico"
          );
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
              this.listaProcEspRes.push({
                classe: this.listaTotalProcEsp[i].codigo,
                designacao: this.listaTotalProcEsp[i].titulo,
                dono: false,
                participante: false
              });
            }
          }
          // coloca os proc especificos restantes prontos para receber a info da seleção
          for (var l = 0; l < this.listaProcEspRes.length; l++) {
            this.tabelaSelecao.procEspRestantes[this.listaProcEspRes[l].classe] = ({
              dono: {},
              part: {}
            })
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
          this.tabelaSelecao.procEspRestantes[this.listaProcEspRes[i].classe].dono = procEsp['dono'][this.listaProcEspRes[i].classe];
        }
      } else {
        for (var j = 0; j < this.listaProcEspRes.length; j++) {
          this.tabelaSelecao.procEspRestantes[this.listaProcEspRes[j].classe].part = procEsp['part'][this.listaProcEspRes[j].classe];
        }
      }
    },
    // Carrega os ultimos processos (processos que não foram selecionados nas 3 etapas anteriores)
    loadUltimosProcessos: function() {
      // Vai a lista dos processos comuns e, caso estes ainda não se encontrem selecionados, coloca na lista dos ultimos processos
      for (var i = 0; i < this.listaProcComuns.length; i++) {
        var procSelecionado = false;
        for (var j = 0; j < this.tabelaSelecao.listaProcSel.procSelComuns.length; j++) {
          if (
            this.listaProcComuns[i].classe ===
            this.tabelaSelecao.listaProcSel.procSelComuns[j]
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
      var procSelecionados = this.tabelaSelecao.listaProcSel.procSelEspecificos.concat(
        this.tabelaSelecao.listaProcSel.procSelEspRestantes
      );
      // Caso esse processo ainda não se encontre selecionado, irá para a lista listaProcUlt
      for (var f = 0; f < this.listaTotalProcEsp.length; f++) {
        procSelecionado = false;
        for (var m = 0; m < procSelecionados.length; m++) {
          if (this.listaTotalProcEsp[f].codigo === procSelecionados[m]) {
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
      // coloca os ultimos processos prontos para receber a info da seleção
      for (var l = 0; l < this.listaProcUlt.length; l++) {
        this.tabelaSelecao.procUltimos[this.listaProcUlt[l].classe] = ({
          dono: {},
          part: {}
        })
      }

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
          this.tabelaSelecao.procUltimos[this.listaProcUlt[i].classe].dono = procUlt['dono'][this.listaProcUlt[i].classe];
        }
      } else {
        for (var j = 0; j < this.listaProcUlt.length; j++) {
          this.tabelaSelecao.procUltimos[this.listaProcUlt[j].classe].part = procUlt['part'][this.listaProcUlt[j].classe];
        }
      }
    },
    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      try {
        var userBD = await axios.get(
          lhost + "/api/users/listarToken/" + this.$store.state.token
        );

        var tsObj = [];

        //Criação do objeto para enviar no pedido
        for (var k in this.tabelaSelecao.listaProcSel) {
          this.tabelaSelecao.listaProcSel[k].forEach(codigo => {
            var p = {
              codigo: codigo,
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
              index = this[lista].findIndex(e => e.classe == codigo);
              if (index != -1) {
                p.titulo = this[lista][index].designacao;
              }
            }

            //Adicionar donos
            var kr = k.replace(/Sel/g,"");
            for (var ent in this.tabelaSelecao[kr][codigo].dono) {
              if (this.tabelaSelecao[kr][codigo].dono[ent]) {
                p.entidades.push({
                  sigla: ent.split("_")[1],
                  dono: this.tabelaSelecao[kr][codigo].dono[ent],
                  participante: false
                });
              }
            }

            //Adicionar participantes
            for (ent in this.tabelaSelecao[kr][codigo].part) {
              index = p.entidades.findIndex(e => "ent_" + e.sigla == ent);
              if (index != -1) {
                p.entidades[index].participante = this.tabelaSelecao[kr][codigo].part[ent];
              } else {
                if (this.tabelaSelecao[kr][codigo].part[ent]) {
                  p.entidades.push({
                    sigla: ent.split("_")[1],
                    dono: false,
                    participante: this.tabelaSelecao[kr][codigo].part[ent]
                  });
                }
              }
            }
            tsObj.push(p);
          });
        }

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Pluriorganizacional",
          novoObjeto: { ts: tsObj },
          user: { email: userBD.data.email },
          entidade: userBD.data.entidade.split("_")[1],
          token: this.$store.state.token
        };

        console.log(JSON.stringify(this.tabelaSelecao))
        console.log(JSON.stringify(tsObj))
        var response = await axios.post(lhost + "/api/pedidos", pedidoParams);
        this.mensagemPedidoCriadoOK += response.data.codigo;
        this.pedidoCriado = true;
      } catch (error) {
        return error;
      }
    },
    pedidoCriadoOK: function() {
      this.pedidoCriado = false;
      this.$router.push("/");
    },
    // Guarda o trabalho de criação de uma TS
    guardarTrabalho: async function() {
      try {
        var userBD = await axios.get(
          lhost + "/api/users/listarToken/" + this.$store.state.token
        );

        if (this.stepNo < 2) {
          this.tabelaSelecao.entidades = this.entTip.concat(this.entSel);
        }

        this.tabelaSelecao.procComuns = JSON.stringify(this.tabelaSelecao.procComuns)
        this.tabelaSelecao.procEspecificos = JSON.stringify(this.tabelaSelecao.procEspecificos)
        this.tabelaSelecao.procEspRestantes = JSON.stringify(this.tabelaSelecao.procEspRestantes)
        this.tabelaSelecao.procUltimos = JSON.stringify(this.tabelaSelecao.procUltimos)

        var pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "TS Pluriorganizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.data.email,
          user: { email: userBD.data.email },
          token: this.$store.state.token
        };

        var response = await axios.post(
          lhost + "/api/pendentes",
          pendenteParams
        );
        this.pendenteGuardado = true;
      } catch (err) {
        return err;
      }
    },
    pendenteGuardadoOK: function() {
      this.pendenteGuardado = false;
      this.$router.push("/");
    },
    // Elimina todo o trabalho feito até esse momento
    eliminarTS: async function() {
      this.$router.push("/");
    }
  },
  created: async function() {
    await this.infoUserEnt();
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

.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
