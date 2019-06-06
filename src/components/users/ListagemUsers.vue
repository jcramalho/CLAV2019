<template>
  <v-card>
    <v-card-title>
      <h1>Listagem de Utilizadores</h1>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="utilizadores"
      :search="search"
      class="elevation-1"
      :rows-per-page-items="[10, 20, 100]"
      rows-per-page-text="Mostrar"
      :disable-initial-sort="true"
    >
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Não foram encontrados resultados para "{{ search }}" .
        </v-alert>
      </template>
      <template v-slot:items="props">
        <tr>
            <td class="subheading">
                {{ props.item.name }}
            </td>
            <td class="subheading">{{ props.item.entidade }}</td>
            <td class="subheading">{{ props.item.email }}</td>
            <td class="subheading">{{ props.item.level }}</td>
        </tr>
      </template>
      <template v-slot:pageText="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    search: "",
    headers: [
      {
        text: "Nome",
        sortable: true,
        value: "nome",
        class: "title"
      },
      {
        text: "Entidade",
        sortable: true,
        value: "entidade",
        class: "title"
      },
      {
        text: "Email",
        sortable: true,
        value: "email",
        class: "title"
      },
      {
        text: "Nível de utilizador",
        sortable: true,
        value: "level",
        class: "title"
      }
    //   { text: "Ações", class: "title" }
    ],
    utilizadores: []
  }),
  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/users?formato=normalizado");
      this.utilizadores = response.data;
    } catch (e) {
      return e;
    }
  },
  methods: {

  }
};
</script>

<style></style>
