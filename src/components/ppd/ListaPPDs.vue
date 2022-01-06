<template>
  <v-card>
    <div class="info-content">
      <v-tooltip top color="info" open-delay="500">
        <template v-slot:activator="{ on }">
          <v-text-field
            v-on="on"
            v-model="search"
            append-icon="search"
            label="Procurar / filtrar"
            text
            single-line
            hide-details
            clearable
            color="blue darken-3"
            class="mt-n2 mb-3 mx-6 font-weight-medium"
          ></v-text-field>
        </template>

        <span> Filtrar </span>
      </v-tooltip>

      <v-data-table
        class="content-table"
        :headers="headers"
        :items="lista.data"
        :search="search"
        :footer-props="footer_props"
      >
        <template v-slot:no-data>
          <p>Ainda não há PPDs carregados na plataforma.</p>
        </template>

        <template v-slot:no-results>
          <v-alert
            :value="true"
            color="error"
            icon="warning"
            class="font-weight-medium my-3"
            id="alerta-erro"
            >Não foram encontrados resultados para "{{ search }}".</v-alert
          >
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.geral.nomePPD }}</td>
            <td>{{ props.item.geral.entSel.join(",")}}</td>
            <td>{{ props.item.geral.fonteLegitimacao.titulo.split("-")[0]}}</td>
             <td>
              <v-btn small color="blue darken-2" dark rounded @click="go(props.item)">
                <v-icon dark>visibility</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script>
const lhost = require("@/config/global").host;

import ConsultaPPD from "@/components/ppd/ConsultaPPD.vue"

export default {
  props: [],
  components: {
    ConsultaPPD
  },
  data: () => ({
    lista: [],
    pathAPI: "",
    authToken: "",
    search: "",
    headers: [
      {
        text: "Título",
        value: "geral.nomePPD",
        align: "start",
        sortable: true,
      },
      {
        text: "Entidades",
        value: "geral.entidades",
        sortable: true,
      },
      {
        text: "Fonte de legitimação",
        value: "geral.fonteLegitimacao.titulo",
        sortable: true,
      },
      {
        text: "Ver",
        value: "ver",
      },
    ],
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar",
    },
  }),

  created: async function () {
    var auxEnt = []
    this.lista = await this.$request("get", "/ppd")
    Object.values(this.lista.data).forEach(val => {
      auxEnt = []
      Object.values(val.geral.entSel).forEach(ent => {
        auxEnt.push(ent.sigla)
      });
      val.geral.entSel = auxEnt
    });
    this.authToken = await this.$getAuthToken();
    this.authToken = this.authToken.replace(" ", "=");
    this.pathAPI = lhost;
  },
  methods:{
    go: function(item) {
      this.$router.push(`/ppd/${item._id}`);
    },
  }
};
</script>

<style scoped>
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}

.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px 10px 0 0;
}
</style>
