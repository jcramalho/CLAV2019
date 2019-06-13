<template>
  <v-container grid-list-md fluid>
    <v-stepper v-model="stepNo" vertical>
      <v-progress-linear v-model="valorBarra"></v-progress-linear>
      <v-stepper-step :complete="stepNo > 1" step="1">
        Tipo de Tabela de Seleção
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-container fluid grid-list-xl>
          <v-layout wrap align-center>
            <v-flex xs3>
              <v-subheader>Selecionar tipo de Tabela de Seleção:</v-subheader>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
              <v-select
                :items="['Organizacional', 'Pluriorganizacional']"
                label="Tipo"
                v-model="tipo"
              ></v-select>
              <v-flex xs12 sm3>
                <v-btn
                  medium
                  @click="infoButton = true"
                  v-if="!infoButton"
                  icon
                  color="info"
                >
                  <v-icon>info</v-icon>
                </v-btn>
                <v-btn medium v-if="infoButton" color="info" @click="passos()">
                  <v-icon left>info</v-icon>Info sobre os seguintes passos
                </v-btn>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
        <v-btn
          color="primary"
          @click="
            stepNo = 1.5;
            barra(12.5);
            loadEntidades();
            estado.tipo = tipo;
          "
          v-if="tipo == 'Pluriorganizacional'"
          :disabled="!tipo"
        >
          Continuar
        </v-btn>
        <v-btn
          color="primary"
          @click="
            stepNo = 1.5;
            barra(12.5);
            loadTipologias();
            estado.tipo = tipo;
          "
          v-else
          :disabled="!tipo"
        >
          Continuar
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        v-if="tipo == 'Pluriorganizacional'"
        :complete="stepNo > 1.5"
        step="1.5"
        >Entidades abrangidas pela TS</v-stepper-step
      >
      <v-stepper-content step="1.5" v-if="tipo == 'Pluriorganizacional'">
        <v-layout wrap>
          <v-flex xs10>
            <v-select
              item-text="label"
              item-value="value"
              :items="entidades"
              label="Selecione uma classe de nível superior"
              solo
              dense
            />
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="
            stepNo = 2;
            barra(25);
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

      <v-stepper-step
        v-if="tipo == 'Organizacional'"
        :complete="stepNo > 1.5"
        step="1.5"
        >Tipologias de entidade a que pertence</v-stepper-step
      >
      <v-stepper-content step="1.5" v-if="tipo == 'Organizacional'">
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
            barra(25);
            guardarTip();
            printEstado();
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

      <v-stepper-step :complete="stepNo > 2" step="2"
        >Designação
        <small>Designação da Nova Tabela de Seleção</small>
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-flex xs12 sm6 md3 v-if="tipo === 'Organizacional'">
          <v-text-field
            :placeholder="estado.designacao"
            v-model="estado.designacao"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 md3 v-else>
          <v-text-field
            placeholder="Nome da entidade associada ao utilizador"
            v-model="estado.designacao"
          ></v-text-field>
        </v-flex>
        <v-btn
          color="primary"
          @click="
            stepNo = 3;
            barra(50);
            loadProcComuns();
          "
          >Continuar</v-btn
        >
        <v-btn
          flat
          @click="
            stepNo = 1.5;
            barra(0);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 3" step="3"
        >Processos Comuns
        <small>Processos passíveis de existirem em qualquer entidade</small>
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
                  tipo="Processos Comuns"
                  @aCalcular="aCalcular($event)"
                  @contadorProcSelCom="contadorProcSelCom($event)"
                  @contadorProcPreSelCom="contadorProcPreSelCom($event)"
                  @procPreSelResTravCom="procPreSelResTravCom($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
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
              v-if="!progressCalcular"
              label="Nº de processos comuns pré selecionados"
              :value="numProcPreSelCom"
            ></v-text-field>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-flex>
        </v-layout>
        <!-- apenas pode avançar se o num de proc pré selecionados estiver a 0 -->
        <v-btn
          color="primary"
          @click="
            stepNo = 4;
            barra(75);
            printEstado();
            procPreSelEspecificos();
          "
          >Continuar</v-btn
        >
        <v-btn
          flat
          @click="
            stepNo = 2;
            barra(25);
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
                  tipo="Processos Especificos"
                  v-bind:listaPreSel="procPreSelResTravComum"
                  @aCalcular="aCalcular($event)"
                  @contadorProcSelEsp="contadorProcSelEsp($event)"
                  @contadorProcPreSelEsp="contadorProcPreSelEsp($event)"
                  @procPreSelResTravEsp="procPreSelResTravEsp($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
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
              v-if="!progressCalcular"
              label="Nº de processos específicos pré selecionados"
              :value="numProcPreSelEsp"
            ></v-text-field>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="
            stepNo = 5;
            barra(75);
            printEstado();
            procPreSelRestantes();
            loadProcEspRestantes();
          "
          >Continuar</v-btn
        >
        <v-btn
          flat
          @click="
            stepNo = 3;
            barra(50);
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
                  tipo="Processos Especificos"
                  v-bind:listaPreSel="procPreSelEspRestantes"
                  @aCalcular="aCalcular($event)"
                  @procPreSelResTravRes="procPreSelResTravRes($event)"
                  @contadorProcSelRes="contadorProcSelRes($event)"
                  @contadorProcPreSelRes="contadorProcPreSelRes($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
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
              v-if="!progressCalcular"
              label="Nº de processos restantes pré selecionados"
              :value="numProcPreSelRes"
            ></v-text-field>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="
            stepNo = 6;
            barra(75);
            loadUltimosProcessos();
            printEstado();
          "
          >Continuar</v-btn
        >
        <v-btn
          flat
          @click="
            stepNo = 4;
            barra(50);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 6" step="6"
        >Outros processos
        <small
          >Revisão de processos de negócio não selecionados nas 
          etapas anteriores</small
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
                  v-bind:lista="listaProcUlt"
                  tipo="Processos Ultimos"
                  v-bind:listaPreSel="procPreSelUltimos"
                  @aCalcular="aCalcular($event)"
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
              :value="numProcSelRes"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 style="padding-left:60px;">
            <v-text-field
              v-if="!progressCalcular"
              label="Nº dos últimos processos pré selecionados"
              :value="numProcPreSelRes"
            ></v-text-field>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="
            stepNo = 5;
            barra(75);
          "
          >Continuar</v-btn
        >
        <v-btn
          flat
          @click="
            stepNo = 5;
            barra(50);
          "
          >Voltar</v-btn
        >
      </v-stepper-content>

      <v-btn color="primary" v-if="stepNo > 6">Submeter</v-btn>
      <v-btn color="primary" v-else>Guardar trabalho</v-btn>
      <v-btn flat>Cancelar</v-btn>
    </v-stepper>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

import ListaProcessosComuns from "@/components/tabSel/ListaProcessosComuns.vue";
import ListaProcessosEspecificos from "@/components/tabSel/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/ListaProcessosUltimos.vue"

import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";

export default {
  computed: {
    estado() {
      return this.$store.state.criacaoTabSel;
    }
  },
  watch: {
    tipo: function() {
      if (this.tipo === "Organizacional") {
        this.infoUserEnt();
      }
      if (this.tipo === "Pluriorganizacional") {
        this.estado.designacao = "";
      }
    }
  },
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
      // Numero do passo da criação de TS
      stepNo: 1,
      // Valor da barra de progresso
      valorBarra: 0,
      // Tipo da TS
      tipo: "",
      // Botão da informação sobre os passos da criação de TS
      infoButton: false,
      // Lista de todas as entidades existentes
      entidades: [],
      // Lista de todas as tipologias existentes
      tipologias: [],
      // True quando a lista de tipologias estiver carregada
      tipologiasReady: false,
      // Lista das tipologias desta entidade
      tipEnt: [],
      // Lista com as tipologias selecionadas
      tipSel: [],
      // Lista com todos os processos especificos da entidade e tipologias em causa
      listaProcEsp: [],
      // True quando a lista de todos os processos especificos da entidade e tipologias em causa estiver completa
      listaProcEspReady: false,
      // Lista com Todos os processos especificos existentes
      listaTotalProcEsp: [],
      // Lista com todos os processos comuns
      listaProcComuns: [],
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcComunsReady: false,
      // True enquanto estiver a ser efetuado uma travessia
      progressCalcular: false,
      // Numero de processos comuns selecionados
      numProcSelCom: 0,
      // Lista dos processos comuns selecionados
      listaProcSelCom: [],
      // Numero de processos comuns que se encontram pré selecionados
      numProcPreSelCom: 0,
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs comuns)
      procPreSelResTravComum: [],
      // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs especificos)
      procPreSelResTravEspecifico: [],
      // Numero de processos pre selecionados especificos
      numProcPreSelEsp: 0,
      // Numero de processos especificos selecionados
      numProcSelEsp: 0,
      // Lista dos processos especificos selecionados
      listaProcSelEsp: [],
      // Lista dos processos especificos restantes (que não são especificos da entidade nem da tipologia em causa)
      listaProcEspRes: [],
      // True quando a lista dos processos especificos restantes estiver completa
      listaProcEspResReady: false,
      // Numero de processos restantes selecionados
      numProcSelRes: 0,
      // Numero de processos restantes que se encontram pré selecionados
      numProcPreSelRes: 0,
      // Lista dos processos restantes selecionados
      listaProcSelRes: [], 
      // Lista dos processos pré selecionados restantes (resultado das travessias pos PNs especificos restantes)
      procPreSelResTravRestante: [],
      // Lista dos processos pré selecionados resultantes das travessias dos comuns e especificos
      procPreSelEspRestantes: [],
      // Lista dos ultimos processos pre selecionados
      procPreSelUltimos: [],
      // Lista de todos os processos que ainda não foram selecionados nas etapas anteriores
      listaProcUlt: [],
    };
  },
  methods: {
    // Valor da barra de progresso
    barra: async function(valor) {
      this.valorBarra = valor;
    },
    // Reencaminha para a página da informação dos seguintes passos
    passos: function() {
      this.$router.push("/ts/passos");
    },
    // Função que procura o nome da entidade e o id da Entidade associada ao utilizador
    infoUserEnt: async function() {
      var resUser = await axios.get(
        lhost + "/api/users/listarToken/" + this.$store.state.user.token
      );
      var resEnt = await axios.get(
        lhost + "/api/entidades/" + resUser.data.entidade
      );
      this.estado.designacao = resEnt.data.designacao;
      this.estado.idEntidade = resUser.data.entidade;
    },
    // Faz load de todas as entidades
    loadEntidades: async function() {
      try {
        var response = await axios.get(lhost + "/api/entidades");
        this.entidades = response.data
          .map(function(item) {
            return {
              label: item.sigla + " - " + item.designacao,
              value: item.id.split("#")[1]
            };
          })
          .sort(function(a, b) {
            return a.label.localeCompare(b.label);
          });
      } catch (erro) {
        console.log(erro);
      }
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
          lhost + "/api/entidades/" + this.estado.idEntidade + "/tipologias"
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
        console.log(error);
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
    // Guarda no estado as tipologias da entidade
    guardarTip: function() {
      this.estado.tipologias = this.tipEnt.concat(this.tipSel);
    },
    // Carrega os processos específicos da entidade em causa
    loadProcEspecificos: async function() {
      try {
        var url =
          lhost + "/api/classes?tipo=especifico&ent=" + this.estado.idEntidade;
        if (this.estado.tipologias) {
          url += "&tips=";
          for (var i = 0; i < this.estado.tipologias.length - 1; i++) {
            url += this.estado.tipologias[i].id + ",";
          }
          url += this.estado.tipologias[i].id;
        }
        var response = await axios.get(url);
        for (var x = 0; x < response.data.length; x++) {
          if(response.data[x].transversal==='S'){
            this.listaProcEsp.push({
              classe: response.data[x].codigo,
              designacao: response.data[x].titulo,
              dono: false,
              participante: false
            });
          }
          else {
            this.listaProcEsp.push({
              classe: response.data[x].codigo,
              designacao: response.data[x].titulo,
              dono: true
            })
          }
        }
        return this.listaProcEsp;
      } catch (error) {
        console.log(error);
      }
    },
    // Carrega todos os processos comuns
    loadProcComuns: async function() {
      try {
        var response = await axios.get(lhost + "/api/classes?tipo=comum");
        for (var i = 0; i < response.data.length; i++) {
          if(response.data[i].transversal==="S"){
            this.listaProcComuns.push({
              classe: response.data[i].codigo,
              designacao: response.data[i].titulo,
              dono: false,
              participante: false
            });
          }
          else {
            this.listaProcComuns.push({
              classe: response.data[i].codigo,
              designacao: response.data[i].titulo,
              dono: true
            });
          }
        }
        this.listaProcComunsReady = true;
        return this.listaProcComuns;
      } catch (erro) {
        console.log(erro);
      }
    },
    // Enquanto estiver a ser efetuado o calculo da travessia, coloca esta variavel a false
    aCalcular: async function(bool) {
      this.progressCalcular = bool;
    },
    // Contador dos processos selecionados comuns
    contadorProcSelCom: function(procSelec) {
      this.numProcSelCom = procSelec.length;
      this.estado.procComuns = procSelec;
      this.listaProcSelCom = procSelec;
    },
    // Contador dos processos pre selecionados comuns
    contadorProcPreSelCom: function(lista) {
      this.numProcPreSelCom = lista.length;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
    procPreSelResTravCom: function(procPreSelResTravCom) {
      this.procPreSelResTravComum = procPreSelResTravCom;
    },
    // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs especificos
    procPreSelResTravEsp: function(procPreSelResTravEsp) {
      this.procPreSelResTravEspecifico = procPreSelResTravEsp;
    },
    // Processos pre selecionados especificos resultantes das travessias da tabela de processos comuns
    procPreSelEspecificos: function() {
      for (var i = 0; i < this.listaProcEsp.length; i++) {
        if (this.procPreSelResTravComum.includes(this.listaProcEsp[i].classe)) {
          this.numProcPreSelEsp += 1;
        }
      }
      this.listaProcEspReady = true;
    },
    // Processos pre selecionados restantes especificos resultantes das travessias da tabela de processos comuns e especificos
    procPreSelRestantes: function() {
      for (var i = 0; i < this.listaProcEspRes.length; i++) {
        if (this.procPreSelResTravComum.includes(this.listaProcEspRes[i].classe) ||
        this.procPreSelResTravEspecifico.includes(this.listaProcEspRes[i].classe)) {
          this.procPreSelEspRestantes.push(this.listaProcEspRes[i].classe)
          this.numProcPreSelRes += 1;
        }
      }
    },
    // Contador dos processos selecionados especificos
    contadorProcSelEsp: function(procSelec) {
      this.numProcSelEsp = procSelec.length;
      this.estado.procEspecificos = procSelec;
      this.listaProcSelEsp = procSelec;
    },
    // Contador dos processos pre selecionados especificos
    contadorProcPreSelEsp: function(lista) {
      this.numProcPreSelEsp = lista.length;
    },
    // Carrega todos os processos especificos restantes
    loadProcEspRestantes: async function() {
      try {
        var response = await axios.get(lhost + "/api/classes?tipo=especifico");
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
            if(this.listaTotalProcEsp[i].transversal==="S"){
                this.listaProcEspRes.push({
                  classe: this.listaTotalProcEsp[i].codigo,
                  designacao: this.listaTotalProcEsp[i].titulo,
                  dono: false,
                  participante: false
                });
              }
              else {
                this.listaProcEspRes.push({
                  classe: this.listaTotalProcEsp[i].codigo,
                  designacao: this.listaTotalProcEsp[i].titulo,
                  dono: true
                });
              }
            }
            this.listaProcEspResReady = true;
        }
        console.log(this.estado.procComuns);
        console.log(this.estado.procEspecificos);
      } catch (error) {
        console.log(error);
      }
    },
    // Contador dos processos selecionados restantes
    contadorProcSelRes: function(procSelec) {
      this.numProcSelRes = procSelec.length;
      this.estado.procRestantes = procSelec;
      this.listaProcSelRes = procSelec;
    },
    // Contador dos processos pre selecionados restantes
    contadorProcPreSelRes: function(lista) {
      this.numProcPreSelRes = lista.length;
    },
    // Lista dos processos pre selecionados especificos restantes, resultantes das travessias dos PNs especificos
    procPreSelResTravRes: function(procPreSelResTravRes) {
      this.procPreSelResTravRestante = procPreSelResTravRes;
    },
    // Carrega os ultimos processos (processos que não foram selecionados nas 3 etapas anteriores)
    loadUltimosProcessos: function() {
      for( var i = 0; i < this.listaProcComuns.length; i++ ){
        var procSelecionado = false;
        for( var j = 0; j < this.estado.procComuns.length; j++ ){
          if( this.listaProcComuns[i].classe === this.estado.procComuns[j].classe ){
            procSelecionado = true;
            break;
          }
        }
        if( procSelecionado == false ){
          this.listaProcUlt.push(this.listaProcComuns[i]);
        }
      }
      // Lista com todos os processos já selecionados
      var procEspSelecionados = this.estado.procEspecificos.concat(this.estado.procRestantes);
      for( var f = 0; f < this.listaTotalProcEsp.length; f++ ){
        var procSelecionado = false;
        for( var m = 0; m < procEspSelecionados.length; m++ ){
          if( this.listaTotalProcEsp[f].codigo === procEspSelecionados[m].classe ){
            procSelecionado = true;
            break;
          }
        }
        if( procSelecionado == false ){
          this.listaProcUlt.push(this.listaTotalProcEsp[f]);
        }
      }
      console.log("LISTA DOS ULTIMOS PROCESSOS")
      console.log(this.listaProcUlt)
    },
    printEstado: async function() {
      console.log(this.$store.state.criacaoTabSel);
    }
  },
  created: function() {
    this.estado.procComuns = [];
    this.estado.procEspecificos = [];
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}
</style>
