<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm20>
                <v-card class="panel panel-default panel-custom">
                    <v-toolbar class="panel-heading">
                        <v-toolbar-title class="page-header"><h1>{{ titulo }}</h1></v-toolbar-title>
                    </v-toolbar>
                <v-card-text class="panel-body">
                    <div class="form-group">
                    <table class="consulta">
                        <tr v-for="(item, index) in objeto" v-bind:key="index">
                            <td v-if="item.text" style="width:10%;">
                                <div class="info-label">{{ item.campo }}: </div>
                            </td>
                            <td v-if="item.text" style="width:80%;">
                                <a v-if="item.campo==='Link'" :href="item.text" target="_blank">
                                    {{ item.text }}
                                </a>
                                <div v-else> 
                                     {{ item.text }}
                                </div>
                            </td>
                        </tr>
                    </table>
                        <table class="consulta" v-if="lista">
                            <tr v-if="tipo==='Entidades'">
                                <td style="width:100%">
                                    <div class="info-label">Pertence às tipologias de Entidade: </div>
                                    <table>
                                        <tr>
                                            <td>
                                                <ul style="padding-left:20px;">
                                                    <li v-for="(l, index) in lista" v-bind:key="index"><a :href="'/tipologias/'+l.id">{{ l.sigla }} </a>- {{ l.designacao }}</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <h1>{{ objeto }}</h1>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: ["tipo", "objeto", "titulo", "lista"],
    methods: {
        preparaObj: async function() {
            try {

            }
            catch(e){
                console.log(e)
            }
        }
    },
    created: function() {
        this.preparaObj();
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

.consulta tr{
    vertical-align: top;
    border-bottom: 1px solid #ddd;
}

.consulta td{
    padding-left: 5px;
    padding-bottom: 5px;
    padding-top: 5px;
    align-content: center;
}

.consulta td:nth-of-type(2) {
    vertical-align: middle;
    padding-left: 15px;
}

.panel-info-custom .panel-body{
    font-size: 1pc;
    font-family: 'Times New Roman', Times, serif;
}

.panel-noticiabox .panel-body{
    font-size: 1pc;
}

.panel-linkbox .panel-body{
    padding-top: 5px !important;
    padding-left: 30px !important;
    padding-bottom: 10px;
}

li .panel-body{
    padding:0px;
}

li .panel-body li{
    margin-left:20px;
}

.info-label {
    color: #1A237E;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
}
</style>

