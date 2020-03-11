<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">
        Legislação
        <InfoBox header="Legislação" :text="myhelp.Classe.Campos.Legislacao" />
      </div>
    </v-col>
    <v-col v-if="legs.length > 0">
      <v-data-table
        :headers="headers"
        :items="legs"
        class="elevation-1"
        hide-default-footer
        :footer-props="footer_props"
      >
        <template v-slot:header="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: green;"
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
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning"
        >Não tem legislação selecionada...</v-alert
      >
    </v-col>
  </v-row>
</template>

<script>
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["legs"],

  components: {
    InfoBox
  },

  data: function() {
    return {
      myhelp: help,
      headers: [
        { text: "Tipo", align: "left", value: "tipo" },
        { text: "Número", value: "numero" },
        { text: "Sumário", value: "sumario" },
        { text: "Data", value: "data" },
        { text: "Remover", value: "" }
      ],

      footer_props: {
        "items-per-page-text": "Diplomas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  methods: {
    unselectDiploma: function(diploma) {
      this.$emit("unselectDiploma", diploma);
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
