<template>
  <v-container grid-list-md fluid>
    <v-stepper v-model="stepNo" vertical>
      <v-progress-linear v-model="valorBarra"></v-progress-linear>
      <v-stepper-step :complete="stepNo > 1" step="1">
        Entidades abrangidas pela TS
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-expansion-panel>
          <v-expansion-panel-content class="expansion-panel-heading">
            <template v-slot:header>
              <div class="subheading font-weight-bold">
                Selecione as Entidades abrangidas pela TS
              </div>
            </template>
            <v-card style="padding-top:30px;">
              <v-layout>
                <v-flex xs2>
                  <v-subheader
                    class="info-label"
                    style="border-color: white; border-style:solid; color: #1A237E;"
                    >Entidades pré selecionadas:</v-subheader
                  >
                </v-flex>
                <v-flex xs9>
                  <v-data-table
                    :headers="[
                      { text: 'Sigla', align: 'left', value: 'sigla' },
                      { text: 'Designação', value: 'designacao' }
                    ]"
                    :items="entTip"
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
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
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
            v-if="!tabelaSelecao.designacao"
            placeholder="Designação da Nova Tabela de Seleção"
            v-model="tabelaSelecao.designacao"
          ></v-text-field>
          <v-text-field
            v-else
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
            print();
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
                <ContListaProcessosComuns 
                  v-if="listaProcComunsReady && entSelReady"
                  v-bind:lista="listaProcComuns"
                  v-bind:entidades="tabelaSelecao.entidades"
                  @contadorProcSelCom="contadorProcSelCom($event)"
                  @contadorProcPreSelCom="contadorProcPreSelCom($event)"
                  @procPreSelResTravCom="procPreSelResTravCom($event)"
                  @guardarTSProcComuns="guardarTSProcComuns($event)"
                  v-bind:procSelGuardados="tabelaSelecao.procComuns"/>
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
            procPreSelEspecificos();
          "
          >Continuar</v-btn
        >
        <!--loadProcEspRestantes();-->
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
                <ContListaProcessosEspecificos
                  v-if="listaProcEspReady"
                  v-bind:lista="listaProcEsp"
                  v-bind:listaPreSel="procPreSelResTravComum"
                  v-bind:entidades="tabelaSelecao.entidades"
                  @contadorProcSelEsp="contadorProcSelEsp($event)"
                  @contadorProcPreSelEsp="contadorProcPreSelEsp($event)"
                  @procPreSelResTravEsp="procPreSelResTravEsp($event)"
                  @guardarTSProcEsp="guardarTSProcEsp($event)"
                  v-bind:procSelGuardados="tabelaSelecao.procEspecificos"
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

      <!--<v-stepper-step :complete="stepNo > 5" step="5"
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
                  v-bind:entidades="tabelaSelecao.entidades"
                  @contadorProcSelRes="contadorProcSelRes($event)"
                  @contadorProcPreSelRes="contadorProcPreSelRes($event)"
                  @procPreSelResTravRes="procPreSelResTravRes($event)"
                  @guardarTSProcRes="guardarTSProcRes($event)"
                  v-bind:procSelGuardados="tabelaSelecao.procEspRestantes"
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
            print();
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
                  v-bind:entidades="tabelaSelecao.entidades"
                  @contadorProcSelUlt="contadorProcSelUlt($event)"
                  @contadorProcPreSelUlt="contadorProcPreSelUlt($event)"
                  @guardarTSProcUlt="guardarTSProcUlt($event)"
                  v-bind:procSelGuardados="tabelaSelecao.procUltimos"
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
      >-->
    </v-stepper>

    <!--<v-snackbar v-model="pedidoCriado" :color="'success'" :timeout="60000">
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
    </v-snackbar>-->
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import ContListaProcessosComuns from "@/components/tabSel/criacaoTSPluri/ContListaProcessosComuns.vue";
import ContListaProcessosEspecificos from "@/components/tabSel/criacaoTSPluri/ContListaProcessosEspecificos.vue";
import ContListaProcessosEspRestantes from "@/components/tabSel/criacaoTSPluri/ContListaProcessosEspRestantes.vue";
import ContListaProcessosUltimos from "@/components/tabSel/criacaoTSPluri/ContListaProcessosUltimos.vue";

export default {
    props: ["obj"],
    components: {
    DesSelEnt,
    SelEnt,
    ContListaProcessosComuns,
    ContListaProcessosEspecificos,
    ContListaProcessosEspRestantes,
    ContListaProcessosUltimos
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
      pedidoCriado: false,
      mensagemPedidoCriadoOK: "Pedido criado com sucesso: "
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
        var response = await axios.get(lhost + "/api/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });

        // Retira da lista de todas as entidades as que já pertencem a esta entidade
        for (var i = 0; i < this.tabelaSelecao.entidades.length; i++) {
          var index = this.entidades.findIndex(
            e => e.id === this.tabelaSelecao.entidades[i].id
          );
          this.entidades.splice(index, 1);
        }

        this.entSel = this.tabelaSelecao.entidades;

        for(var i = 0; i < this.tabelaSelecao.entidades.length; i++){
          if(this.tabelaSelecao.entidades[i].id === this.tabelaSelecao.idEntidade){
            this.entTip.push({
                sigla: this.tabelaSelecao.entidades[i].sigla,
                designacao: this.tabelaSelecao.entidades[i].designacao,
                id: this.tabelaSelecao.entidades[i].id
            });
            break;
          }
        }

        var index = this.entidades.findIndex(e => e.id === this.tabelaSelecao.idEntidade);
        this.entidades.splice(index, 1);
        var index2 = this.entSel.findIndex(e => e.id === this.tabelaSelecao.idEntidade);
        this.entSel.splice(index2, 1);
        
        this.entidadesReady = true;
      } catch (err) {
        return err;
      }
    },
    // Retira da lista as entidadesselecionadas
    unselectEntidade: function(entidade) {
      this.entidades.push(entidade);
      var index = this.entSel.findIndex(e => e.id === entidade.id);
      this.entSel.splice(index, 1);
    },
    // Coloca na lista as entidades selecionadas
    selectEntidade: function(entidade) {
      this.entSel.push(entidade);
      var index = this.entidades.findIndex(e => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },
    print: function(){
      console.log(this.tabelaSelecao)
    },
    // Carrega todos os processos comuns
    loadProcComuns: async function() {
      try {
        if (!this.listaProcComunsReady) {
          var response = await axios.get(lhost + "/api/classes?tipo=comum");
          for (var i = 0; i < response.data.length; i++) {
              for(var j = 0; j < this.tabelaSelecao.listaProcSel.procSelComuns.length; j++){
                  var estavaGuardado = false;
                  if ( this.tabelaSelecao.listaProcSel.procSelComuns[j] == response.data[i].codigo) {
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
              if(!estavaGuardado) {
                  this.listaProcComuns.push({
                      classe: response.data[i].codigo,
                      designacao: response.data[i].titulo,
                      dono: false,
                      participante: false
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
    guardarTSProcComuns: function(procComuns){
      if( Object.keys(procComuns) == "dono" ){
        for( var i = 0; i < this.listaProcComuns.length; i++){
          this.tabelaSelecao.procComuns[this.listaProcComuns[i].classe].dono = procComuns['dono'][this.listaProcComuns[i].classe]
        }
      }
      else {
        for( var j = 0; j < this.listaProcComuns.length; j++){
          this.tabelaSelecao.procComuns[this.listaProcComuns[j].classe].part = procComuns['part'][this.listaProcComuns[j].classe]
        }
      }
      console.log("Processos comuns da tabela de seleção")
      console.log(this.tabelaSelecao.procComuns)
    },
    // Carrega os processos específicos das entidades em causa
    loadProcEspecificos: async function() {
      try {
        if(!this.listaProcEspReady){
          var url = lhost + "/api/classes?tipo=especifico&ents=" 
          for( var i = 0; i < this.tabelaSelecao.entidades.length - 1; i++){
            url += this.tabelaSelecao.entidades[i].id + ",";
          }
          url += this.tabelaSelecao.entidades[i].id;
        }
        var response = await axios.get(url);
        for( var j = 0; j < response.data.length; j++){
          for(var k = 0; k < this.tabelaSelecao.listaProcSel.procSelEspecificos.length; k++){
                var estavaGuardado = false;
                if ( this.tabelaSelecao.listaProcSel.procSelEspecificos[k] == response.data[j].codigo) {
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
            if(!estavaGuardado) {
                this.listaProcEsp.push({
                    classe: response.data[j].codigo,
                    designacao: response.data[j].titulo,
                    dono: false,
                    participante: false
                });
            }
        }

      } catch (error) {
        return error;
      }
    },
    procPreSelEspecificos: function() {
      if(!this.listaProcEspReady){
        for( var i = 0; i < this.listaProcEsp.length; i++) {
          if( this.procPreSelResTravComum.includes(this.listaProcEsp[i].classe)){
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
    guardarTSProcEsp: function(procEsp){
      if( Object.keys(procEsp) == "dono" ){
        for( var i = 0; i < this.listaProcEsp.length; i++){
          this.tabelaSelecao.procEspecificos[this.listaProcEsp[i].classe].dono = procEsp['dono'][this.listaProcEsp[i].classe]
        }
      }
      else {
        for( var j = 0; j < this.listaProcEsp.length; j++){
          this.tabelaSelecao.procEspecificos[this.listaProcEsp[j].classe].part = procEsp['part'][this.listaProcEsp[j].classe]
        }
      }
      console.log(this.tabelaSelecao.procEspecificos)
    },
  },
  created: async function() {
    this.tabelaSelecao = this.obj.objeto;
    this.tabelaSelecao.procComuns = JSON.parse(this.tabelaSelecao.procComuns);
    this.tabelaSelecao.procEspecificos = JSON.parse(this.tabelaSelecao.procEspecificos);
    this.tabelaSelecao.procEspRestantes = JSON.parse(this.tabelaSelecao.procEspRestantes);
    this.tabelaSelecao.procUltimos = JSON.parse(this.tabelaSelecao.procUltimos);
    this.loadEntidades();
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