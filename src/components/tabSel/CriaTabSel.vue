<template>
    <v-container grid-list-md fluid>
        <v-stepper v-model="stepNo" vertical>
            <v-progress-linear v-model="valorBarra"></v-progress-linear>
            <v-stepper-step :complete="stepNo > 1" step="1">
            Designação
            <small>Designação da Nova Tabela de Seleção</small>
            </v-stepper-step>
            <v-stepper-content step="1">
                <v-flex xs12 sm6 md3>
                    <v-text-field
                        placeholder="Nome da entidade associada ao utilizador"
                        v-model="estado.nome"
                    ></v-text-field>
                </v-flex>
            <v-btn color="primary" @click="stepNo = 2; barra(25)">Continuar</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepNo > 2" step="2">Tipo da Tabela de Seleção</v-stepper-step>

            <v-stepper-content step="2">
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
                                <v-btn medium v-if="infoButton" color="info" @click="passos(); estado.passoN = stepNo; estado.percent = valorBarra">
                                    <v-icon left>info</v-icon>Informações sobre os seguintes passos
                                </v-btn>
                            </v-flex>
                        </v-flex>
                    </v-layout>
                </v-container>
            <v-btn color="primary" @click="stepNo = 2.5; barra(33)" v-if="estado.tipo == 'Pluriorganizacional'">Continuar</v-btn>
            <v-btn color="primary" @click="stepNo = 3; barra(50)" v-else>Continuar</v-btn>
            <v-btn flat @click="stepNo = 1; barra(0)" >Voltar</v-btn>
            </v-stepper-content>

            <v-stepper-step v-if="estado.tipo == 'Pluriorganizacional'" :complete="stepNo > 3" step="2.5">Indique as entidades abrangidas pela TS:</v-stepper-step>
            <v-stepper-content step="2.5">
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
            <v-btn color="primary" @click="stepNo = 3; barra(50)">Continuar</v-btn>
            <v-btn flat @click="stepNo = 2; barra(25)">Voltar</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepNo > 3" step="3">Processos Comuns</v-stepper-step>
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
                            <ListaProcessos v-bind:lista="procComuns"
                                            tipo="Processos Comuns"/>       
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-flex>
            </v-layout>
            <v-btn color="primary" @click="stepNo = 4; barra(75); printEstado()">Continuar</v-btn>
            <v-btn flat @click="stepNo = 2.5; barra(33)" v-if="estado.tipo == 'Pluriorganizacional'">Voltar</v-btn>
            <v-btn flat @click="stepNo = 2; barra(25)" v-else>Voltar</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="stepNo > 4" step="4">Processos Específicos</v-stepper-step>
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
                            <ListaProcessos v-bind:lista="procEsp"
                                            tipo="Processos Especificos"/>       
                        </v-expansion-panel-content>
                    </v-expansion-panel>
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
import ListaProcessos from '@/components/tabSel/ListaProcessos.vue';

const lhost = require('@/config/global').host

  export default {
    computed: {
        estado() {
            return this.$store.state.criacaoTabSel
        }
    },
    components: {
        ListaProcessos
    },
    data () {
      return {
        stepNo: 1,
        items: ['Organizacional', 'Pluriorganizacional'],
        entidades: [],
        procComuns: [],
        procEsp: [],
        infoButton: false,
        valorBarra: 0
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
        loadClasses: async function () {
            try{
                var response = await axios.get(lhost + "/api/classes?tipo=comum");
                console.log(response);
                var id=0;
                for(var i=0; i < response.data.length; i++){
                    this.procComuns.push({
                        classe: response.data[i].codigo ,
                        designacao: response.data[i].titulo,
                        dono: false,
                        participante: false
                    });
                }
                console.log(this.procComuns)
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
        }
    },
    created: function() {
        this.loadEntidades();
        this.loadClasses();
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
