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
                            :items="items"
                            label="Tipo"
                            v-model="estado.tipo"
                            ></v-select>
                            <v-flex xs12 sm3>
                                <v-btn medium @click="infoButton=true" v-if="!infoButton" icon color="info">
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
                @click="stepNo = 1.5; barra(12.5); loadEntidades();" 
                v-if="estado.tipo == 'Pluriorganizacional'" 
                :disabled="!estado.tipo">
                    Continuar
            </v-btn>
            <v-btn 
                color="primary" 
                @click="stepNo = 1.5; barra(12.5); loadTipologias();" 
                v-else 
                :disabled="!estado.tipo">
                    Continuar
            </v-btn>
            </v-stepper-content>

            <v-stepper-step v-if="estado.tipo == 'Pluriorganizacional'" :complete="stepNo > 1.5" step="1.5">Entidades abrangidas pela TS</v-stepper-step>
            <v-stepper-content step="1.5" v-if="estado.tipo == 'Pluriorganizacional'">
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
            <v-btn color="primary" @click="stepNo = 2; barra(25);">Continuar</v-btn>
            <v-btn flat @click="stepNo = 1; barra(0)">Voltar</v-btn>
            </v-stepper-content>

            <v-stepper-step v-if="estado.tipo == 'Organizacional'" :complete="stepNo > 1.5" step="1.5">Tipologias de entidade a que pertence</v-stepper-step>
            <v-stepper-content step="1.5" v-if="estado.tipo == 'Organizacional'">
            <v-expansion-panel>
                <v-expansion-panel-content class="expansion-panel-heading">
                    <template v-slot:header>
                        <div class="subheading font-weight-bold">
                            Selecione as Tipologias de Entidade a que pertence
                        </div>
                    </template>
                    <v-card  style="padding-top:30px;">
                        <v-layout>
                        <v-flex xs2>
                            <v-subheader style="border-color: white; border-style:solid; color: #1A237E;">Tipologias da entidade:</v-subheader>
                        </v-flex>
                        <v-flex xs9>
                            <v-data-table
                                :headers="[
                                            { text: 'Sigla', align: 'left', value: 'sigla'},
                                            { text: 'Designação', value: 'designacao' },
                                        ]"
                                :items="tipEnt"
                                class="elevation-1"
                                hide-actions
                            >
                                <template v-slot:items="props">
                                    <tr>
                                        <td>{{ props.item.sigla }}</td>
                                        <td> {{ props.item.designacao }} </td>
                                    </tr>
                                </template>
                            </v-data-table>        
                        </v-flex>
                        </v-layout>
                        <DesSelTip
                            :tipologias="tipSel" 
                            @unselectTipologia="unselectTipologia($event)"
                        />

                        <hr style="border-top: 1px dashed #dee2f8;"/>

                        <SelTip
                            :tipologiasReady="tipologiasReady"
                            :tipologias="tipologias"
                            @selectTipologia="selectTipologia($event)"
                        />
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-btn color="primary" @click="stepNo = 2; barra(25); guardarTip(); printEstado(); loadProcEspecificos();">Continuar</v-btn>
            <v-btn flat @click="stepNo = 1; barra(0)">Voltar</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepNo > 2" step="2">Designação
            <small>Designação da Nova Tabela de Seleção</small>
            </v-stepper-step>
            <v-stepper-content step="2">
                <v-flex xs12 sm6 md3 v-if="estado.tipo === 'Organizacional'">
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
            <v-btn color="primary" @click="stepNo = 3; barra(50)">Continuar</v-btn>
            <v-btn flat @click="stepNo = 1.5; barra(0)">Voltar</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepNo > 3" step="3">Processos Comuns
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
                            <ListaProcessosComuns v-bind:lista="procComuns"
                                            tipo="Processos Comuns"
                                            @aCalcular="aCalcular($event)"
                                            @contadorProcSel="contadorProcSel($event)"
                                            @contadorProcPreSelCom="contadorProcPreSelCom($event)"
                                            @uncheckProcSel="uncheckProcSel($event)"
                                            @procPreSelRestantes="procPreSelRestantes($event)"/>       
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-flex>
            </v-layout>
            <v-layout wrap>
                <v-flex xs3>
                    <v-text-field
                    label="Nº de processos selecionados"
                    :value="numProcSel"
                    ></v-text-field>
                </v-flex>
                <v-flex xs4 style="padding-left:60px;">
                    <v-text-field
                        v-if="!progressCalcular"
                        label="Nº de processos pré selecionados"
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
            <v-btn color="primary" @click="stepNo = 4; barra(75); printEstado(); procPreSelEspecificos()">Continuar</v-btn>
            <v-btn flat @click="stepNo = 2; barra(25)">Voltar</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepNo > 4" step="4">Processos Específicos
            <small>Processos específicos da entidade e tipologia em que se enquadra</small>
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
                            <ListaProcessosEspecificos v-bind:lista="procEsp"
                                            tipo="Processos Especificos"
                                            v-bind:listaPreSel="procPreSelRes"
                                            @aCalcular="aCalcular($event)"
                                            @contadorProcSel="contadorProcSel($event)"
                                            @contadorProcPreSelEsp="contadorProcPreSelEsp($event)"
                                            @uncheckProcSel="uncheckProcSel($event)"/>       
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-flex>
            </v-layout>
            <v-layout wrap>
                <v-flex xs3>
                    <v-text-field
                    label="Nº de processos selecionados"
                    :value="numProcSel"
                    ></v-text-field>
                </v-flex>
                <v-flex xs4 style="padding-left:60px;">
                    <v-text-field
                        v-if="!progressCalcular"
                        label="Nº de processos pré selecionados"
                        :value="numProcPreSelEsp"
                    ></v-text-field>
                    <v-progress-circular
                        v-else
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                </v-flex>
            </v-layout>
            <v-btn color="primary" @click="stepNo = 5; barra(75)">Continuar</v-btn>
            <v-btn flat @click="stepNo = 3; barra(50)">Voltar</v-btn>
            </v-stepper-content>

            <v-btn color="primary" v-if="stepNo > 4">Submeter</v-btn>
            <v-btn color="primary" v-else>Guardar trabalho</v-btn>
            <v-btn flat>Cancelar</v-btn>
        </v-stepper>
    </v-container>
</template>


<script>
import axios from 'axios';
const lhost = require('@/config/global').host

import ListaProcessosComuns from '@/components/tabSel/ListaProcessosComuns.vue';
import ListaProcessosEspecificos from '@/components/tabSel/ListaProcessosEspecificos.vue';

import DesSelTip from '@/components/generic/selecao/DesSelecionarTipologias.vue'
import SelTip from '@/components/generic/selecao/SelecionarTipologias.vue'

  export default {
    computed: {
        estado() {
            return this.$store.state.criacaoTabSel
        }
    },
    watch: {
        'estado.tipo': function () {
            if( this.estado.tipo === 'Organizacional' ){
                this.infoUserEnt();
            }
            if( this.estado.tipo === 'Pluriorganizacional' ){
                this.estado.designacao = '';
            }
        }
        },
    components: {
        ListaProcessosComuns, ListaProcessosEspecificos, DesSelTip, SelTip
    },
    data () {
      return {
        stepNo: 1,
        items: ['Organizacional', 'Pluriorganizacional'],
        entidades: [],
        procComuns: [],
        procEsp: [],
        infoButton: false,
        valorBarra: 0,

        numProcSel: 0,
        numProcPreSelCom: 0,
        numProcPreSelEsp: 0,

        progressCalcular: false,

        // Para o seletor de processos
        tipologias: [],
        tipSel: [],
        tipEnt: [],
        tipologiasReady: false,

        procPreSelRes: [],
        procPreSelEsp: []
      }
    },
    methods: {
        passos: function(){
            this.$router.push('/ts/passos');
        },
        loadEntidades: async function () {
            try{
                var response = await axios.get(lhost + "/api/entidades");
                this.entidades = response.data.map(function (item) {
                    return {
                        label: item.sigla + " - " + item.designacao,
                        value: item.id.split('#')[1],
                    }
                    }).sort(function (a, b) {
                        return a.label.localeCompare(b.label);
                    });
            }
            catch(erro){
                console.log(erro);
            }
        },
        loadProcComuns: async function () {
            try{
                var response = await axios.get(lhost + "/api/classes?tipo=comum");
                for(var i=0; i < response.data.length; i++){
                    this.procComuns.push({
                        classe: response.data[i].codigo ,
                        designacao: response.data[i].titulo,
                        dono: false,
                        participante: false
                    });
                }
                return this.procComuns
            }
            catch(erro){
                console.log(erro);
            }
        },
        barra: async function (valor){
            this.valorBarra = valor;
        },
        printEstado: async function () {
            console.log(this.$store.state.criacaoTabSel)   
        },
        contadorProcSel: function () {
            this.numProcSel = this.numProcSel + 1;
        },
        contadorProcPreSelCom: function (lista) {
            this.numProcPreSelCom = lista.length;
        },
        contadorProcPreSelEsp: function (lista) {
            this.numProcPreSelEsp = lista.length;
        },
        uncheckProcSel: function () {
            this.numProcSel = this.numProcSel - 1;
        },
        procPreSelRestantes: function (procPreSelRestantes) {
            this.procPreSelRes = procPreSelRestantes;
        },
        // Processos pre selecionados especificos resultantes das travessias da tabela de processos comuns
        procPreSelEspecificos: function () {
            console.log(this.procEsp)
            for( var i = 0; i< this.procEsp.length; i++){
                if(this.procPreSelRes.includes(this.procEsp[i].classe)){
                    this.numProcPreSelEsp += 1;
                }
            }
        },
        // função que procura o nome da entidade e o id da Entidade associada ao utilizador
        infoUserEnt: async function () {
            var resUser = await axios.get(lhost + "/api/users/listarToken/" + this.$store.state.user.token);
            var resEnt = await axios.get(lhost + "/api/entidades/" + resUser.data.entidade);
            this.estado.designacao = resEnt.data.designacao;
            this.estado.idEntidade = resUser.data.entidade;
        },
        aCalcular: async function (bool) {
            this.progressCalcular = bool;
        },
        // Vai à API buscar todas as tipologias e as tipologias especificas da entidade do utilizador
        loadTipologias: async function () {
            try {
                var listaTip = [];

                var response = await axios.get(lhost + "/api/tipologias/")
                this.tipologias = response.data.map(function(item){
                        return {
                            sigla: item.sigla,
                            designacao: item.designacao,
                            id: item.id
                        }
                })
                this.tipologiasReady = true;

                // Tipologias onde a entidade se encontra
                var tipologias = await axios.get(lhost + "/api/entidades/" + this.estado.idEntidade + "/tipologias");
                this.tipEnt = tipologias.data.map(function(item){
                    return {
                        sigla: item.sigla,
                        designacao: item.designacao,
                        id: item.id
                    }
                })
                for( var i = 0; i < this.tipEnt.length; i++ ){
                    var index = this.tipologias.findIndex(e => e.id === this.tipEnt[i].id);
                    this.tipologias.splice(index,1);
                }
            } catch (error) {
                console.log(error);
            }
        },
        unselectTipologia: function(tipologia){
            // Recoloca a tipologia nos selecionáveis
            this.tipologias.push(tipologia);
            var index = this.tipSel.findIndex(e => e.id === tipologia.id);
            this.tipSel.splice(index,1);
        },
        selectTipologia: function(tipologia){
            this.tipSel.push(tipologia);
            // Remove dos selecionáveis
            var index = this.tipologias.findIndex(e => e.id === tipologia.id);
            this.tipologias.splice(index,1);
        },
        guardarTip: function(){
            this.estado.tipologias = this.tipSel;
        },
        loadProcEspecificos: async function() {
            try {
                var url = lhost + "/api/classes?tipo=especifico&ent=" + this.estado.idEntidade;
                if(this.estado.tipologias){
                    url += "&tips="
                    for( var i = 0; i<this.estado.tipologias.length - 1; i++ ){
                        url += this.estado.tipologias[i].id + ","
                    }
                    url += this.estado.tipologias[i].id
                }
                var response = await axios.get(url);
                for(var i=0; i < response.data.length; i++){
                    var jaExiste = false;
                    for(var j = 0; j < this.procEsp.length; j++ ){
                        if( this.procEsp[j].classe === response.data[i].codigo){
                            jaExiste = true;
                        }
                    }
                    if( !jaExiste ){
                        this.procEsp.push({
                            classe: response.data[i].codigo ,
                            designacao: response.data[i].titulo,
                            dono: false,
                            participante: false
                        });
                    }
                }
                return this.procEsp
            } catch (error) {
                console.log(error);
            }
        }
    },
    created: function() {
        this.loadProcComuns();
        if( this.$store.state.criacaoTabSel.passoN > "1") {
            this.stepNo =  this.$store.state.criacaoTabSel.passoN
            this.valorBarra =  this.$store.state.criacaoTabSel.percent
        }
    }
  }
</script>

<style>
    .expansion-panel-heading {
        color: #1a237e !important;
        background-image: linear-gradient(to bottom,#bac1eb 0,#8c9eff 100%);
    }
</style>
