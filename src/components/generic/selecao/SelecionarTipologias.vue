<template>
  <v-layout row wrap>
    <v-flex xs2>
      <v-subheader
        class="info-label"
        style="border-color: white; border-style:solid; color: #1A237E;"
        >Selecionar Tipologias de Entidade:</v-subheader
      >
    </v-flex>
    <v-flex xs9 v-if="tipologiasReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchTipologias"
            append-icon="search"
            label="Filtrar Tipologias"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tipologiasHeaders"
          :items="tipologias"
          :search="searchTipologias"
          item-key="id"
          class="elevation-1"
          rows-per-page-text="Linhas por página"
        >
          <template v-slot:items="props">
            <tr @click="selectTipologia(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
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
      <v-subheader>A carregar tipologias...</v-subheader>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["tipologias", "tipologiasReady"],

  data: function() {
    return {
      searchTipologias: "",

      tipologiasHeaders: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" }
      ]
    };
  },

  methods: {
    selectTipologia: function(tipologia) {
      this.$emit("selectTipologia", tipologia);
    }
  }
};
</script>
