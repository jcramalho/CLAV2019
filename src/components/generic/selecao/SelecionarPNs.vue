<template>
  <v-layout row wrap>
    <v-flex xs2>
      <v-subheader
        class="info-label"
        style="border-color: white; border-style:solid; color: #1A237E;"
        >Selecionar Processos de Negócio:</v-subheader
      >
    </v-flex>
    <v-flex xs9 v-if="processosReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchProcessos"
            append-icon="search"
            label="Filtrar Processos de negócio"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="processosHeaders"
          :items="processos"
          :search="searchProcessos"
          item-key="id"
          class="elevation-1"
          rows-per-page-text="Linhas por página"
        >
          <template v-slot:items="props">
            <tr @click="selectProcesso(props.item)">
              <td>{{ props.item.codigo }}</td>
              <td>{{ props.item.titulo }}</td>
            </tr>
          </template>

          <template v-slot:pageText="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <v-alert v-slot:no-results :value="true" color="error" icon="warning">
            A procura por "{{ search }}" não deu resultados.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-flex xs9 v-else>
      <v-subheader>A carregar processos...</v-subheader>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["processos", "processosReady"],

  data: function() {
    return {
      searchProcessos: "",

      processosHeaders: [
        { text: "Código", align: "left", value: "codigo" },
        { text: "Designação", value: "titulo" }
      ]
    };
  },

  methods: {
    selectProcesso: function(processo) {
      this.$emit("selectProcesso", processo);
    }
  }
};
</script>
