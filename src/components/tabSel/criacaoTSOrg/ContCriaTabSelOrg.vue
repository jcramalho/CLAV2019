<template>
  <v-container grid-list-md fluid>
    <v-stepper v-model="stepNo" vertical>
      <v-progress-linear v-model="valorBarra"></v-progress-linear>
      <v-stepper-step :complete="stepNo > 1" step="1">
        Tipologias de entidade a que pertence
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>Selecione as Tipologias de Entidade a que pertence</v-expansion-panel-header>
          <v-expansion-panel-content class="expansion-panel-heading">
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
                    hide-default-footer
                  >
                    <template v-slot:item="props">
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
        </v-expansion-panels>
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
              <v-expansion-panel-header>Selecione os Processos de Negócio Comuns</v-expansion-panel-header>
              <v-expansion-panel-content class="expansion-panel-heading">
                <ListaProcessosComuns
                  v-if="listaProcComunsReady"
                  v-bind:lista="listaProcComuns"
                  tipo="Processos Comuns"
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
            </v-expansion-panels>
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
            loadProcEspRestantes();
            procPreSelEspecificos();
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
              <v-expansion-panel-header>Selecione os Processos de Negócio Específicos</v-expansion-panel-header>
              <v-expansion-panel-content class="expansion-panel-heading">
                <ListaProcessosEspecificos
                  v-if="listaProcEspReady"
                  v-bind:lista="listaProcEsp"
                  tipo="Processos Especificos"
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
            </v-expansion-panels>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs4>
            <v-text-field
              label="Nº de processos específicos selecionados"
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
              <v-expansion-panel-header>Selecione os Processos de Negócio Específicos Restantes</v-expansion-panel-header>
              <v-expansion-panel-content class="expansion-panel-heading">
                <ListaProcessosEspRestantes
                  v-if="listaProcEspResReady"
                  v-bind:lista="listaProcEspRes"
                  tipo="Processos Especificos"
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
            </v-expansion-panels>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-flex xs5>
            <v-text-field
              label="Nº de processos restantes selecionados"
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
          text
          @click="
            stepNo = 4;
            barra(48);
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
          <v-flex xs10>
            <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Selecione os Processos de Negócio Restantes</v-expansion-panel-header>
              <v-expansion-panel-content class="expansion-panel-heading">
                <ListaProcessosUltimos
                  v-if="listaProcUltReady"
                  v-bind:lista="listaProcUlt"
                  tipo="Processos Ultimos"
                  v-bind:listaPreSel="procPreSelUltimos"
                  @contadorProcSelUlt="contadorProcSelUlt($event)"
                  @contadorProcPreSelUlt="contadorProcPreSelUlt($event)"
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
            parseProcessosSel();
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

      <v-stepper-step :complete="stepNo > 7" step="7"
        >Alterações na parte descritiva
        <small
          >Adicionar, remover ou editar Notas de Aplicação (NA),
          Exclusão (NE), Exemplos de Notas de Aplicação (ENA) e Termos de Ìndice (TI) 
          nos processos selecionados</small
        >
      </v-stepper-step>
      <v-stepper-content step="7">
        <v-layout wrap>
          <v-flex xs10>
            <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Lista de Processos selecionados</v-expansion-panel-header>
              <v-expansion-panel-content class="expansion-panel-heading">
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
        <v-btn
          color="primary"
          @click="
            stepNo = 8;
            barra(100);
          "
          >Continuar</v-btn
        >
        <v-btn
          text
          @click="
            stepNo = 6;
            barra(64);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>


      <v-btn color="primary" v-if="stepNo > 7" @click="submeterTS()"
        >Submeter</v-btn
      >
      <v-btn color="primary" v-else @click="guardarTrabalho()"
        >Guardar trabalho</v-btn
      >
      <v-btn dark text color="red darken-4" @click="eliminarTabela = true"
        >Eliminar TS
            <v-dialog v-model="eliminarTabela" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Eliminar Tabela</v-card-title>
                    <v-card-text>Pretende eliminar todo o trabalho realizado?</v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="eliminarTabela = false">Cancelar</v-btn>
                    <v-btn color="primary" text @click="eliminarTS(); eliminarTabela=false;">Confirmar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn
      >
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

import ListaProcessosComuns from "@/components/tabSel/criacaoTSOrg/ListaProcessosComuns.vue";
import ListaProcessosEspecificos from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/criacaoTSOrg/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/criacaoTSOrg/ListaProcessosUltimos.vue";
import ListaParteDescritiva from "@/components/tabSel/criacaoTSOrg/ListaProcSel.vue"

import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";

export default {
  props: ["obj"],
  components: {
    ListaProcessosComuns,
    ListaProcessosEspecificos,
    ListaProcessosEspRestantes,
    ListaProcessosUltimos,
    DesSelTip,
    SelTip,
    ListaParteDescritiva
  },

  data() {
    return {
      tabelaSelecao: {},
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
      pedidoCriado: false,
      mensagemPedidoCriadoOK: "Pedido criado com sucesso: ",
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Lista de todos os processos selecionados em todos os passos
      listaTotalProcSel: [],
      listaTotalProcSelReady: false,
      listaTotalProcSelUpdate: [],
    };
  },
  methods: {
    // Valor da barra de progresso
    barra: async function(valor) {
      this.valorBarra = valor;
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
        for (var i = 0; i < this.tabelaSelecao.tipologias.length; i++) {
          var index = this.tipologias.findIndex(
            e => e.id === this.tabelaSelecao.tipologias[i].id
          );
          this.tipologias.splice(index, 1);
        }

        this.tipSel = this.tabelaSelecao.tipologias;
        // Para retirar da lista de tipologias selecionadas aquelas que por default já fazem parte da entidade
        for (var j = 0; j < this.tipEnt.length; j++) {
          index = this.tipSel.findIndex(e => e.id === this.tipEnt[j].id);
          this.tipSel.splice(index, 1);
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
              for (var j = 0; j < this.tabelaSelecao.procComuns.length; j++) {
                var estavaGuardado = false;
                  if (
                    this.tabelaSelecao.procComuns[j].classe ==
                    response.data[i].codigo 
                  ) {
                    if(response.data[i].transversal === "S") {
                      this.listaProcComuns.push({
                        classe: this.tabelaSelecao.procComuns[j].classe,
                        designacao: this.tabelaSelecao.procComuns[j].designacao,
                        dono: this.tabelaSelecao.procComuns[j].dono,
                        participante: this.tabelaSelecao.procComuns[j].participante
                      });
                    }
                    else {
                        this.listaProcComuns.push({
                        classe: response.data[i].codigo,
                        designacao: response.data[i].titulo,
                        dono: this.tabelaSelecao.procComuns[j].dono,
                      });
                    }
                    estavaGuardado = true;
                    break;
                  }
              }
              if (!estavaGuardado) {
                if(response.data[i].transversal === "S") {
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
          var url =
            lhost +
            "/api/classes?tipo=especifico&ents=" +
            this.tabelaSelecao.idEntidade;
          if (this.tabelaSelecao.tipologias) {
            url += "&tips=";
            for (var i = 0; i < this.tabelaSelecao.tipologias.length - 1; i++) {
              url += this.tabelaSelecao.tipologias[i].id + ",";
            }
            url += this.tabelaSelecao.tipologias[i].id;
          }
          var response = await axios.get(url);
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
                  if(response.data[x].transversal === "S"){
                    this.listaProcEsp.push({
                      classe: this.tabelaSelecao.procEspecificos[j].classe,
                      designacao: this.tabelaSelecao.procEspecificos[j]
                        .designacao,
                      dono: this.tabelaSelecao.procEspecificos[j].dono,
                      participante: this.tabelaSelecao.procEspecificos[j]
                        .participante
                    });
                  }
                  else {
                    this.listaProcEsp.push({
                      classe: this.tabelaSelecao.procEspecificos[j].classe,
                      designacao: this.tabelaSelecao.procEspecificos[j]
                        .designacao,
                      dono: this.tabelaSelecao.procEspecificos[j].dono,
                    });
                  }
                  estavaGuardado = true;
                  break;
                }
              }
              if (!estavaGuardado) {
                if(response.data[x].transversal === "S") {
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
                      dono: false,
                    });
                  }
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
    contadorProcSelComUtilizador: function(procSelec) {
      this.numProcSelComUtilizador =
        procSelec.length - this.numProcSelComSistema;
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
                    if(this.listaTotalProcEsp[i].transversal === "S"){
                    this.listaProcEspRes.push({
                      classe: this.tabelaSelecao.procEspRestantes[j].classe,
                      designacao: this.tabelaSelecao.procEspRestantes[j]
                        .designacao,
                      dono: this.tabelaSelecao.procEspRestantes[j].dono,
                      participante: this.tabelaSelecao.procEspRestantes[j]
                        .participante
                    });
                    } else {
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
                  if(this.listaTotalProcEsp[i].transversal === "S"){
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
                      dono: false,
                    });
                  }
                }
            }
          }
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
      if( !this.listaTotalProcSel.length ){
        this.listaTotalProcSel = this.listaTotalProcSel.concat(this.tabelaSelecao.procComuns)
          .concat(this.tabelaSelecao.procEspecificos).concat(this.tabelaSelecao.procEspRestantes)
          .concat(this.tabelaSelecao.procUltimos)
      }
      this.tabelaSelecao.listaProcSel = JSON.parse(this.tabelaSelecao.listaProcSel)
      for(var i = 0; i < this.tabelaSelecao.listaProcSel.length; i++){
        var jaSel = false;
        for( var j = 0; j < this.listaTotalProcSel.length; j++){
          if( this.tabelaSelecao.listaProcSel[i].classe == this.listaTotalProcSel[j].classe){
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
        var userBD = await axios.get(
          lhost + "/api/users/listarToken/" + this.$store.state.token
        );

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
          novoObjeto: {ts: tsObj},
          user: { email: userBD.data.email },
          entidade: userBD.data.entidade,
          token: this.$store.state.token
        };

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
        this.tabelaSelecao.tipologias = this.tipEnt.concat(this.tipSel);

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
        // console.log(pendenteParams.objeto);
        var response = await axios.put(
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
    // Elimina todo o trabalho feito até o momento
    eliminarTS: async function() {
      this.id = window.location.pathname.split('/')[3];
      axios.delete(lhost + "/api/pendentes/" + this.id)
      this.$router.push("/");
    }
  },
  created: async function() {
    this.tabelaSelecao = this.obj.objeto;
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
