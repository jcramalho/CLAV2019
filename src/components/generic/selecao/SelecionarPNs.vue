<template>
  <v-row>
    <v-col cols="2">
      <v-subheader class="info-label">Selecionar Processos de Negócio:</v-subheader>
    </v-col>
    <v-col v-if="processosReady">
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
          footer-props.items-per-page-text="Linhas por página"
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

          <v-alert
            v-slot:no-results
            :value="true"
            color="error"
            icon="warning"
          >A procura por "{{ search }}" não deu resultados.</v-alert>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col v-else>
      <v-subheader>A carregar processos...</v-subheader>
    </v-col>
  </v-row>
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

<style scoped>
.info-label {
  color: #0d47a1;
  padding: 6px;
  font-weight: 400;
  width: auto;
  height: auto;
  background-color: #b3e5fc;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>