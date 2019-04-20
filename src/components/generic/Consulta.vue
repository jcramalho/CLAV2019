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
                                <td v-if="item.text" style="width:20%;">
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
                            <!-- Consulta de Entidade: tipologias a que pertence -->
                            <tr v-if="tipo==='Entidades' && listaTip.length">
                                <td style="width:20%">
                                    <div class="info-label">Pertence às tipologias de Entidade: </div>
                                </td>
                                <td style="width:80%">
                                    <ul style="padding-left:20px;">
                                        <li v-for="(l, index) in listaTip" v-bind:key="index">
                                            <a :href="'/tipologias/'+l.id">{{ l.sigla }} </a>- {{ l.designacao }}
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <!-- Consulta de Entidade: Natureza de intervenção nos PNs -->
                            <tr v-if="tipo ==='Entidades' && (listaProcD.length)">
                                <td style="width:20%;">
                                    <div class="info-label">Natureza de intervenção nos Processos de Negócio: </div>
                                </td>
                                <td style="width:80%;">
                                    <table>
                                        <tr v-if="listaProcD.length">
                                            <td style="width:15%;"><label style="font-weight: bold;">Como Dono: </label></td>
                                            <td>
                                                <ul style="padding-left:5px;" :class="{'is-collapsed' : domainCollapsed }">
                                                    <li v-for="(l, index) in listaProcD" v-bind:key="index">
                                                        <a :href="'/classes/consultar/'+l.id">{{ l.codigo }} </a>- {{ l.titulo }}
                                                    </li>
                                                </ul>
                                                <a @click="domainCollapsed=!domainCollapsed" v-if="listaProcD.length>6">
                                                    <span v-if="domainCollapsed" style="color:#4d94ff;">Mostrar mais...</span>
                                                    <span v-else style="color:#4d94ff;">Mostrar menos...</span>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr v-if="parts">
                                            <td style="width:25%;"><label style="font-weight: bold;">Como Participante: </label></td>
                                            <td>
                                                <ul v-for="(key, index) in Object.keys(listaProcP)" v-bind:key="index" style="padding-left:5px;">
                                                    <li  v-if="listaProcP[key].length>0" >
                                                        <b v-if="listaProcP[key].length>0">{{ participationsDic[key] }}:</b>
                                                            <ul :class="{'is-collapsed' : partsCollapsed[key] }">
                                                                <li v-for="(p, index) in listaProcP[key]" v-bind:key="index">
                                                                    <a :href="'/classes/consultar/c'+p.codigo">{{ p.codigo }}</a> - {{ p.titulo }}
                                                                </li>
                                                            </ul>
                                                            <a @click="partsCollapsed[key]=!partsCollapsed[key]" v-if="listaProcP[key].length>6">
                                                                <span v-if="partsCollapsed[key]" style="color:#4d94ff;">Mostrar mais...</span>
                                                                <span v-else style="color:#4d94ff;">Mostrar menos...</span>
                                                            </a>
                                                    </li>
                                                </ul>
                                                
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Consulta de Tipologia: processos em que a tipologia atua como dona -->
                            <tr v-if="tipo==='Tipologias' && listaProcD.length">
                                <td style="width:20%;">
                                    <div class="info-label">Dono de: </div>
                                </td>
                                <td style="width:80%;">
                                    <ul style="padding-left:20px;" :class="{'is-collapsed' : domainCollapsed }">
                                        <li v-for="(l, index) in listaProcD" v-bind:key="index">
                                            <a :href="'/classes/consultar/'+l.id">{{ l.codigo }} </a>- {{ l.titulo }}
                                        </li>
                                    </ul>
                                    <a @click="domainCollapsed=!domainCollapsed" v-if="listaProcD.length>6">
                                        <span v-if="domainCollapsed" style="color:#4d94ff;">Mostrar mais...</span>
                                        <span v-else style="color:#4d94ff;">Mostrar menos...</span>
                                    </a>
                                </td>
                            </tr>
                            <!-- Consulta de Tipologia: entidades pertencentes à Tipologia -->
                            <tr v-if="tipo==='Tipologias' && listaEnt.length">
                                <td style="width:10%:">
                                    <div class="info-label">Entidades:</div>
                                </td>
                                <td style="width:80%;">
                                    <ul style="padding-left:20px;" :class="{'is-collapsed' : entCollapsed }">
                                        <li v-for="(l, index) in listaEnt" v-bind:key="index">
                                            <a :href="'/entidades/'+l.id">{{ l.sigla }} </a>- {{ l.designacao }}
                                        </li>
                                    </ul>
                                    <a @click="entCollapsed=!entCollapsed" v-if="listaEnt.length>6">
                                        <span v-if="entCollapsed" style="color:#4d94ff;">Mostrar mais...</span>
                                        <span v-else style="color:#4d94ff;">Mostrar menos...</span>
                                    </a>
                                </td>
                            </tr>
                            <!-- Consulta de legislação: processos regulados -->
                            <tr v-if="tipo==='Legislação' && listaReg.length">
                                <td style="width:20%">
                                    <div class="info-label">Regula os processos de negócio:  </div>
                                </td>
                                <td style="width:80%;">
                                    <ul style="padding-left:20px;">
                                        <li v-for="(l, index) in listaReg" v-bind:key="index">
                                            <a :href="'/classes/consultar/'+l.id">{{ l.codigo }} </a>- {{ l.titulo }}
                                        </li>
                                    </ul>
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
    props: ["tipo", "objeto", "titulo", "listaTip", "listaProcD", "listaProcP", "listaEnt", "listaReg", "parts"],
    data: () => ({
        domainCollapsed: true,
        entCollapsed: true,
        partsCollapsed: {
            Apreciador: true,
            Assessor: true,
            Comunicador: true,
            Decisor: true,
            Executor: true,
            Iniciador: true,
        }, 
        participationsDic: {
            Apreciador: "Apreciar",
            Assessor: "Assessorar",
            Comunicador: "Comunicar",
            Decisor: "Decidir",
            Executor: "Executar",
            Iniciador: "Iniciar"
        },
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

.info-label {
    color: #1A237E;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
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

.is-collapsed li:nth-child(n+5) {
    display: none;
}
</style>

