<template>
  <Campo
    nome="Selecione a legislação"
    infoHeader="Selecione a legislação"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <v-card v-if="legislacaoReady" flat>
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
          :items-per-page="5"
          :search="searchDiplomas"
          item-key="id"
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
      <v-subheader v-else>{{ mylabels.legislacao }}</v-subheader>
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";
export default {
  props: ["legs", "legislacaoReady"],
  components: {
    Campo,
  },
  data: function () {
    return {
      searchDiplomas: "",
      mylabels: require("@/config/labels").mensagensEspera,

      headers: [
        { text: "Tipo", align: "left", value: "tipo", sortable: false },
        { text: "Número", value: "numero", sortable: false },
        { text: "Sumário", value: "sumario", sortable: false },
        { text: "Data", value: "data" },
      ],

      footer_props: {
        "items-per-page-text": "Diplomas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos",
      },
    };
  },

  methods: {
    selectDiploma: function (diploma) {
      this.$emit("selectDiploma", diploma);
    },
  },
};
</script>
<style>
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
