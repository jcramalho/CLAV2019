<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm20>
                <v-card class="panel panel-default panel-custom">
                    <v-toolbar class="panel-heading">
                        <v-toolbar-title class="page-header"><h1>Novo Diploma</h1></v-toolbar-title>
                    </v-toolbar>
                <v-card-text class="panel-body">
                    <div class="form-group">
                        <table class="adicao" style="border-color: white; border-style:solid; margin-bottom:20px;">
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Tipo de diploma: </div>
                                </td>
                                <td style="width:80%;">
                                    <v-select
                                        v-model="legislacao.tipo"
                                        :items="tiposDiploma"
                                        solo
                                        dense
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Número: </div>
                                </td>
                                <td style="width:80%;">
                                        <v-text-field
                                            solo clearable
                                            counter="11"
                                            single-line
                                            v-model="legislacao.numero"
                                            maxlength="11"
                                            placeholder=" NNNNNN/AAAA"
                                            :rules="regraNumero"
                                        ></v-text-field>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Data: </div>
                                </td>
                                <td>
                                <v-flex xs12 lg6>
                                    <v-menu
                                        ref="open"
                                        v-model="open"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        lazy
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        max-width="290px"
                                        min-width="290px"
                                        >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                solo 
                                                v-model="dateFormatted"
                                                hint="AAAA/MM/DD"
                                                persistent-hint
                                                @blur="date = parseDate(dateFormatted)"
                                                v-on="on"
                                                :rules="regraData"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="date" no-title @input="open = false" :max="date"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Sumário: </div>
                                </td>
                                <td style="width:80%;">
                                        <v-text-field
                                            solo clearable
                                            counter="150"
                                            single-line
                                            v-model="legislacao.sumario"
                                        ></v-text-field>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Link: </div>
                                </td>
                                <td style="width:80%;">
                                        <v-text-field
                                            solo clearable
                                            single-line
                                            v-model="legislacao.link"
                                        ></v-text-field>
                                </td>
                            </tr>
                        </table>
                        <v-expansion-panel>
                            <v-expansion-panel-content class="expansion-panel-heading">
                                <template v-slot:header>
                                    <div class="subheading font-weight-bold">
                                        Entidade responsável pela publicação
                                    </div>
                                </template>
                                <v-card  style="padding-top:30px;">
                                    <DesSelEnt 
                                        :entidades="entSel" 
                                        tipo="legislacao"
                                        @unselectEntidade="unselectEntidade($event)"
                                    />

                                    <hr style="border-top: 1px dashed #dee2f8;"/>

                                    <SelEnt
                                        :entidadesReady="entidadesReady"
                                        :entidades="entidades"
                                        @selectEntidade="selectEntidade($event)"
                                    />
                                 </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-expansion-panel>
                            <v-expansion-panel-content class="expansion-panel-heading">
                                <template v-slot:header>
                                    <div class="subheading font-weight-bold">
                                        Regula os processos de negócio
                                    </div>
                                </template>
                                <v-card  style="padding-top:30px;">
                                    <DesSelProc
                                        :processos="procSel" 
                                        @unselectProcesso="unselectProcesso($event)"
                                    />

                                    <hr style="border-top: 1px dashed #dee2f8;"/>

                                    <SelProc
                                        :processosReady="processosReady"
                                        :processos="processos"
                                        @selectProcesso="selectProcesso($event)"
                                    />
                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </div>
                </v-card-text>
                </v-card>
                <div style="text-align:center">
                        <v-btn medium color="primary" :disabled="!(legislacao.sumario && legislacao.numero)" @click="submeter()">Submeter Diploma</v-btn>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import DesSelEnt from '@/components/generic/selecao/DesSelecionarEntidades.vue'
import SelEnt from '@/components/generic/selecao/SelecionarEntidades.vue'

import DesSelProc from '@/components/generic/selecao/DesSelecionarPNs.vue'
import SelProc from '@/components/generic/selecao/SelecionarPNs.vue'

import axios from 'axios';
const lhost = require('@/config/global').host

export default {
    data: vm => ({
        legislacao: {
            numero: '',
            sumario: '',
            tipo: '',
            link: '',
            entidades: [],
            processos: [],
        },
        

        tiposDiploma: [],

        // Para o seletor de entidades
        entidades: [],
        entSel: [],
        entidadesReady: false,

        // vuetify datepicker
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        open: false,

        // Para o seletor de processos
        processos: [],
        procSel: [],
        processosReady: false,

        // regras para submissão
        regraNumero: [
                    v => /[0-9]+(\-\w)?\/[0-9]\d{3}$/.test(v) || 'Este campo está no formato errado.',
                ],
        regraData: [
					v => /[0-9]+\/[0-9]+\/[0-9]+/.test(v) || 'Este campo está no formato errado.'
				],
    }),
    components: {
        DesSelEnt, SelEnt, DesSelProc, SelProc
    },
    // vuetify datepicker
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      }
    },
    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
        this.legislacao.data = this.dateFormatted;
      }
    },

    methods: {
        // vuetify datepicker
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${year}/${month}/${day}`
        },
        parseDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        // Vai a API buscar todos os tipos de diplomas legislativos
        loadTipoDiploma: async function () {
            try {
                var response = await axios.get(lhost + "/api/vocabularios/vc_tipoDiplomaLegislativo")
                for( var i = 0; i < response.data.length; i++){
                    this.tiposDiploma[i] = response.data[i].termo
                }
                this.tiposDiploma.sort()
            } catch (error) {
                console.log(erro)
            }
        },
        unselectEntidade: function(entidade){
            // Recoloca a entidade nos selecionáveis
            this.entidades.push(entidade);
            var index = this.entSel.findIndex(e => e.id === entidade.id);
            this.entSel.splice(index,1);
        },
        selectEntidade: function(entidade){
            this.entSel.push(entidade);
            // Remove dos selecionáveis
            var index = this.entidades.findIndex(e => e.id === entidade.id);
            this.entidades.splice(index,1);
        },
        // Vai à API buscar todas as entidades
        loadEntidades: async function () {
            try {
                var response = await axios.get(lhost + "/api/entidades")
                this.entidades = response.data.map(function (item) {
                        return {
                            sigla: item.sigla,
                            designacao: item.designacao,
                            id: item.id
                        }
                    })
                    this.entidadesReady = true
            } catch (error) {
                console.log(error)
            }    
        },
        unselectProcesso: function(processo){
            // Recoloca o processo nos selecionáveis
            this.processos.push(processo);
            var index = this.procSel.findIndex(e => e.id === processo.id);
            this.procSel.splice(index,1);
        },
        selectProcesso: function(processo){
            this.procSel.push(processo);
            // Remove dos selecionáveis
            var index = this.processos.findIndex(e => e.id === processo.id);
            this.processos.splice(index,1);
        },
        // Vai à API buscar todas as classes de nivel 3
        loadClasses: async function () {
            try {
                var response = await axios.get(lhost + "/api/classes?nivel=3")
                this.processos = response.data.map(function(item){
                    return {
                        codigo: item.codigo,
                        titulo: item.titulo,
                        id: item.codigo
                    }
                })
                this.processosReady = true
            } catch (error) {
                console.log(error);
            }
        },
        submeter: function () {
            for(var i = 0; i< this.entSel.length; i++){
                this.legislacao.entidades[i] = this.entSel[i].id
            }

            for(var i = 0; i< this.procSel.length; i++){
                this.legislacao.processos[i] = this.procSel[i].id
            }

            var parseAno = this.legislacao.numero.split("/");
            var anoDiploma = parseInt(parseAno[1]);

            if( anoDiploma<2000 ){
                this.regraNumero = [
                    v => /[0-9]+(\-\w)?\/[0-9]\d{1}$/.test(v) || 'Anos de diploma anteriores a 2000 devem ter apenas os dois últimos dígitos!',
                ]
            }

            var dataObj = this.legislacao;  

            console.log(dataObj)
        }
        /*

            

            for(let field in formats){
                if(!formats[field].test(this.diploma[field])){
                    if( anoDiploma<2000 ){
                        messageL.showMsg("Anos de diploma anteriores a 2000 devem ter apenas os dois últimos dígitos!");
                        return false;
                    }
                    messageL.showMsg("O campo " + field + " está no formato errado!");
                    return false;
                }
            }

            var date = new Date();

            var ano = parseInt(this.diploma.data.slice(0, 4));
            var mes = parseInt(this.diploma.data.slice(5, 7));
            var dia = parseInt(this.diploma.data.slice(8, 10));

            dias = [31,28,31,30,31,30,31,31,30,31,30,31]

            if( mes>12 ){
                messageL.showMsg("Mês inválido!")
                return false
            }
            if( dia > dias[mes-1]){
                if( ano % 4 == 0 && mes == 2 && dia == 29){}
                else{ 
                messageL.showMsg("Dia do mês inválido!")
                return false
                }
            }

            if( anoDiploma > parseInt(date.getFullYear()) ){
                messageL.showMsg("Ano de Diploma inválido!")
                return false
            }
            if( ano > parseInt(date.getFullYear()) ){
                messageL.showMsg("Ano inválido! Por favor selecione uma data anterior à atual");
                return false
            }
            if( ano == parseInt(date.getFullYear()) && mes > parseInt(date.getMonth() + 1) ){
                messageL.showMsg("Mês inválido! Por favor selecione uma data anterior à atual");
                return false
            }
            if( ano == parseInt(date.getFullYear()) && mes == parseInt(date.getMonth() + 1) && dia > parseInt(date.getDate()) ){
                messageL.showMsg("Dia inválido! Por favor selecione uma data anterior à atual");
                return false
            }


            let Link = new RegExp(/https?:\/\/.+/);

            if(!Link.test(this.diploma.link) && this.diploma.link!=""){
                this.diploma.link = "http://"+this.diploma.link;
            

            this.$http.post('/api/legislacao/', dataObj,{
                headers: {
                    'content-type' : 'application/json'
                }
            })
                .then( function() { 
                    this.$refs.spinner.hide();

                    window.location.href = '/pedidos/submissao';
                       
                })
                .catch( error => {if (error.status === 409 ){
                    messageL.showMsg(error.body);
                    this.$refs.spinner.hide();
                }  
                    console.error(error); 
                });
    },*/
    },
    created: function() {
        this.loadTipoDiploma();
        this.loadEntidades();
        this.loadClasses();
    }
}
</script>

<style>
.expansion-panel-heading {
        color: #1a237e !important;
        background-image: linear-gradient(to bottom,#e8eaf6 0,#8c9eff 100%);
}

.panel-custom .panel-heading {
    background-image: linear-gradient(to top,#e8eaf6 0,#c7cefa 100%);
}

.panel-custom .page-header {
    border: none;
    margin: 0;
    color: #1A237E;
}

.panel-custom .panel-default:hover {
    border-color: #8c9eff;
}

.adicao tr{
    vertical-align: top;
    border-bottom: 1px solid #ddd;
}

.adicao td{
    padding-left: 5px;
    padding-bottom: 5px;
    padding-top: 5px;
    align-content: center;
}

.adicao td:nth-of-type(2) {
    vertical-align: middle;
    padding-left: 15px;
}

.info-label {
    color: #1A237E;
    padding: 6px; 
    font-weight: 400;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
    margin: 5px;
}
        
</style>

