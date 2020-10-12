<template>
<v-list>
    <v-list-group v-for="item in auto.zonaControlo" :key="item.codigo" color="grey darken-1" no-action>
        <template v-slot:activator>
            <v-list-item-content class="info-label">
                <v-list-item-title v-if="item.codigo && item.referencia" v-text="
                item.codigo +
                ' - ' +
                item.referencia +
                ' - ' +
                item.titulo
            "></v-list-item-title>
                <v-list-item-title v-else-if="item.codigo" v-text="item.codigo + ' - ' + item.titulo"></v-list-item-title>
                <v-list-item-title v-else v-text="item.referencia + ' - ' + item.titulo"></v-list-item-title>
            </v-list-item-content>
        </template>
        <v-list-item-content>
            <v-list-item-title class="wrap-text">
                <v-row v-if="item.codigo">
                    <v-col cols="3">
                        <div class="info-label">Código da classe</div>
                    </v-col>
                    <v-col class="mt-2">
                        {{ item.codigo }}
                    </v-col>
                </v-row>
                <v-row v-if="item.referencia">
                    <v-col cols="3">
                        <div class="info-label">Referência</div>
                    </v-col>
                    <v-col class="mt-2">
                        {{ item.referencia }}
                    </v-col>
                </v-row>
                <v-row v-if="item.titulo">
                    <v-col cols="3">
                        <div class="info-label">Título</div>
                    </v-col>
                    <v-col class="mt-2">
                        {{ item.titulo }}
                    </v-col>
                </v-row>
                <v-row v-if="item.prazoConservacao">
                    <v-col cols="3">
                        <div class="info-label">Prazo de Conservação Administrativa</div>
                    </v-col>
                    <v-col class="mt-2">
                        <span v-if="item.prazoConservacao=='1'">{{ item.prazoConservacao }} Ano</span>
                        <span v-else>{{ item.prazoConservacao }} Anos</span>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col cols="3">
                        <div class="info-label">Prazo de Conservação Administrativa</div>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="item.prazo" label="Insira o PCA em Anos" hint="Exemplo: 10" filled solo dense clearable />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="3">
                        <div class="info-label">Destino Final</div>
                    </v-col>
                    <v-col>
                        {{item.destino}}
                    </v-col>
                </v-row>
                <div v-if="(tipo=='TS_LC' || tipo=='PGD_LC') && item.destino==='Conservação' || item.destino==='C'">
                    <v-row>
                        <v-col cols="3">
                            <div class="info-label">
                                Natureza de intervenção
                            </div>
                        </v-col>
                        <v-col class="mt-2">
                            Participante
                        </v-col>
                    </v-row>
                    <v-row v-if="tipo!='RADA_CLAV' && tipo!='RADA' && tipo!='PGD'">
                        <v-col cols="3">
                            <div class="info-label">Dono do PN</div>
                        </v-col>
                        <v-col>
                            <v-autocomplete label="Selecione as entidades donas do processo" :items="donos" v-model="item.dono" deletable-chips solo dense chips multiple></v-autocomplete>
                        </v-col>
                    </v-row>
                </div>
                <v-row>
                    <v-col cols="3">
                        <div class="info-label">Data de Início</div>
                    </v-col>
                    <v-col class="mt-2">
                        {{ item.dataInicio }}
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="3">
                        <div class="info-label">Data de Fim</div>
                    </v-col>
                    <v-col class="mt-2">{{ item.dataFim }}</v-col>
                </v-row>
                <v-row>
                    <v-col cols="3">
                        <div class="info-label">
                            N.º de agregações
                        </div>
                    </v-col>
                    <v-col v-if="item.agregacoes.length==0" class="mt-2">
                        <v-text-field v-model="item.nrAgregacoes" single-line dense />
                    </v-col>
                    <v-col v-else class="mt-2">{{ item.nrAgregacoes }}</v-col>
                </v-row>
                <v-row v-if="item.uiPapel">
                    <v-col cols="3">
                        <div class="info-label">
                            Medição das UI em papel (m.l.)
                        </div>
                    </v-col>
                    <v-col class="mt-2">{{ item.uiPapel }}</v-col>
                </v-row>
                <v-row v-if="item.uiDigital">
                    <v-col cols="3">
                        <div class="info-label">
                            Medição das UI em digital (Gb)
                        </div>
                    </v-col>
                    <v-col class="mt-2">{{ item.uiDigital }}</v-col>
                </v-row>
                <v-row v-if="item.uiOutros">
                    <v-col cols="3">
                        <div class="info-label">
                            Medição das UI noutros suportes
                        </div>
                    </v-col>
                    <v-col class="mt-2">{{ item.uiOutros }}</v-col>
                </v-row>
                <v-row style="margin:0px !important;">
                    <v-checkbox dense v-if="item.notasPCA" v-model="item.validaNotaPCA">
                        <template v-slot:label>
                            <span style="font-size: small">Confirmo que as agregações que pretendo eliminar cumprem a condição do PCA <b>"{{item.notasPCA}}"</b></span>
                        </template>
                    </v-checkbox>
                </v-row>
                <v-row style="margin:0px !important;">
                    <v-checkbox dense v-if="item.notaDF" v-model="item.validaNotaDF">
                        <template v-slot:label>
                            <span style="font-size: small">Confirmo que as agregações que pretendo eliminar cumprem a condição do DF <b>"{{item.notaDF}}"</b></span>
                        </template>
                    </v-checkbox>
                </v-row>
                <v-row style="margin:0px !important;" v-for="(just,index) in item.justificaDF" :key="index">
                    <v-checkbox dense v-if="(tipo=='TS_LC' || tipo=='PGD_LC') && item.destino=='CP'" v-model="item.validaJustificaDF">
                        <template v-slot:label>
                            <div style="font-size: small">Confirmo que as agregações que pretendo eliminar cumprem as condição de justificação do DF <b>"{{just}}"</b></div>
                        </template>
                    </v-checkbox>
                </v-row>
                <div class="ma-1" v-if="item.agregacoes.length>0">
                    <v-row justify="space-between" class="info-label">
                        <v-col>Lista de Agregações</v-col>
                        <v-col>
                            <v-text-field v-model="search" append-icon="search" label="Procura" single-line hide-details></v-text-field>
                        </v-col>
                    </v-row>
                    <Agregacoes v-bind:agregacoes="item.agregacoes" v-bind:df="item.destino" v-bind:pca="item.prazo" v-bind:dataInicio="item.dataInicio" v-bind:search="search" v-bind:tipo="tipo" />
                </div>
            </v-list-item-title>
        </v-list-item-content>
    </v-list-group>
</v-list>
</template>

<script>
import Agregacoes from "@/components/autosEliminacao/importacao/ListaAgregacoes.vue";

export default {
    props: ["auto", "donos", "submit", "tipo"],
    components: {
        Agregacoes
    },
    data: () => ({
        df: ["Eliminação", "Conservação"],
        search: ""
    })
};
</script>

<style>
.panel-custom .panel-heading {
    background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
    border: none;
    margin: 0;
    color: #1a237e;
}

.panel-custom .panel-default:hover {
    border-color: #1a237e;
}

.consulta tr {
    vertical-align: top;
    border-bottom: 1px solid #ddd;
}

.consulta td {
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
    color: #1a237e;
    /* indigo darken-4 */
    font-weight: 400;
    width: 100%;
    background-color: #e8eaf6;
    /* indigo lighten-5 */
    font-weight: bold;
    border-radius: 3px;
}

.info-content {
    padding: 5px;
    width: 100%;
    border: 1px solid #1a237e;
    border-radius: 3px;
}

.panel-info-custom .panel-body {
    font-size: 1pc;
    font-family: "Times New Roman", Times, serif;
}

.panel-noticiabox .panel-body {
    font-size: 1pc;
}

.panel-linkbox .panel-body {
    padding-top: 5px !important;
    padding-left: 30px !important;
    padding-bottom: 10px;
}

li .panel-body {
    padding: 0px;
}

li .panel-body li {
    margin-left: 20px;
}

.is-collapsed li:nth-child(n + 5) {
    display: none;
}

.wrap-text {
    -webkit-line-clamp: unset !important;
    white-space: normal;
}
</style>
