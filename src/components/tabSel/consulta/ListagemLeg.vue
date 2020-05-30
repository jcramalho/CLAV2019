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
        :headers="headers"
        :items="lista"
        :search="search"
        class="elevation-1"
        :footer-props="footer_props"
        v-if="this.headers[this.cabecalho.length - 1]"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning"
            >Não foram encontrados resultados para "{{ search }}".</v-alert
          >
        </template>

        <template v-slot:item="props">
          <tr v-if="tipo!='TABELAS DE SELEÇÃO INSERIDAS EM PORTARIA DE GESTÃO DE DOCUMENTOS (Ontologia)'">
            <td v-for="(campo, index) in props.item" v-bind:key="index">
              <div v-if="index == 'link'">
                <a :href="campo">{{ campo }}</a>
              </div>

              <div v-else>{{ campo }}</div>
            </td>
          </tr>
          <tr v-else @click="$router.push('/pgd/'+props.item.idPGD)">
            <td>{{ props.item.data }}</td>
            <td>{{ props.item.tipo }}</td>
            <td>{{ props.item.numero }}</td>
            <td>{{ props.item.sumario }}</td>
            <td><a :href="props.item.link">{{ props.item.link }}</a></td>
          </tr>
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
  props: ["lista", "tipo", "cabecalho", "campos", "ids"],
  data: () => ({
    search: "",
    headers: [],
    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    }
  }),
  created: function() {
    try {
      for (let i = 0; i < this.cabecalho.length; i++) {
        this.headers[i] = {
          text: this.cabecalho[i],
          value: this.campos[i]
        };
      }
    } catch (e) {
      return e;
    }
  }
};
</script>
