<template>
  <v-card flat class="clav-info-content">
    <v-tooltip top color="info" open-delay="500">
      <template v-slot:activator="{ on }">
        <v-text-field
          v-on="on"
          v-model="search"
          append-icon="search"
          label="Procurar / filtrar tabela"
          text
          single-line
          hide-details
          clearable
          color="blue darken-3"
          class="mt-n2 mb-3 mx-6 font-weight-medium"
        ></v-text-field>
      </template>

      <span> Filtrar tabela</span>
    </v-tooltip>

    <v-data-table
      class="content-table"
      v-if="tipo == 'TABELAS DE SELEÇÃO INSERIDAS NA CLAV'"
      :headers="headers"
      :items="lista"
      :search="search"
      :footer-props="footer_props"
    >
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

      <template v-slot:[`item.link`]="{ item }">
        <v-tooltip top color="info" open-delay="500">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              small
              text
              rounded
              @click="$router.push('/ts/' + item.id)"
            >
              <unicon
                name="look-icon"
                width="25"
                height="25"
                viewBox="0 0 20.71 15.574"
                fill="#0D47A1"
              />
            </v-btn>
          </template>
          <span>Ver Tabela de Seleção</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.entidades`]="{ item }">
        <span v-for="(ent, index) in item.entidades" :key="index"
          ><a :href="link(ent)">{{ ent }}</a
          >{{ item.entidades.length > 1 ? " " : "" }}</span
        >
      </template>

      <template v-slot:pageText="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>

    <v-data-table
      class="content-table"
      v-else-if="tipo == 'RADA'"
      :headers="headers"
      :items="lista"
      :search="search"
      :footer-props="footer_props"
    >
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

      <template v-slot:[`item.link`]="{ item }">
        <v-tooltip top color="info" open-delay="500" v-if="item.link">
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="item.link.startsWith('CLAV')"
              v-on="on"
              small
              text
              rounded
              :href="
                pathAPI +
                '/ficheirosEstaticos?caminho=documentos%2FRADA%2FDespacho' +
                item.link.split('Despacho')[1] +
                '&' +
                authToken
              "
            >
              <unicon
                name="pdf-icon"
                width="25"
                height="25"
                viewBox="0 0 20.71 23.668"
                fill="#C62828"
              />
            </v-btn>
            <v-btn v-else v-on="on" small text rounded :href="item.link">
              <unicon
                name="pdf-icon"
                width="25"
                height="25"
                viewBox="0 0 20.71 23.668"
                fill="#C62828"
              />
            </v-btn>
          </template>
          <span>Aceder à TS do RADA em PDF</span>
        </v-tooltip>
        <v-tooltip top color="info" open-delay="500">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              small
              text
              rounded
              @click="$router.push('/pgd/' + item.idRADA)"
            >
              <unicon
                name="look-icon"
                width="25"
                height="25"
                viewBox="0 0 20.71 15.574"
                fill="#0D47A1"
              />
            </v-btn>
          </template>
          <span>Ver RADA</span>
        </v-tooltip>
      </template>

      <template v-slot:pageText="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>

    <v-data-table
      class="content-table"
      v-else
      :headers="headers"
      :items="lista"
      :search="search"
      :footer-props="footer_props"
    >
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

      <template v-slot:[`item.link`]="{ item }">
        <v-tooltip top color="info" open-delay="500">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" small text rounded :href="item.link">
              <unicon
                name="pdf-icon"
                width="25"
                height="25"
                viewBox="0 0 20.71 23.668"
                fill="#C62828"
              />
            </v-btn>
          </template>
          <span>Aceder a Diário da República</span>
        </v-tooltip>
        <v-tooltip top color="info" open-delay="500" v-if="item.idPGD">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              small
              text
              rounded
              @click="$router.push('/pgd/' + item.idPGD)"
            >
              <unicon
                name="look-icon"
                width="25"
                height="25"
                viewBox="0 0 20.71 15.574"
                fill="#0D47A1"
              />
            </v-btn>
          </template>

          <span>Ver Portaria</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.entidades`]="{ item }">
        <span v-for="(ent, index) in item.entidades" :key="index"
          ><a :href="link(ent)">{{ ent }}</a
          >{{ item.entidades.length > 1 ? " " : "" }}</span
        >
      </template>

      <template v-slot:pageText="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
const lhost = require("@/config/global").host;

export default {
  props: ["lista", "tipo", "entidades"],
  data: () => ({
    pathAPI: "",
    authToken: "",
    search: "",
    headers: [
      {
        text: "Data",
        value: "data",
        width: "10%",
        sortable: false,
      },
      {
        text: "Tipo",
        value: "tipo",
        width: "10%",
        sortable: false,
      },
      {
        text: "Número",
        value: "numero",
        width: "10%",
        sortable: false,
      },
      { text: "Entidade", value: "entidades", width: "15%", sortable: false },
      {
        text: "Sumário",
        value: "sumario",
        width: "35%",
        sortable: false,
      },
      {
        text: "Estado",
        value: "estado",
        width: "10%",
        sortable: false,
      },
      {
        text: "Acesso",
        value: "link",
        width: "10%",
        sortable: false,
      },
    ],

    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, -1],
      "items-per-page-text": "Mostrar",
      "items-per-page-all-text": "Todos",
    },
  }),

  created: async function () {
    this.authToken = await this.$getAuthToken();
    this.authToken = this.authToken.replace(" ", "=");

    this.pathAPI = lhost;
  },
  methods: {
    link: function (ent) {
      return this.entidades.some((e) => e == ent)
        ? "/entidades/ent_" + ent
        : "/tipologias/tip_" + ent;
    },
  },
};
</script>

<style scoped>
/*
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px 10px 0 0;
} */
</style>
