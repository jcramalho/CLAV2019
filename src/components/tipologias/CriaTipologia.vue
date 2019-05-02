<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm20>
                <v-card class="panel panel-default panel-custom">
                    <v-toolbar class="panel-heading">
                        <v-toolbar-title class="page-header"><h1>Nova Tipologia</h1></v-toolbar-title>
                    </v-toolbar>
                <v-card-text class="panel-body">
                    <div>
                        <table class="adicao" style="border-color: white; border-style:solid; margin-bottom:20px;">
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Designação: </div>
                                </td>
                                <td>
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
                                <td>
                                        <v-text-field
                                            solo clearable
                                            counter="10"
                                            single-line
                                            v-model="sigla"
                                            maxlength="10"
                                        ></v-text-field>
                                </td>
                            </tr>
                        </table>

                        <hr style="border: 3px solid #dee2f8; border-radius: 2px;"/>
                        
                        <DesSelEnt 
                                        :entidades="entSel" 
                                        @unselectEntidade="unselectEntidade($event)"
                                    />

                                    <hr style="border-top: 1px dashed #dee2f8;"/>

                                    <SelEnt
                                        :entidadesReady="entidadesReady"
                                        :entidades="entidades"
                                        @selectEntidade="selectEntidade($event)"
                                    />
                    </div>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import DesSelEnt from '@/components/generic/DesSelecionarEntidades.vue'
import SelEnt from '@/components/generic/SelecionarEntidades.vue'
import axios from 'axios';
const lhost = require('@/config/global').host

export default {
    data: () => ({
        designacao: '',
        sigla: '',
        entidades: [],
        entSel: [],
        entidadesReady: false
    }),
    components: {
        DesSelEnt, SelEnt
    },
    methods: {
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
    },
    created: function() {
        this.loadEntidades();
        console.log(this.entidades)
    }
}
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