<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <v-col cols="12" lg="2">
        <div class="info-label">
          Selecione a legislação
        </div>
      </v-col>
      <v-col cols="12" lg="10" v-if="legislacaoReady" class="px-4">
        <div class="info-content pa-4">
          <v-text-field
            v-model="searchDiplomas"
            append-icon="search"
            label="Procurar / filtrar os diplomas"
            class="mt-n2 mb-3 mx-6"
            clearable
            single-line
            hide-details
            color="blue darken-3"
          ></v-text-field>

          <v-data-table
            class="content-table"
            :headers="headers"
            :items="legs"
            :items-per-page="5"
            :search="searchDiplomas"
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
                <b>"{{ searchDiplomas }}"</b>.</v-alert
              >
            </template>
            <template v-slot:item="props">
              <tr @click="selectDiploma(props.item)" style="cursor: pointer;">
                <td>{{ props.item.tipo }}</td>
                <td style="color: #1A237E;">{{ props.item.numero }}</td>
                <td>{{ props.item.sumario }}</td>
                <td>{{ props.item.data }}</td>
              </tr>
            </template>

            <template v-slot:footer.page-text="props"
              >Diplomas {{ props.pageStart }} - {{ props.pageStop }} de
              {{ props.itemsLength }}</template
            >

            <v-alert
              v-slot:no-results
              :value="true"
              color="error"
              icon="warning"
              >A procura por "{{ search }}" não deu resultados.</v-alert
            >
          </v-data-table>
        </div>
      </v-col>
      <v-col v-else>
        <v-subheader>{{ mylabels.legislacao }}</v-subheader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["legs", "legislacaoReady"],

  data: function() {
    return {
      searchDiplomas: "",
      mylabels: require("@/config/labels").mensagensEspera,

      headers: [
        { text: "Tipo", align: "left", value: "tipo", sortable: false },
        { text: "Número", value: "numero", sortable: false },
        { text: "Sumário", value: "sumario", sortable: false },
        { text: "Data", value: "data" }
      ],

      footer_props: {
        "items-per-page-text": "Diplomas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  methods: {
    selectDiploma: function(diploma) {
      this.$emit("selectDiploma", diploma);
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
