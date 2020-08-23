<template>
  <v-card class="ma-8">
    <v-card-title class="indigo darken-4 white--text" dark>
      {{ tipo }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar"
        single-line
        hide-details
        dark
      ></v-text-field>
    </v-card-title>

    <v-card-text>
      <v-data-table
        v-if="tipo=='TABELAS DE SELEÇÃO INSERIDAS NA CLAV'"
        :headers="headersTS"
        :items="lista"
        :search="search"
        class="elevation-1"
        :footer-props="footer_props"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning"
            >Não foram encontrados resultados para "{{ search }}".</v-alert
          >
        </template>

        <template v-slot:item.link="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="indigo darken-3" @click="$router.push('/ts/'+item.id)"
                  v-on="on">
                    <v-icon>remove_red_eye</v-icon>
                  </v-btn>
                </template>
                <span>Ver Tabela de Seleção...</span>
              </v-tooltip>
        </template>
        <template v-slot:item.entidades="{ item }">
              <span v-for="(ent,index) in item.entidades" :key="index">{{ent}}</span>
        </template>

        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>

      </v-data-table>

      <v-data-table
        v-else-if="tipo=='TABELAS DE SELEÇÃO INSERIDAS EM RELATÓRIO DE AVALIAÇÃO DE DOCUMENTAÇÃO ACUMULADA'"
        :headers="headers"
        :items="lista"
        :search="search"
        class="elevation-1"
        :footer-props="footer_props"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning"
            >Não foram encontrados resultados para "{{ search }}".</v-alert
          >
        </template>

        <template v-slot:item.link="{ item }">
          <v-tooltip bottom v-if="item.link">
                <template v-slot:activator="{ on }">
                  <v-btn icon color="red darken-3" :href="item.link"
                  v-on="on">
                    <v-icon>picture_as_pdf</v-icon>
                  </v-btn>
                </template>
                <span>Aceder à TS do RADA em PDF...</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="indigo darken-3" @click="$router.push('/pgd/'+item.idRADA)"
                  v-on="on">
                    <v-icon>remove_red_eye</v-icon>
                  </v-btn>
                </template>
                <span>Ver RADA...</span>
              </v-tooltip>
        </template>

        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>

      </v-data-table>

      <v-data-table
      v-else
        :headers="headers"
        :items="lista"
        :search="search"
        class="elevation-1"
        :footer-props="footer_props"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning"
            >Não foram encontrados resultados para "{{ search }}".</v-alert
          >
        </template>

        <template v-slot:item.link="{ item }">
          <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon color="red darken-3" :href="item.link"
                  v-on="on">
                    <v-icon>picture_as_pdf</v-icon>
                  </v-btn>
                </template>
                <span>Aceder a Diario da Republica...</span>
              </v-tooltip>
              <v-tooltip bottom v-if="item.idPGD">
                <template v-slot:activator="{ on }">
                  <v-btn icon color="indigo darken-3" @click="$router.push('/pgd/'+item.idPGD)"
                  v-on="on">
                    <v-icon>remove_red_eye</v-icon>
                  </v-btn>
                </template>
                <span>Ver Portaria...</span>
              </v-tooltip>
        </template>

        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["lista", "tipo"],
  data: () => ({
    search: "",
    headers: [
      {text: "Data", value: "data", width: "8%"},
      {text: "Tipo", value: "tipo", width: "10%"},
      {text: "Número", value: "numero", width: "10%"},
      {text: "Sumário", value: "sumario", width: "64%"},
      {text: "Acesso", value: "link", width: "8%"},
    ],
    headersTS: [
      {text: "Data", value: "data", width: "8%"},
      {text: "Entidades", value: "entidades", width: "20%"},
      {text: "Sumário", value: "designacao", width: "64%"},
      {text: "Acesso", value: "link", width: "8%"},
    ],
    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, -1],
      "items-per-page-text": "Mostrar",
        "items-per-page-all-text": "Todos"
    }
  })
};
</script>
