<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <v-col cols="12" lg="2">
        <div class="info-label">
          Selecione o(s) processo(s) relacionado(s)
        </div>
      </v-col>
      <v-col cols="12" lg="10" v-if="procReady" class="px-4">
        <div class="info-content pa-4">
          <v-text-field
            v-model="searchProcessos"
            append-icon="search"
            label="Procurar / filtrar processos"
            class="mt-n2 mb-3 mx-6"
            clearable
            single-line
            hide-details
            color="blue darken-3"
          ></v-text-field>

          <v-data-table
            class="content-table"
            :headers="processosRelacionadosHeaders"
            :items="processos"
            :items-per-page="5"
            :search="searchProcessos"
            item-key="id"
            :footer-props="processosRelacionadosFooterProps"
            :sort-by="['codigo']"
          >
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
                class="font-weight-medium my-3"
                id="alerta-erro"
                >Não foram encontrados resultados para
                <b>"{{ searchProcessos }}"</b>.</v-alert
              >
            </template>
            <template v-slot:item="props">
              <tr>
                <td>
                  <v-select
                    :key="props.item.id"
                    item-text="label"
                    item-value="value"
                    v-model="props.item.idRel"
                    :items="tiposRelacao"
                    color="blue darken-3"
                    @change="selectProcesso(props.item.id, $event)"
                  />
                </td>
                <td style="color: #1A237E;">{{ props.item.codigo }}</td>
                <td>{{ props.item.titulo }}</td>
              </tr>
            </template>
            <template v-slot:footer.page-text="props"
              >{{ props.pageStart }} - {{ props.pageStop }} de
              {{ props.itemsLength }}</template
            >
            <v-alert
              v-slot:no-results
              :value="true"
              color="error"
              icon="warning"
              style="border-radius: 40px;"
              >A procura por "{{ search }}" não deu resultados.</v-alert
            >
          </v-data-table>
        </div>
      </v-col>
      <v-col v-else>
        <v-subheader>{{ mylabels.procRel }}</v-subheader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["procReady", "processos"],

  data: function() {
    return {
      searchProcessos: "",
      paginationProcessos: { sortBy: "codigo" },
      mylabels: require("@/config/labels").mensagensEspera,

      processosRelacionadosHeaders: [
        { text: "Relação", align: "left", value: "relacao", width: "15rem" },
        {
          text: "Processo",
          align: "left",
          value: "codigo",
          sortable: true,
          width: "8rem"
        },
        { text: "Título", value: "titulo" }
      ],

      tiposRelacao: [
        { label: "Por selecionar", value: "Indefinido" },
        { label: "Antecessor de", value: "eAntecessorDe" },
        { label: "Sucessor de", value: "eSucessorDe" },
        { label: "Complementar de", value: "eComplementarDe" },
        { label: "Cruzado com", value: "eCruzadoCom" },
        { label: "Sintese de", value: "eSinteseDe" },
        { label: "Sintetizado por", value: "eSintetizadoPor" },
        { label: "Suplemento de", value: "eSuplementoDe" },
        { label: "Suplemento para", value: "eSuplementoPara" }
      ],
      processosRelacionadosFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  methods: {
    go: function(id) {
      this.$router.push("/classes/consultar/c" + id);
      this.$router.go();
    },
    selectProcesso: function(id, relacao) {
      var index = this.processos.findIndex(p => p.id === id);
      this.processos[index].relacao = relacao;
      var selectedProcesso = JSON.parse(JSON.stringify(this.processos[index]));
      this.processos.splice(index, 1);
      this.$emit("selectProcesso", selectedProcesso);
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
