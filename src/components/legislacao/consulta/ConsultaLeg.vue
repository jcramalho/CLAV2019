<template>
  <v-card class="ma-4">
    <v-card-title class="indigo darken-4 white--text">
      {{ titulo }}
    </v-card-title>

    <v-card-text>
      <div v-for="(item, index) in objeto" :key="index">
        <v-row
          v-if="
            (item.text instanceof Array && item.text.length > 0) ||
              (!(item.text instanceof Array) &&
                item.text !== null &&
                item.text !== '' &&
                item.text !== undefined)
          "
        >
          <v-col cols="2" v-if="item.text">
            <div class="info-label">
              {{ item.campo }}

              <InfoBox
                v-if="item.tipo === 'Legislação'"
                :header="item.campo"
                :text="myhelp.Legislacao.Campos[item.campo]"
              />
            </div>
          </v-col>

          <v-col v-if="item.text">
            <div v-if="item.campo === 'Link'" class="info-content">
              <a :href="item.text" target="_blank">{{ item.text }}</a>
            </div>
            <div v-else-if="item.campo === 'Entidades'" class="info-content">
              <ul>
                <li v-for="(ent, i) in item.text" :key="i">
                  <a :href="'/entidades/ent_' + ent.sigla">{{ ent.sigla }}</a>
                </li>
              </ul>
            </div>
            <div v-else class="info-content">{{ item.text }}</div>
          </v-col>
        </v-row>
      </div>

      <!-- Consulta de legislação: processos regulados -->
      <v-row v-if="listaReg.length">
        <v-col cols="2">
          <div class="info-label">
            Processos de negócio que regula ou enquadra:
            <InfoBox
              header="Processos de negócio que regula ou enquadra"
              :text="myhelp.Legislacao.Campos.ProcessosRegulados"
              helpColor="indigo darken-4"
            />
          </div>
        </v-col>
        <v-col>
          <ul class="info-content">
            <li v-for="(l, index) in listaReg" v-bind:key="index">
              <a :href="'/classes/consultar/' + l.id">{{ l.codigo }}</a>
              - {{ l.titulo }}
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-spacer />

      <v-row>
        <v-col>
          <v-btn
            class="indigo accent-4 white--text mr-4"
            @click="$router.go(-1)"
            >Voltar</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
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
    "parts",
  ],
  components: {
    InfoBox,
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
      Iniciador: true,
    },
    participationsDic: {
      Apreciador: "Apreciar",
      Assessor: "Assessorar",
      Comunicador: "Comunicar",
      Decisor: "Decidir",
      Executor: "Executar",
      Iniciador: "Iniciar",
    },
    myhelp: help,
  }),
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
