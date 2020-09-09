<template>
<!-- BLOCO DESCRITIVO -->
<v-expansion-panel popout>
    <v-expansion-panel-header style="outline: none;" :class="{
        'text-center': $vuetify.breakpoint.smAndDown,
        'text-left': $vuetify.breakpoint.mdAndUp
      }" class="pa-0">
        <div :class="{
          'px-3': $vuetify.breakpoint.mdAndUp
        }" class="separador">
            <unicon class="mt-3" name="descricao-icon" width="20" height="20" viewBox="0 0 20.71 23.668" fill="#ffffff" />
            <span class="ml-3 mr-1">Descritivo da Classe</span>
            <InfoBox header="Descritivo da Classe" :text="myhelp.Classe.BlocoDescritivo" helpColor="info" />
        </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
        <v-row>
            <!-- DESCRIÇÂO -->
            <v-col cols="2">
                <div class="info-label">
                    Descrição
                    <InfoBox header="Descrição" :text="myhelp.Classe.Campos.Descricao" helpColor="indigo darken-4" />
                </div>
            </v-col>
            <v-col>
                <v-textarea v-model="c.descricao" label="Descrição" rows="2" solo clearable auto-grow></v-textarea>
                <!--v-text-field v-model="c.descricao" label="Descrição" solo clearable></v-text-field-->
            </v-col>
        </v-row>

        <hr style="border-top: 1px dashed #dee2f8;" />

        <BlocoDescritivoNotasAp :c="c" />

        <div v-if="c.nivel > 2">
            <hr style="border-top: 1px dashed #dee2f8;" />
            <BlocoDescritivoExemplosNotasAp :c="c" />
        </div>

        <hr style="border-top: 1px dashed #dee2f8;" />

        <BlocoDescritivoNotasEx :c="c" />

        <div v-if="c.nivel == 3 && !c.temSubclasses4Nivel">
            <hr style="border-top: 1px dashed #dee2f8;" />
            <TermosIndiceOps :c="c" />
        </div>
    </v-expansion-panel-content>
</v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import BlocoDescritivoNotasAp from "@/components/classes/criacao/BlocoDescritivoNotasAp.vue";
import BlocoDescritivoExemplosNotasAp from "@/components/classes/criacao/BlocoDescritivoExemplosNotasAp.vue";
import BlocoDescritivoNotasEx from "@/components/classes/criacao/BlocoDescritivoNotasEx.vue";
import TermosIndiceOps from "@/components/classes/criacao/TermosIndiceOps.vue";
import InfoBox from "@/components/generic/infoBox.vue";

export default {
    props: ["c"],

    components: {
        BlocoDescritivoNotasAp,
        BlocoDescritivoExemplosNotasAp,
        BlocoDescritivoNotasEx,
        TermosIndiceOps,
        InfoBox
    },

    data() {
        return {
            myhelp: help
        };
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

.separador {
    color: white;
    font-weight: 400;
    padding: 5px;
    margin: 5px;
    width: 100%;
    min-height: 55px;
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
    font-size: 14pt;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
}

#expanded-content {
    margin-left: 5px;
    margin-top: -1.1rem;
    border: 1px solid #dee2f8;
    border-radius: 0 0 10px 10px;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}

.is-collapsed li:nth-child(n + 5) {
    display: none;
}
</style>
