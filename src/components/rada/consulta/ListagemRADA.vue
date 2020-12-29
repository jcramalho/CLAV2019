<template>
  <v-card class="ma-8">
    <p class="content-title-1 mt-3">{{ titulo }}</p>
    <v-card-text>
      <div class="info-content pa-4">
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
          :items="lista"
          :search="search"
          :footer-props="footer_props"
        >

          <template v-slot:no-data>
              <p>Ainda não há instrumentos deste tipo carregados na plataforma.</p>
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
              <td>{{ props.item.data }}</td>
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.entidade }} ({{props.item.tipoEntidade}})</td>
              <td>{{ props.item.sumario }}</td>
              <td>{{ props.item.estado }}</td>
              <td>
                <v-btn text @click="$emit('ver', props.item.idRADA, tipo)"
                  ><v-icon>remove_red_eye</v-icon></v-btn
                >

                <v-btn v-if="(tipo=='RadaAntigo')&&(props.item.link.startsWith('CLAV'))" text 
                  :href="
                    pathAPI +
                    '/ficheirosEstaticos?caminho=documentos%2FRADA%2FDespacho' +
                    props.item.link.split('Despacho')[1] +
                    '&' +
                    authToken
                  ">
                    <v-icon color="#c62828">picture_as_pdf</v-icon>
                </v-btn>

                <v-btn v-else text @dblclick="$emit('download', props.item.idRADA, tipo)" @click="debug(props.item.link)"
                  ><v-icon color="#c62828">picture_as_pdf</v-icon></v-btn
                >
              </td>
            </tr>
          </template>
          <template v-slot:[`item.entidades`]="{ item }">
            <span v-for="(ent, index) in item.entidades" :key="index">{{ ent }}</span>
          </template>

          <template v-slot:pageText="props">
            Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
const lhost = require("@/config/global").host;

export default {
  props: ["lista", "titulo", "tipo"],
  data: () => ({
    pathAPI: "",
    authToken: "",
    search: "",
    headers: [
        {
            text: 'Data',
            value: 'data',
            align: "start",
            sortable: true,
            width: "13%",
            class: "subtitle-3",
        },
        {
            text: 'Tipo',
            value: 'tipo',
            align: "center",
            sortable: true,
            class: "subtitle-3",
        },
        {
            text: 'Número',
            value: 'numero',
            align: "start",
            sortable: true,
            width: "13%",
            class: "subtitle-3",
        },
        {
            text: 'Entidade',
            value: 'entidade',
            align: "start",
            sortable: true,
            width: "15%",
            class: "subtitle-3",
        },
        {
            text: 'Sumário',
            value: 'sumario',
            align: "start",
            sortable: false,
            width: "25%",
            class: "subtitle-3",
        },
        {
            text: 'Estado',
            value: 'estado',
            align: "start",
            sortable: true,
            width: "20%",
            class: "subtitle-3",
        }
    ],
    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar",
    },
  }),

  created: async function () {
    this.authToken = await this.$getAuthToken();
    this.authToken = this.authToken.replace(" ", "=");

    this.pathAPI = lhost;
  },
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
