<template>
  <v-card class="ma-4" flat>
    <CampoCLAV v-for="(item, index) in objeto" :key="index" color="neutralpurple" :nome="item.campo"
      :infoHeader="item.campo" :infoBody="myhelp.Legislacao.Campos[item.campo]" class="mb-3">>
      <template v-slot:conteudo>

        <v-row v-if="
          (item.text instanceof Array && item.text.length > 0) ||
          (!(item.text instanceof Array) &&
            item.text !== null &&
            item.text !== '' &&
            item.text !== undefined)
        ">

          <v-col v-if="item.text" align="left">
            <div v-if="(item.campo === 'Link') && (item.text.startsWith('CLAV'))">
              <a :href="pathAPI + '/ficheirosEstaticos?caminho=documentos%2FRADA%2FDespacho' + item.text.split('Despacho')[1] + '&' + authToken"
                target="_blank">{{ item.text }}</a>
            </div>
            <div v-else-if="item.campo === 'Link'">
              <a :href="item.text" target="_blank">{{ item.text }}</a>
            </div>
            <div v-else-if="item.campo === 'Entidades'">
              <ul>
                <li v-for="(ent, i) in item.text" :key="i">
                  <a :href="'/entidades/ent_' + ent.sigla">{{ ent.sigla }}</a>
                </li>
              </ul>
            </div>
            <div v-else>{{ item.text }}</div>
          </v-col>
        </v-row>
      </template>
    </CampoCLAV>
    <!-- Consulta de legislação: processos regulados -->
    <CampoCLAV v-if="listaReg.length" color="neutralpurple" nome="Processos de negócio que regula ou enquadra"
      infoHeader="Processos de negócio que regula ou enquadra" :infoBody="myhelp.Legislacao.Campos.ProcessosRegulados"
      class="mb-3">>
      <template v-slot:conteudo>
        <v-row>
          <v-col align="left">
            <ul>
              <li v-for="(l, index) in listaReg" v-bind:key="index">
                <a :href="'/classes/consultar/' + l.id">{{ l.codigo }}</a>
                - {{ l.titulo }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </template>
    </CampoCLAV>
  </v-card>
</template>

<script>
const help = require("@/config/help").help;
const lhost = require("@/config/global").host;
import CampoCLAV from "@/components/generic/CampoCLAV.vue";

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
    CampoCLAV,
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

    pathAPI: "",
    authToken: "",
    ready: false
  }),

  created: async function () {
    this.authToken = await this.$getAuthToken();
    this.authToken = this.authToken.replace(" ", "=");

    this.pathAPI = lhost;
    this.ready = true;
  }
};
</script>

<style>
.info-label {
  color: #283593;
  /* indigo darken-3 */
  padding: 5px;
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
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
