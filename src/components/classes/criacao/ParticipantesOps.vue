<template>
  <v-row class="ma-2">
    <v-col cols="2">
      <div class="info-label">
        Participantes no processo e respetivas intervenções
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
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="green darken-2 subtitle-2"
            >
              {{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.intervencao }}</td>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>{{ props.item.tipo }}</td>
            <td>
              <v-btn
                small
                class="red darken-2"
                dark
                rounded
                @click="unselectParticipante(props.item)"
              >
                <v-icon dark>remove_circle</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning">
        Não tem participantes selecionados...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["entidades"],

  data: function() {
    return {
      headers: [
        {
          text: "Tipo de Intervenção",
          align: "left",
          sortable: false,
          value: "intervencao"
        },
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" },
        { text: "Remover", value: "" }
      ]
    };
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    unselectParticipante: function(entidade) {
      this.$emit("unselectParticipante", entidade);
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
