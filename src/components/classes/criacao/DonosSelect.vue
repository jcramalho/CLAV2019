<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <v-col cols="12" lg="2">
        <div class="info-label">
          Selecione o(s) dono(s) do processo
        </div>
      </v-col>
      <v-col cols="12" lg="10" v-if="entidadesReady" class="px-4">
        <div class="info-content pa-4">
          <v-text-field
            v-model="searchEntidades"
            append-icon="search"
            label="Procurar / filtrar entidades"
            class="mt-n2 mb-3 mx-6"
            color="blue darken-3"
            single-line
            hide-details
          ></v-text-field>

          <v-data-table
            class="content-table"
            :headers="entidadesHeaders"
            :items="entidades"
            :items-per-page="5"
            :search="searchEntidades"
            item-key="id"
            :footer-props="footer_props"
          >
            <template v-slot:item="props">
              <tr @click="selectEntidade(props.item)" style="cursor: pointer;">
                <td style="color: #1A237E;">{{ props.item.sigla }}</td>
                <td>{{ props.item.designacao }}</td>
                <td>{{ props.item.tipo }}</td>
              </tr>
            </template>

            <template v-slot:footer.page-text="props"
              >{{ props.pageStart }} - {{ props.pageStop }} de
              {{ props.itemsLength }}</template
            >

            <v-alert
              v-slot:no-results
              :value="true"
              class="error"
              icon="warning"
              style="border-radius: 40px;"
              >A procura por "{{ search }}" não deu resultados.</v-alert
            >
          </v-data-table>
        </div>
      </v-col>
      <v-col v-else>
        <v-subheader>{{ mylabels.donos }}</v-subheader>
      </v-col>
    </v-row>
  </v-container>
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
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
tr:hover {
  background-color: #eaeef9 !important;
}
</style>
