<template>
  <Campo
    nome="Legislação"
    infoHeader="Legislação"
    :infoBody="myhelp.Classe.Campos.Legislacao"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <v-data-table
        v-if="legs.length > 0"
        :headers="headers"
        :items="legs"
        hide-default-footer
        :footer-props="footer_props"
      >
        <template v-slot:header="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: green"
            >
              {{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.tipo }}</td>
            <td>{{ props.item.numero }}</td>
            <td>{{ props.item.sumario }}</td>
            <td>{{ props.item.data }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                rounded
                @click="unselectDiploma(props.item)"
              >
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template v-slot:footer.page-text="props"
          >Diplomas {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}</template
        >
      </v-data-table>
      <v-alert v-else :value="true" type="warning" border="left"
        >Não tem legislação selecionada...</v-alert
      >
    </template>
  </Campo>
</template>

<script>
const help = require("@/config/help").help;

import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["legs"],

  components: {
    Campo,
  },

  data: function () {
    return {
      myhelp: help,
      headers: [
        { text: "Tipo", align: "left", value: "tipo" },
        { text: "Número", value: "numero" },
        { text: "Sumário", value: "sumario" },
        { text: "Data", value: "data" },
        { text: "Remover", value: "" },
      ],

      footer_props: {
        "items-per-page-text": "Diplomas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos",
      },
    };
  },

  methods: {
    unselectDiploma: function (diploma) {
      this.$emit("unselectDiploma", diploma);
    },
  },
};
</script>
<style>
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
