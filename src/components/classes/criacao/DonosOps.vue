<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">
        Donos do processo
        <InfoBox
          header="Donos do processo"
          :text="myhelp.Classe.Campos.Donos"
        />
      </div>
    </v-col>
    <v-col v-if="entidades.length > 0">
      <v-data-table
        :headers="headers"
        :items="entidades"
        class="elevation-1"
        hide-default-footer
      >
        <template v-slot:header="props">
          <tr>
            <th v-for="h in props.headers" :key="h.text" class="subtitle-2">
              {{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>{{ props.item.tipo }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                rounded
                @click="unselectEntidade(props.item)"
              >
                <v-icon dark>remove_circle</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning"
        >Não tem donos selecionados...</v-alert
      >
    </v-col>
  </v-row>
</template>

<script>
const labels = require("@/config/labels").classeCriacaoDonosOps;
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["entidades"],

  components: {
    InfoBox
  },

  data: function() {
    return {
      mylabels: labels,
      myhelp: help,
      headers: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" },
        { text: "Remover" }
      ]
    };
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    unselectEntidade: function(entidade) {
      this.$emit("unselectEntidade", entidade);
    }
  }
};
</script>
<style>
.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
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
