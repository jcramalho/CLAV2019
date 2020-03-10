<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">Selecione a legislação</div>
    </v-col>
    <v-col v-if="legislacaoReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchDiplomas"
            append-icon="search"
            label="Procura filtra os diplomas"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="legs"
          :search="searchDiplomas"
          item-key="id"
          class="elevation-1"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectDiploma(props.item)">
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.sumario }}</td>
              <td>{{ props.item.data }}</td>
            </tr>
          </template>

          <template v-slot:footer.page-text="props"
            >Diplomas {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}</template
          >

          <v-alert v-slot:no-results :value="true" color="error" icon="warning"
            >A procura por "{{ search }}" não deu resultados.</v-alert
          >
        </v-data-table>
      </v-card>
    </v-col>
    <v-col v-else>
      <v-subheader>{{ mylabels.legislacao }}</v-subheader>
    </v-col>
  </v-row>
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
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
