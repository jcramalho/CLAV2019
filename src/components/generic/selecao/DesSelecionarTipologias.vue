<template>
  <v-row>
    <v-col cols="2">
      <v-subheader class="info-label">Tipologias selecionadas</v-subheader>
    </v-col>
    <v-col v-if="tipologias.length > 0">
      <v-data-table
        :headers="headers"
        :items="tipologias"
        :items-per-page="100"
        class="elevation-1"
        hide-default-footer
      >
        <template v-slot:headers="props">
          <tr>
            <th v-for="h in props.headers" :key="h.text">{{ h.text }}</th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                rounded
                @click="unselectTipologia(props.item)"
              >
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning"
        >Não tem tipologias selecionadas...</v-alert
      >
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["tipologias"],

  data: function() {
    return {
      headers: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Remover" }
      ]
    };
  },

  methods: {
    unselectTipologia: function(tipologia) {
      this.$emit("unselectTipologia", tipologia);
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
</style>
