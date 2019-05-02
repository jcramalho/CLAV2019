<template>
    <v-container grid-list-md fluid>
        <v-layout row wrap justify-center>
            <v-flex xs12 sm20>
                <v-card class="panel panel-default panel-custom">
                    <v-toolbar class="panel-heading">
                        <v-toolbar-title class="page-header"><h1>Nova Tipologia</h1></v-toolbar-title>
                    </v-toolbar>
                <v-card-text class="panel-body">
                    <div class="form-group">
                        <table class="adicao" style="border-color: white; border-style:solid; margin-bottom:20px;">
                            <tr>
                                <td style="width:20%;">
                                    <div class="info-label">Designação: </div>
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
                                    <div class="info-label">Entidades: </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        designacao: '',
        sigla: '',
    })
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