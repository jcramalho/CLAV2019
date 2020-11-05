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
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Número",
          value: "numero",
          class: ["table-header", "body-2", "font-weight-bold"]
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
