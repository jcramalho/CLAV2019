<template>
  <v-container grid-list-md fluid>
    <v-stepper v-model="stepNo" vertical>
      <v-progress-linear v-model="valorBarra"></v-progress-linear>
      <v-stepper-step :complete="stepNo > 1" step="1">
        Tipologias de entidade a que pertence
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-expansion-panel>
          <v-expansion-panel-content class="expansion-panel-heading">
            <template v-slot:header>
              <div class="subheading font-weight-bold">
                Selecione as Tipologias de Entidade a que pertence
              </div>
            </template>
            <v-card style="padding-top:30px;">
              <v-layout>
                <v-flex xs2>
                  <v-subheader
                    class="info-label"
                    style="border-color: white; border-style:solid; color: #1A237E;"
                    >Tipologias da entidade:</v-subheader
                  >
                </v-flex>
                <v-flex xs9>
                  <v-data-table
                    :headers="[
                      { text: 'Sigla', align: 'left', value: 'sigla' },
                      { text: 'Designação', value: 'designacao' }
                    ]"
                    :items="tipEnt"
                    class="elevation-1"
                    hide-actions
                  >
                    <template v-slot:items="props">
                      <tr>
                        <td>{{ props.item.sigla }}</td>
                        <td>{{ props.item.designacao }}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
              <DesSelTip
                :tipologias="tipSel"
                @unselectTipologia="unselectTipologia($event)"
              />

              <hr style="border-top: 1px dashed #dee2f8;" />

              <SelTip
                :tipologiasReady="tipologiasReady"
                :tipologias="tipologias"
                @selectTipologia="selectTipologia($event)"
              />
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-btn
          color="primary"
          @click="
            stepNo = 2;
            barra(16);
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
            :placeholder="tabelaSelecao.designacao"
            v-model="tabelaSelecao.designacao"
          ></v-text-field>
        </v-flex>
        <v-btn
          color="primary"
          @click="
            stepNo = 3;
            barra(32);
            listaProcComunsReady = true;
            loadProcEspecificos();
          "
          >Continuar</v-btn
        >
        <v-btn
          flat
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
            <v-expansion-panel>
              <v-expansion-panel-content class="expansion-panel-heading">
                <template v-slot:header>
                  <div class="subheading font-weight-bold">
                    Selecione os Processos de Negócio Comuns
                  </div>
                </template>
                <ListaProcessosComuns
                  v-if="listaProcComunsReady"
                  v-bind:lista="listaProcComuns"
                  @contadorProcSelCom="contadorProcSelCom($event)"
                  @contadorProcPreSelCom="contadorProcPreSelCom($event)"
                  @procPreSelResTravCom="procPreSelResTravCom($event)"
                  @contadorProcSelComSistema="contadorProcSelComSistema($event)"
                  @contadorProcSelComUtilizador="
                    contadorProcSelComUtilizador($event)
                  "
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs4>
            <v-text-field
              label="Nº de processos comuns selecionados total"
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
        <v-layout wrap>
          <v-flex xs4>
            <v-text-field
              label="Nº de processos comuns selecionados pelo sistema"
              :value="numProcSelComSistema"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 style="padding-left:60px;">
            <v-text-field
              label="Nº de processos comuns selecionados pelo utilizador"
              :value="numProcSelComUtilizador"
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
          flat
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
            <v-expansion-panel>
              <v-expansion-panel-content class="expansion-panel-heading">
                <template v-slot:header>
                  <div class="subheading font-weight-bold">
                    Selecione os Processos de Negócio Específicos
                  </div>
                </template>
                <ListaProcessosEspecificos
                  v-if="listaProcEspReady"
                  v-bind:lista="listaProcEsp"
                  v-bind:listaPreSel="procPreSelResTravComum"
                  @contadorProcSelEsp="contadorProcSelEsp($event)"
                  @contadorProcPreSelEsp="contadorProcPreSelEsp($event)"
                  @procPreSelResTravEsp="procPreSelResTravEsp($event)"
                  @contadorProcSelEspSistema="contadorProcSelEspSistema($event)"
                  @contadorProcSelEspUtilizador="
                    contadorProcSelEspUtilizador($event)
                  "
                />
                <div v-else>a carregar</div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs4>
            <v-text-field
              label="Nº de processos específicos selecionados total"
              :value="numProcSelEsp"
            ></v-text-field>
          </v-flex>
          <v-flex xs5 style="padding-left:60px;">
            <v-text-field
              label="Nº de processos específicos pré selecionados"
              :value="numProcPreSelEsp"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs4>
            <v-text-field
              label="Nº de processos específicos selecionados pelo sistema"
              :value="numProcSelEspSistema"
            ></v-text-field>
          </v-flex>
          <v-flex xs5 style="padding-left:60px;">
            <v-text-field
              label="Nº de processos específicos selecionados pelo utilizador"
              :value="numProcSelEspUtilizador"
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
          flat
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
            <v-expansion-panel>
              <v-expansion-panel-content class="expansion-panel-heading">
                <template v-slot:header>
                  <div class="subheading font-weight-bold">
                    Selecione os Processos de Negócio Específicos Restantes
                  </div>
                </template>
                <ListaProcessosEspRestantes
                  v-if="listaProcEspResReady"
                  v-bind:lista="listaProcEspRes"
                  v-bind:listaPreSel="procPreSelEspRestantes"
                  @contadorProcSelRes="contadorProcSelRes($event)"
                  @procPreSelResTravRes="procPreSelResTravRes($event)"
                  @contadorProcPreSelRes="contadorProcPreSelRes($event)"
                  @contadorProcSelEspResSistema="
                    contadorProcSelEspResSistema($event)
                  "
                  @contadorProcSelEspResUtilizador="
                    contadorProcSelEspResUtilizador($event)
                  "
                />
                <div v-else>a carregar</div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs5>
            <v-text-field
              label="Nº de processos restantes selecionados total"
              :value="numProcSelRes"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 style="padding-left:60px;">
            <v-text-field
              label="Nº de processos restantes pré selecionados"
              :value="numProcPreSelRes"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs5>
            <v-text-field
              label="Nº de processos específicos restantes selecionados pelo sistema"
              :value="numProcSelEspResSistema"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 style="padding-left:60px;">
            <v-text-field
              label="Nº de processos específicos restantes selecionados pelo utilizador"
              :value="numProcSelEspResUtilizador"
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
          flat
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
            <v-expansion-panel>
              <v-expansion-panel-content class="expansion-panel-heading">
                <template v-slot:header>
                  <div class="subheading font-weight-bold">
                    Selecione os Processos de Negócio Restantes
                  </div>
                </template>
                <ListaProcessosUltimos
                  v-if="listaProcUltReady"
                  v-bind:lista="listaProcUlt"
                  v-bind:listaPreSel="procPreSelUltimos"
                  @contadorProcSelUlt="contadorProcSelUlt($event)"
                  @contadorProcPreSelUlt="contadorProcPreSelUlt($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
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
          flat
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
      <v-btn dark flat color="red darken-4" @click="eliminarTS()"
        >Eliminar TS</v-btn
      >
    </v-stepper>

    <v-snackbar v-model="pedidoCriado" :color="'success'" :timeout="60000">
      {{ mensagemPedidoCriadoOK }}
      <v-btn dark flat @click="pedidoCriadoOK">
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
      <v-btn dark flat @click="pendenteGuardadoOK">
        Fechar
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

import ListaProcessosComuns from "@/components/tabSel/criacaoTSOrg/ListaProcessosComuns.vue";
import ListaProcessosEspecificos from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/criacaoTSOrg/ListaProcessosUltimos.vue";

import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";

export default {
  components: {
    ListaProcessosComuns,
    ListaProcessosEspecificos,
    ListaProcessosEspRestantes,
    ListaProcessosUltimos,
    DesSelTip,
    SelTip
  },
  data() {
    return {
      // Objeto da TS
      tabelaSelecao: {
        idEntidade: "",
        designacao: "",
        tipologias: [],
        procComuns: [],
        procEspecificos: [],
        procEspRestantes: [],
        procUltimos: []
      },
      // Numero do passo da criação de TS
      stepNo: 1,
      // Valor da barra de progresso
      valorBarra: 0,
      // Lista de todas as tipologias existentes
      tipologias: [],
      // True quando a lista de tipologias estiver carregada
      tipologiasReady: false,
      // Lista das tipologias desta entidade
      tipEnt: [],
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
      pedidoCriado: false,
      mensagemPedidoCriadoOK: "Pedido criado com sucesso: "
    };
  },
  methods: {
    // Função que procura o nome da entidade e o id da Entidade associada ao utilizador
    infoUserEnt: async function() {
      var resUser = await axios.get(
        lhost + "/api/users/listarToken/" + this.$store.state.token
      );
      var resEnt = await axios.get(
        lhost + "/api/entidades/" + resUser.data.entidade
      );
      this.tabelaSelecao.designacao = resEnt.data.designacao;
      this.tabelaSelecao.idEntidade = resUser.data.entidade;
    },
    // Vai à API buscar todas as tipologias e as tipologias especificas da entidade do utilizador
    loadTipologias: async function() {
      try {
        var response = await axios.get(lhost + "/api/tipologias/");
        this.tipologias = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
        this.tipologiasReady = true;

        // Tipologias onde a entidade se encontra
        var tipologias = await axios.get(
          lhost +
            "/api/entidades/" +
            this.tabelaSelecao.idEntidade +
            "/tipologias"
        );
        this.tipEnt = tipologias.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
        // Retira da lista de todas as tipologias as que já pertencem a esta entidade
        for (var i = 0; i < this.tipEnt.length; i++) {
          var index = this.tipologias.findIndex(
            e => e.id === this.tipEnt[i].id
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
          var response = await axios.get(lhost + "/api/classes?tipo=comum");
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
    // Carrega os processos específicos da entidade em causa
    loadProcEspecificos: async function() {
      try {
        if (!this.listaProcEspReady) {
          this.tipSel = this.tipSel.concat(this.tipEnt);
          var url =
            lhost +
            "/api/classes?tipo=especifico&ent=" +
            this.tabelaSelecao.idEntidade;
          if (this.tipSel.length || this.tipEnt.length) {
            url += "&tips=";
          }
          if (this.tipSel.length) {
            for (var i = 0; i < this.tipSel.length - 1; i++) {
              url += this.tipSel[i].id + ",";
            }
            url += this.tipSel[i].id;
          }
          var response = await axios.get(url);
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
          if (this.listaTotalProcEsp[f].codigo === procSelecionados[m].classe) {
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
      this.numProcSelUlt = procSelec.length;
      this.tabelaSelecao.procUltimos = procSelec;
    },
    // Contador dos ultimos processos pre selecionados
    contadorProcPreSelUlt: function(lista) {
      this.numProcPreSelUlt = lista.length;
    },
    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      try {
        var userBD = await axios.get(
          lhost + "/api/users/listarToken/" + this.$store.state.token
        );

        this.tabelaSelecao.tipologias = this.tipSel;

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Organizacional",
          novoObjeto: this.tabelaSelecao,
          user: { email: userBD.data.email },
          token: this.$store.state.token
        };

        var response = await axios.post(lhost + "/api/pedidos", pedidoParams);
        this.mensagemPedidoCriadoOk += response.data.codigo;
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

        this.tabelaSelecao.tipologias = this.tipSel;

        var pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "TS Organizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.data.email,
          user: { email: userBD.data.email },
          token: this.$store.state.token
        };
        console.log(pendenteParams.objeto);

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
    this.loadTipologias();
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
