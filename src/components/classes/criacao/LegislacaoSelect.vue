<template>
  <v-row class="ma-2">
    <v-col cols="2">
      <div class="info-label">Selecione os diplomas:</div>
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
          items-per-page-text="Linhas por página"
        >
          <template v-slot:item="props">
            <tr @click="selectDiploma(props.item)">
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.sumario }}</td>
              <td>{{ props.item.data }}</td>
            </tr>
          </template>

          <template v-slot:footer.page-text="props">
            Diplomas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
          </template>

          <v-alert v-slot:no-results :value="true" color="error" icon="warning">
            A procura por "{{ search }}" não deu resultados.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col v-else>
      <v-subheader>A carregar entidades...</v-subheader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["legs", "legislacaoReady"],

  data: function() {
    return {
      searchDiplomas: "",

      headers: [
        { text: "Tipo", align: "left", value: "tipo", sortable: false },
        { text: "Número", value: "numero", sortable: false },
        { text: "Sumário", value: "sumario", sortable: false },
        { text: "Data", value: "data" }
      ]
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
