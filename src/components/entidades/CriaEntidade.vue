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
                                            v-model="entidade.designacao"
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
                                            v-model="entidade.sigla"
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
                                        v-model="entidade.internacional"
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
                                            v-model="entidade.sioe"
                                            maxlength="12"
                                            :rules="regraSIOE"
                                            mask="############"
                                        ></v-text-field>
                                </td>
                            </tr>
                        </table>
                        <v-expansion-panel>
                            <v-expansion-panel-content class="expansion-panel-heading">
                                <template v-slot:header>
                                    <div class="subheading font-weight-bold">
                                        Pertence às Tipologias de Entidade
                                    </div>
                                </template>
                                <v-card  style="padding-top:30px;">
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
                    </div>
                </v-card-text>
                <v-snackbar
                    v-model="snackbar"
                    :timeout=8000
                    color="error"
                    :top="true">
                    {{ text }}
                    <v-btn flat @click="fecharSnackbar">Fechar</v-btn>
                </v-snackbar>
                </v-card>
                <div style="text-align:center">
                        <v-btn medium color="primary" @click="submeter()" :disabled="!(entidade.designacao && entidade.sigla)">Submeter Entidade</v-btn>
                </div>
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
        entidade: {
            designacao: '',
            sigla: '',
            internacional: '',
            sioe: '',
            tipologiasSel: [],
            codigo: '',
        },

        // Para o seletor de processos
        tipologias: [],
        tipSel: [],
        tipologiasReady: false,

        regraSIOE: [
					v => /^[0-9]*$/.test(v) || 'Apenas são aceites caracteres numéricos.'
                ],

        snackbar: false,
        text: '',
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
        // fechar o snackbar em caso de erro
        fecharSnackbar(){
				this.snackbar = false;
		},
        submeter: function () {
            for(var i = 0; i< this.tipSel.length; i++){
                this.entidade.tipologiasSel[i] = this.tipSel[i].id
            }

            if (this.entidade.internacional == ''){
                this.entidade.internacional = "Não"
            }

            if( !(/^[0-9]*$/.test(this.entidade.sioe))){
                this.text = "O campo 'SIOE' está no formato errado."
                this.snackbar = true;
                return false;
            }
            
            var dataObj = this.entidade;

            dataObj.codigo = "ent_" + this.entidade.sigla;

            console.log(dataObj)

            axios.post(lhost + "/api/entidades/", dataObj).then( res => {
                console.log(res)
                this.$router.push('/pedidos/submissao');
            }).catch(function (err) {
					this.text = err;
					this.color = 'error';
					this.snackbar = true;
				});
        }
    },
    created: function() {
        this.loadTipologias();
    },
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