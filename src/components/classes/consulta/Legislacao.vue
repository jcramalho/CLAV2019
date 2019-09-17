<template>
  <v-row>
    <!-- LEGISLAÇÂO -->
    <v-col xs="2" sm="2">
      <div class="info-label">
        Legislação
        <InfoBox
          header="Legislação"
          :text="myhelp.Classe.Campos.Legislacao"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-col>
    <v-col xs="10" sm="10">
      <div class="info-content">
        <v-data-table
          :headers="headers"
          :items="legs"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:headers="props">
            <tr>
              <th
                v-for="h in props.headers"
                :key="h.text"
                class="table-header body-2 font-weight-bold"
              >
                {{ h.text }}
              </th>
            </tr>
          </template>

          <template v-slot:items="props">
            <tr>
              <td>
                <a :href="'/legislacao/' + props.item.idLeg">{{
                  props.item.tipo
                }}</a>
              </td>
              <td>
                <a :href="'/legislacao/' + props.item.idLeg">
                  {{ props.item.numero }}
                </a>
              </td>
              <td>
                <a :href="'/legislacao/' + props.item.idLeg">
                  {{ props.item.sumario }}
                </a>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["legs"],
  components: { InfoBox },

  data: function() {
    return {
      headers: [
        { text: "Tipo", align: "left", value: "tipo" },
        { text: "Número", value: "numero" },
        { text: "Sumário", value: "sumario" }
      ],
      myhelp: help
    };
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    }
  }
};
</script>

<style>
a:link {
  color: #1a237e;
  background-color: transparent;
}

a:hover {
  color: white;
  background-color: #1a237e;
}

.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
