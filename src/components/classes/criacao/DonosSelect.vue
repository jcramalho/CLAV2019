<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">Selecione o(s) dono(s) do processo</div>
    </v-col>
    <v-col v-if="entidadesReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchEntidades"
            append-icon="search"
            label="Procura/filtra entidades"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="entidadesHeaders"
          :items="entidades"
          :items-per-page="5"
          :search="searchEntidades"
          item-key="id"
          class="elevation-1"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectEntidade(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.tipo }}</td>
            </tr>
          </template>

          <template
            v-slot:footer.page-text="props"
          >{{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>

          <v-alert
            v-slot:no-results
            :value="true"
            class="error"
            icon="warning"
          >A procura por "{{ search }}" não deu resultados.</v-alert>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col v-else>
      <v-subheader>{{ mylabels.donos }}</v-subheader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["entidades", "entidadesReady"],

  data: function() {
    return {
      searchEntidades: "",
      mylabels: require("@/config/labels").mensagensEspera,

      entidadesHeaders: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" }
      ],

      footer_props: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todas"
      }
    };
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    selectEntidade: function(entidade) {
      this.$emit("selectEntidade", entidade);
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
