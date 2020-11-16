<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <v-col cols="12" lg="2">
        <div class="info-label">Selecionar Tipologias de Entidade</div>
      </v-col>
      <v-col cols="12" lg="10" v-if="tipologiasReady" class="px-4">
        <div class="info-content pa-4">
          <v-text-field
            v-model="searchTipologias"
            append-icon="search"
            label="Filtrar Tipologias"
            class="mt-n2 mb-3 mx-6"
            color="blue darken-3"
            clearable
            single-line
            hide-details
          ></v-text-field>
          <v-data-table
            class="content-table"
            :headers="tipologiasHeaders"
            :items="tipologias"
            :search="searchTipologias"
            item-key="id"
            :footer-props="footer_props"
          >
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
                class="font-weight-medium my-3"
                id="alerta-erro"
                >Não foram encontrados resultados para
                <b>"{{ searchTipologias }}"</b>.</v-alert
              >
            </template>
            <template v-slot:item="props">
              <tr @click="selectTipologia(props.item)" style="cursor: pointer;">
                <td style="color: #1A237E;">{{ props.item.sigla }}</td>
                <td>{{ props.item.designacao }}</td>
              </tr>
            </template>

            <template v-slot:footer.page-text="props">
              {{ props.pageStart }} - {{ props.pageStop }} de
              {{ props.itemsLength }}
            </template>
          </v-data-table>
        </div>
      </v-col>
      <v-col v-else style="text-align:center;">
        <p>A carregar tipologias...</p>
        <v-progress-circular
          indeterminate
          size="100"
          width="10"
          color="blue darken-3"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["tipologias", "tipologiasReady"],

  data: function() {
    return {
      searchTipologias: "",
      footer_props: {
        "items-per-page-text": "Tipologias por página"
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

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
tr:hover {
  background-color: #eaeef9 !important;
}
</style>
