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
                                        v-model="tipo"
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
                                            v-model="numero"
                                            maxlength="11"
                                            placeholder=" NNNNNN/AAAA"
                                        ></v-text-field>
                                        <!--pattern="[0-9]+(\-\w)?/[0-9]+"-->
                                </td>
                            </tr>
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Data: </div>
                                </td>
                                <!--datepicker(
                                value=""
                                @input="dataEscolhida($event)"
                                format="yyyy/MM/dd"
                                placeholder="AAAA/MM/DD"
                            )-->
                            </tr>
                            <!--<tr>
                                <td style="width:20%;">
                                    <div class="info-label">Entidade responsével pela publicação: </div>
                                </td>-->
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Sumário: </div>
                                </td>
                                <td style="width:80%;">
                                        <v-text-field
                                            solo clearable
                                            counter="150"
                                            single-line
                                            v-model="sumario"
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
                                            v-model="link"
                                        ></v-text-field>
                                </td>
                            </tr>
                            <!--<tr>
                                <td style="width:20%;">
                                    <div class="info-label">Regula os processos de negócio: </div>
                                </td>

                            </tr>-->
                        </table>
                    </div>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios';
const lhost = require('@/config/global').host

export default {
    data: () => ({
        numero: '',
        sumario: '',
        tipo: '',
        link: '',

        tiposDiploma: [],
    }),
    methods: {
        loadTipoDiploma: async function () {
            try {
                var response = await axios.get(lhost + "/api/vocabularios/vc_tipoDiplomaLegislativo")
                console.log(response)
                for( var i = 0; i < response.data.length; i++){
                    this.tiposDiploma[i] = response.data[i].termo
                    console.log(this.tiposDiploma[i])
                }
                this.tiposDiploma.sort()
            } catch (error) {
                console.log(erro)
            }
        },
    },
    created: function() {
        this.loadTipoDiploma();
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

