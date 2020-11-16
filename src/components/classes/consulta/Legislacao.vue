<template>
  <v-row v-if="!valida">
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
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.tipo }}</td>
              <td>
                <a :href="'/legislacao/' + props.item.idLeg">
                  {{ props.item.numero }}</a
                >
              </td>
              <td>{{ props.item.sumario }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-col>
  </v-row>
  <div v-else>
    <v-data-table
      :headers="headers"
      :items="legs"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.tipo }}</td>
          <td>
            <a :href="'/legislacao/' + props.item.idLeg">
              {{ props.item.numero }}</a
            >
          </td>
          <td>{{ props.item.sumario }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["legs", "valida"],
  components: { InfoBox },

  data: function() {
    return {
      headers: [
        {
          text: "Tipo",
          align: "left",
          value: "tipo",
          class: ["table-header", "body-2", "font-weight-bold"],
          width: "5.2rem"
        },
        {
          text: "Número",
          value: "numero",
          class: ["table-header", "body-2", "font-weight-bold"],
          width: "6.95rem"
        },
        {
          text: "Sumário",
          value: "sumario",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
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

<style scoped>
.info-label {
  color: #1a237e;
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
  width: 100%;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
tr:hover {
  background-color: #eaeef9 !important;
}
</style>
