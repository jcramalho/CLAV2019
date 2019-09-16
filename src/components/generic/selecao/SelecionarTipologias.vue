<template>
  <v-row>
    <v-col cols="12" xs="2" md="2">
      <v-subheader
        class="info-label"
        style="border-color: white; border-style:solid; color: #1A237E;"
        >Selecionar Tipologias de Entidade:</v-subheader
      >
    </v-col>
    <v-col xs="9" md="9" v-if="tipologiasReady">
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
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
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
    </v-col>
    <v-col xs="9" md="9" v-else>
      <v-subheader>A carregar tipologias...</v-subheader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["tipologias", "tipologiasReady"],

  data: function() {
    return {
      searchTipologias: "",
      footer_props: {
        "items-per-page-text": "Linhas por página"
      },
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
