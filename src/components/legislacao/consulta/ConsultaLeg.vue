<template>
<v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
        <!-- HEADER -->
        <v-col class="py-0 my-0">
            <v-btn @click="goBack" rounded class="white--text mb-6" :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }" id="default-button">
                <unicon name="arrow-back-icon" width="20" height="20" viewBox="0 0 20.71 37.261" fill="#ffffff" />
                <p class="ml-2">Voltar</p>
            </v-btn>
            <v-card flat style="border-radius: 10px !important;">
                <p class="content-title-2 pa-5" :class="{
              'mb-n5': $vuetify.breakpoint.smAndDown,
              'mb-n4': $vuetify.breakpoint.mdAndUp
            }" style="color: #4da0d0 !important; text-align: center;">
                    {{ titulo }}
                </p>
                <!-- CONTENT -->
                <v-card-text class="px-8">
                    <v-row v-for="(item, index) in objetoFiltrado" v-bind:key="index" :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }">
                        <v-col cols="12" lg="2">
                            <div class="info-label">
                                {{ item.campo }}

                                <InfoBox v-if="item.tipo === 'Legislação'" :header="item.campo" :text="myhelp.Legislacao.Campos[item.campo]" helpColor="info" />
                            </div>
                        </v-col>

                        <v-col cols="12" lg="10" v-if="item.text">
                            <div v-if="item.campo === 'Link'" class="info-content pa-4">
                                <a :href="item.text" target="_blank">{{ item.text }}</a>
                            </div>
                            <div v-else-if="item.campo === 'Entidades'" style="min-height:60px;" class="info-content py-4 px-2">
                                <ul style="margin-bottom: 0 !important;">
                                    <li v-for="(ent, i) in item.text" :key="i">
                                        <a :href="'/entidades/ent_' + ent.sigla">{{
                        ent.sigla
                      }}</a>
                                    </li>
                                </ul>
                            </div>
                            <div v-else-if="item.campo === 'Estado'" class="info-content pa-4" :class="{
                    'texto-verde': item.text === 'Em vigor',
                    'texto-vermelho': item.text === 'Revogado'
                  }">
                                {{ item.text }}
                            </div>
                            <div v-else class="info-content pa-4">
                                {{ item.text }}
                            </div>
                        </v-col>
                    </v-row>

                    <!-- Consulta de legislação: processos regulados -->
                    <v-row v-if="listaReg.length" :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }">
                        <v-col cols="12" lg="2">
                            <div class="info-label">
                                Processos de negócio que regula ou enquadra:
                                <InfoBox header="Processos de negócio que regula ou enquadra" :text="myhelp.Legislacao.Campos.ProcessosRegulados" helpColor="info" />
                            </div>
                        </v-col>
                        <v-col cols="12" lg="10">
                            <div class="info-content py-4 px-2">
                                <ul style="margin-bottom: 0 !important;">
                                    <li v-for="(l, index) in listaReg" v-bind:key="index">
                                        <a :href="'/classes/consultar/' + l.id">{{ l.codigo }}</a>
                                        - {{ l.titulo }}
                                    </li>
                                </ul>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
const help = require("@/config/help").help;
import InfoBox from "@/components/generic/infoBox.vue";

export default {
    props: [
        "objeto",
        "titulo",
        "listaTip",
        "listaProcD",
        "listaProcP",
        "listaEnt",
        "listaReg",
        "parts"
    ],
    components: {
        InfoBox
    },
    data: () => ({
        domainCollapsed: true,
        entCollapsed: true,
        partsCollapsed: {
            Apreciador: true,
            Assessor: true,
            Comunicador: true,
            Decisor: true,
            Executor: true,
            Iniciador: true
        },
        participationsDic: {
            Apreciador: "Apreciar",
            Assessor: "Assessorar",
            Comunicador: "Comunicar",
            Decisor: "Decidir",
            Executor: "Executar",
            Iniciador: "Iniciar"
        },
        myhelp: help
    }),
    methods: {
        goBack() {
            this.$router.push("/legislacao/consultar");
        }
    },
    computed: {
        objetoFiltrado() {
            return Object.values(this.objeto).filter(obj => obj.text);
        }
    }
};
</script>

<style scoped>
.info-label {
    color: #1a237e !important;
    padding: 8px;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 6px;
    text-align: center;
}

.info-content {
    padding: 5px;
    width: 100%;
    background-color: #f1f6f8 !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 10px;
}

.texto-verde {
    color: #46c354 !important;
}

.texto-vermelho {
    color: #f44336 !important;
}
</style>
