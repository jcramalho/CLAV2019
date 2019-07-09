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
                  tipo="Processos Comuns"
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
            loadProcEspRestantes();
            procPreSelEspecificos();
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
                  tipo="Processos Especificos"
                  v-bind:listaPreSel="procPreSelResTravComum"
                  @contadorProcSelEsp="contadorProcSelEsp($event)"
                  @contadorProcPreSelEsp="contadorProcPreSelEsp($event)"
                  @procPreSelResTravEsp="procPreSelResTravEsp($event)"
                />
                <div v-else>a carregar</div>
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
                  tipo="Processos Especificos"
                  v-bind:listaPreSel="procPreSelEspRestantes"
                  @procPreSelResTravRes="procPreSelResTravRes($event)"
                  @contadorProcSelRes="contadorProcSelRes($event)"
                  @contadorProcPreSelRes="contadorProcPreSelRes($event)"
                />
                <div v-else>a carregar</div>
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
                  v-if="listaProcUltReady"
                  v-bind:lista="listaProcUlt"
                  tipo="Processos Ultimos"
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

      <v-btn color="primary" v-if="stepNo > 6" @click="submeterTS()">Submeter</v-btn>
      <v-btn color="primary" v-else @click="guardarTrabalho()">Guardar trabalho</v-btn>
      <v-btn dark flat color="red darken-4" @click="eliminarTS()"
            >Eliminar TS</v-btn
          >
    </v-stepper>
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

import ListaProcessosComuns from "@/components/tabSel/ListaProcessosComuns.vue";
import ListaProcessosEspecificos from "@/components/tabSel/ListaProcessosEspecificos.vue";
import ListaProcessosEspRestantes from "@/components/tabSel/ListaProcessosEspRestantes.vue";
import ListaProcessosUltimos from "@/components/tabSel/ListaProcessosUltimos.vue";

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
        SelTip
    },

    data() {
        return{
            tabelaSelecao: {},
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
            // Lista com todos os processos especificos da entidade e tipologias em causa
            listaProcEsp: [],
            // True quando a lista de todos os processos especificos da entidade e tipologias em causa estiver completa
            listaProcEspReady: false,
            // Numero de processos comuns selecionados
            numProcSelCom: 0, 
            // Numero de processos comuns que se encontram pré selecionados
            numProcPreSelCom: 0,
            // Lista com todos os processos comuns
            listaProcComuns: [],
            // True quando a lista de todos os processos comuns existentes estiver completa
            listaProcComunsReady: false,
            // Numero de processos especificos selecionados
            numProcSelEsp: 0,
            // Numero de processos pre selecionados especificos
            numProcPreSelEsp: 0,
            // True quando a lista de todos os processos especificos da entidade e tipologias em causa estiver completa
            listaProcEspReady: false,
            // Lista com Todos os processos especificos existentes
            listaTotalProcEsp: [],
            // Lista dos processos especificos restantes (que não são especificos da entidade nem da tipologia em causa)
            listaProcEspRes: [],
            // True quando a lista dos processos especificos restantes estiver completa
            listaProcEspResReady: false,
            // Numero de processos restantes selecionados
            numProcSelRes: 0,
            // Numero de processos restantes que se encontram pré selecionados
            numProcPreSelRes: 0,
            // Lista dos processos pré selecionados resultantes das travessias dos comuns e especificos
            procPreSelEspRestantes: [],
            // True quando a ultima lista estiver pronta
            listaProcUltReady: false,
            // Lista de todos os processos que ainda não foram selecionados nas etapas anteriores
            listaProcUlt: [],
            // Número dos ultimos processos selecionados
            numProcSelUlt: 0,
            // Numero de processos pré selecionados no ultimo componente de seleção
            numProcPreSelUlt: 0,
            // Lista dos ultimos processos pre selecionados
            procPreSelUltimos: [],
            // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs comuns)
            procPreSelResTravComum: [],
            // Lista dos processos pre selecionados restantes (resultado das travessias dos PNs especificos)
            procPreSelResTravEspecifico: [],
            // Lista dos processos pré selecionados restantes (resultado das travessias pos PNs especificos restantes)
            procPreSelResTravRestante: [],

            pendenteGuardado: false,
        }
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
                lhost + "/api/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
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
            for(var j = 0; j < this.tipEnt.length; j++){
                var index = this.tipSel.findIndex(
                    e => e.id === this.tipEnt[j].id
                    );
                this.tipSel.splice(index, 1);
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
                this.tabelaSelecao.tipologias = this.tabelaSelecao.tipologias.concat(this.tipEnt)
                if( !this.listaProcEspReady ){
                var url =
                    lhost + "/api/classes?tipo=especifico&ent=" + this.tabelaSelecao.idEntidade;
                if (this.tabelaSelecao.tipologias) {
                    url += "&tips=";
                    for (var i = 0; i < this.tabelaSelecao.tipologias.length - 1; i++) {
                    url += this.tabelaSelecao.tipologias[i].id + ",";
                    }
                    url += this.tabelaSelecao.tipologias[i].id;
                }
                var response = await axios.get(url);
                for (var x = 0; x < response.data.length; x++) {
                    if(response.data[x].transversal==='S'){
                        for(var j = 0; j < this.tabelaSelecao.procEspecificos.length; j++){
                            var estavaGuardado = false;
                            if(this.tabelaSelecao.procEspecificos[j].classe == response.data[x].codigo){
                                this.listaProcEsp.push({
                                    classe: this.tabelaSelecao.procEspecificos[j].classe,
                                    designacao: this.tabelaSelecao.procEspecificos[j].designacao,
                                    dono: this.tabelaSelecao.procEspecificos[j].dono,
                                    participante: this.tabelaSelecao.procEspecificos[j].participante
                            })
                            estavaGuardado = true;
                            break;
                            }
                        }
                        if( !estavaGuardado ){
                            this.listaProcEsp.push({
                            classe: response.data[x].codigo,
                            designacao: response.data[x].titulo,
                            dono: false,
                            participante: false
                            });
                        }
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
                }
            } catch (error) {
                console.log(error);
            }
        },
        // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs comuns
        procPreSelResTravCom: function(procPreSelResTravCom) {
            this.procPreSelResTravComum = procPreSelResTravCom;
        },
        // Contador dos processos pre selecionados comuns
        contadorProcPreSelCom: function(lista) {
            this.numProcPreSelCom = lista.length;
        },
        // Contador dos processos selecionados comuns
        contadorProcSelCom: function(procSelec) {
            this.numProcSelCom = procSelec.length;
            this.tabelaSelecao.procComuns = procSelec;
            this.listaProcSelCom = procSelec;
        },
        // Carrega todos os processos comuns
        loadProcComuns: async function() {
            try {
                if( !this.listaProcComunsReady ){
                var response = await axios.get(lhost + "/api/classes?tipo=comum");
                for (var i = 0; i < response.data.length; i++) {
                    if(response.data[i].transversal==="S"){
                        for(var j = 0; j < this.tabelaSelecao.procComuns.length; j++){
                            var estavaGuardado = false;
                            if(this.tabelaSelecao.procComuns[j].classe == response.data[i].codigo){
                                this.listaProcComuns.push({
                                    classe: this.tabelaSelecao.procComuns[j].classe,
                                    designacao: this.tabelaSelecao.procComuns[j].designacao,
                                    dono: this.tabelaSelecao.procComuns[j].dono,
                                    participante: this.tabelaSelecao.procComuns[j].participante
                                })
                                estavaGuardado = true;
                                break;
                            }
                        }
                        if( !estavaGuardado ){
                            this.listaProcComuns.push({
                                classe: response.data[i].codigo,
                                designacao: response.data[i].titulo,
                                dono: false,
                                participante: false
                            });
                        }
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
            }
        } catch (erro) {
            console.log(erro);
        }
        },
        // Contador dos processos selecionados especificos
        contadorProcSelEsp: function(procSelec) {
            this.numProcSelEsp = procSelec.length;
            this.tabelaSelecao.procEspecificos = procSelec;
            this.listaProcSelEsp = procSelec;
        },
        // Contador dos processos pre selecionados especificos
        contadorProcPreSelEsp: function(lista) {
            this.numProcPreSelEsp = lista.length;
        },
        // Processos pre selecionados especificos resultantes das travessias da tabela de processos comuns
        procPreSelEspecificos: function() {
            if( !this.listaProcEspReady ){
                for (var i = 0; i < this.listaProcEsp.length; i++) {
                if (this.procPreSelResTravComum.includes(this.listaProcEsp[i].classe)) {
                    this.numProcPreSelEsp += 1;
                }
                }
            }
        this.listaProcEspReady = true;
        },
        // Carrega todos os processos especificos restantes
        loadProcEspRestantes: async function() {
            try {
                if( !this.listaProcEspResReady ){
                var response = await axios.get(lhost + "/api/classes?tipo=especifico");
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
                    if(this.listaTotalProcEsp[i].transversal==="S"){
                        for(var j = 0; j < this.tabelaSelecao.procEspRestantes.length; j++){
                            var estavaGuardado = false;
                            if(this.tabelaSelecao.procEspRestantes[j].classe == this.listaTotalProcEsp[i].codigo){
                                this.listaProcEspRes.push({
                                    classe: this.tabelaSelecao.procEspRestantes[j].classe,
                                    designacao: this.tabelaSelecao.procEspRestantes[j].designacao,
                                    dono: this.tabelaSelecao.procEspRestantes[j].dono,
                                    participante: this.tabelaSelecao.procEspRestantes[j].participante,
                                })
                                estavaGuardado = true;
                                break;
                                }
                            }
                            if(!estavaGuardado){
                                this.listaProcEspRes.push({
                                    classe: this.listaTotalProcEsp[i].codigo,
                                    designacao: this.listaTotalProcEsp[i].titulo,
                                    dono: false,
                                    participante: false
                                });
                            }
                        }
                        else {
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
                console.log(error);
            }
        },
        // Lista dos processos pre selecionados restantes, resultantes das travessias dos PNs especificos
        procPreSelResTravEsp: function(procPreSelResTravEsp) {
            this.procPreSelResTravEspecifico = procPreSelResTravEsp;
        },
        // Processos pre selecionados restantes especificos resultantes das travessias da tabela de processos comuns e especificos
        procPreSelRestantes: function() {
            if( !this.listaProcEspResReady ) {
                for (var i = 0; i < this.listaProcEspRes.length; i++) {
                if (this.procPreSelResTravComum.includes(this.listaProcEspRes[i].classe) ||
                    this.procPreSelResTravEspecifico.includes(this.listaProcEspRes[i].classe)) {
                    this.procPreSelEspRestantes.push(this.listaProcEspRes[i].classe)
                    this.numProcPreSelRes += 1;
                }
                }
            }
            this.listaProcEspResReady = true;
        },
        // Lista dos processos pre selecionados especificos restantes, resultantes das travessias dos PNs especificos
        procPreSelResTravRes: function(procPreSelResTravRes) {
            this.procPreSelResTravRestante = procPreSelResTravRes;
        },
        // Contador dos processos selecionados restantes
        contadorProcSelRes: function(procSelec) {
            this.numProcSelRes = procSelec.length;
            this.tabelaSelecao.procEspRestantes = procSelec;
            this.listaProcSelRes = procSelec;
        },
        // Contador dos processos pre selecionados restantes
        contadorProcPreSelRes: function(lista) {
            this.numProcPreSelRes = lista.length;
        },
        // Carrega os ultimos processos (processos que não foram selecionados nas 3 etapas anteriores)
        loadUltimosProcessos: async function() {
            try{
        // Vai a lista dos processos comuns e, caso estes ainda não se encontrem selecionados, coloca na lista dos ultimos processos
            for( var i = 0; i < this.listaProcComuns.length; i++ ){
                var procSelecionado = false;
                for( var j = 0; j < this.tabelaSelecao.procComuns.length; j++ ){
                    if( this.listaProcComuns[i].classe === this.tabelaSelecao.procComuns[j].classe ){
                        procSelecionado = true;
                        break;
                    }
                }
                if( procSelecionado == false ){
                var jaExiste = false;
                for( var a = 0; a < this.listaProcUlt.length; a++ ){
                    if( this.listaProcUlt[a].classe === this.listaProcComuns[i].classe ){
                    jaExiste = true;
                    break;
                    }
                }
                if( jaExiste == false ){
                    if(this.tabelaSelecao.procUltimos.length) {
                        for(var c = 0; c < this.tabelaSelecao.procUltimos.length; c++){
                            var estavaGuardado = false;
                            if(this.tabelaSelecao.procUltimos[c].classe == this.listaProcComuns[i].classe){
                                this.listaProcUlt.push({
                                    classe: this.tabelaSelecao.procUltimos[c].classe,
                                    designacao: this.tabelaSelecao.procUltimos[c].designacao,
                                    dono: this.tabelaSelecao.procUltimos[c].dono,
                                    participante: this.tabelaSelecao.procUltimos[c].participante
                                })
                                estavaGuardado = true;
                                break;
                            }
                        }
                        if(!estavaGuardado){
                            this.listaProcUlt.push(this.listaProcComuns[i]);
                        }
                    }
                    else{
                        this.listaProcUlt.push(this.listaProcComuns[i]);
                    }
                }
                }
            }
            // Lista com todos os processos especificos já selecionados (especificos e especificos restantes)
            var procSelecionados = this.tabelaSelecao.procEspecificos.concat(this.tabelaSelecao.procEspRestantes);
            // Caso esse processo ainda não se encontre selecionado, irá para a lista listaProcUlt
            for( var f = 0; f < this.listaTotalProcEsp.length; f++ ){
                var procSelecionado = false;
                for( var m = 0; m < procSelecionados.length; m++ ){
                if( this.listaTotalProcEsp[f].codigo === procSelecionados[m].classe ){
                    procSelecionado = true;
                    break;
                }
                }
                if( procSelecionado == false ){
                    var jaExiste = false;
                    for( var c = 0; c < this.listaProcUlt.length; c++ ){
                        if( this.listaProcUlt[c].classe === this.listaTotalProcEsp[f].codigo ){
                        jaExiste = true;
                        break;
                        }
                    }
                    if( jaExiste == false ){
                        if( this.tabelaSelecao.procUltimos.length ) {
                            for(var u = 0; u < this.tabelaSelecao.procUltimos.length; u++){
                                var estavaGuardado = false;
                                if(this.tabelaSelecao.procUltimos[u].classe == this.listaTotalProcEsp[f].codigo){
                                    this.listaProcUlt.push({
                                        classe: this.tabelaSelecao.procUltimos[u].classe,
                                        designacao: this.tabelaSelecao.procUltimos[u].designacao,
                                        dono: this.tabelaSelecao.procUltimos[u].dono,
                                        participante: this.tabelaSelecao.procUltimos[u].participante
                                    })
                                    estavaGuardado = true;
                                    break;
                                }
                            }
                            if(!estavaGuardado){
                                this.listaProcUlt.push({
                                    classe: this.listaTotalProcEsp[f].codigo,
                                    designacao: this.listaTotalProcEsp[f].titulo,
                                    dono: false,
                                    participante: false 
                                });
                            }
                        }
                        else {
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
            if( this.listaProcUlt.length ){
                this.listaProcUltReady = true;
            }
            }
            catch(err){
                console.log(err)
            }
        },
        // Contador dos processos selecionados ultimos
        contadorProcSelUlt: function(procSelec) {
            this.numProcSelUlt = procSelec.length;
            this.tabelaSelecao.procUltimos = procSelec;
            this.listaProcSelUlt = procSelec;
        },
        // Processos pre selecionados para o ultimo componente resultantes das travessias da tabela de processos comuns, especificos e restantes especificos
        procPreSelUlt: function() {
            if(!this.listaProcUltReady){
                for (var i = 0; i < this.listaProcUlt.length; i++) {
                    if (this.procPreSelResTravComum.includes(this.listaProcUlt[i].classe) ||
                    this.procPreSelResTravEspecifico.includes(this.listaProcUlt[i].classe) ||
                    this.procPreSelResTravRestante.includes(this.listaProcUlt[i].classe)) {
                        this.procPreSelUltimos.push(this.listaProcUlt[i].classe)
                        this.numProcPreSelUlt += 1;
                    }
                }
            }

        },
        // Contador dos ultimos processos pre selecionados
        contadorProcPreSelUlt: function(lista) {
            this.numProcPreSelUlt = lista.length;
        },
        guardarTrabalho: async function(){
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
                console.log(pendenteParams.objeto)
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
    },
    created: async function(){
        this.tabelaSelecao = this.obj.objeto;
        this.loadTipologias();
        this.loadProcComuns();
    }
}
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}
</style>


