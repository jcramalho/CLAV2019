<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm20>
                <v-card class="panel panel-default panel-custom">
                    <v-toolbar class="panel-heading">
                        <v-toolbar-title class="page-header"><h1>Nova Entidade</h1></v-toolbar-title>
                    </v-toolbar>
                <v-card-text class="panel-body">
                    <div class="form-group">
                        <table class="adicao" style="border-color: white; border-style:solid; margin-bottom:20px;">
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Nome da Entidade: </div>
                                </td>
                                <td style="width:80%;">
                                        <v-text-field
                                            solo clearable
                                            counter="50"
                                            single-line
                                            v-model="designacao"
                                            maxlength="50"
                                        ></v-text-field>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Sigla: </div>
                                </td>
                                <td style="width:80%;">
                                        <v-text-field
                                            solo clearable
                                            counter="10"
                                            single-line
                                            v-model="sigla"
                                            maxlength="10"
                                        ></v-text-field>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Internacional: </div>
                                </td>
                                <td style="width:80%;">
                                    <v-select
                                        v-model="internacional"
                                        :items="['Sim', 'Não' ]"
                                        label="Não"
                                        solo
                                        dense
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">SIOE: </div>
                                </td>
                                <td style="width:80%;">
                                        <v-text-field
                                            solo clearable
                                            counter="12"
                                            single-line
                                            v-model="sioe"
                                            maxlength="12"
                                        ></v-text-field>
                                </td>
                            </tr>
                            <!--<tr>
                                <td style="width:20%;">
                                    <div class="info-label">Pertence às tipologias de entidade: </div>
                                </td>

                            </tr>-->
                        </table>
                        <hr style="border: 3px solid #dee2f8; border-radius: 2px;"/>
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
                    </div>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import DesSelTip from '@/components/generic/selecao/DesSelecionarTipologias.vue'
import SelTip from '@/components/generic/selecao/SelecionarTipologias.vue'

import axios from 'axios';
const lhost = require('@/config/global').host

export default {
    data: () => ({
        designacao: '',
        sigla: '',
        internacional: '',
        sioe: '',

        // Para o seletor de processos
        tipologias: [],
        tipSel: [],
        tipologiasReady: false,
    }),
    components: {
        DesSelTip, SelTip
    },
    methods:{
        // Vai à API buscar todas as tipologias
        loadTipologias: async function () {
            try {
                var response = await axios.get(lhost + "/api/tipologias/")
                this.tipologias = response.data.map(function(item){
                    return {
                        sigla: item.sigla,
                        designacao: item.designacao,
                        id: item.id
                    }
                })
                this.tipologiasReady = true
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
    },
    created: function() {
        this.loadTipologias();
    },
}

// campo internacional por default é "não"
</script>


<style>
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