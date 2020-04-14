<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">Selecione o(s) processo(s) relacionado(s)</div>
    </v-col>
    <v-col v-if="procReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchProcessos"
            append-icon="search"
            label="Procura filtra processos"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="processosRelacionadosHeaders"
          :items="processos"
          :items-per-page="5"
          :search="searchProcessos"
          item-key="id"
          class="elevation-1"
          :sort-by="['codigo']"
        >
          <template v-slot:item="props">
            <tr>
              <td>
                <v-select
                  :key="props.item.id"
                  item-text="label"
                  item-value="value"
                  v-model="props.item.idRel"
                  :items="tiposRelacao"
                  solo
                  @change="selectProcesso(props.item.id, $event)"
                />
              </td>
              <td>{{ props.item.codigo }}</td>
              <td>{{ props.item.titulo }}</td>
            </tr>
          </template>

          <v-alert
            v-slot:no-results
            :value="true"
            color="error"
            icon="warning"
          >A procura por "{{ search }}" não deu resultados.</v-alert>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col v-else>
      <v-subheader>{{ mylabels.procRel }}</v-subheader>
    </v-col>
  </v-row>
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
        { text: "Relação", align: "left", value: "relacao" },
        { text: "Processo", align: "left", value: "codigo", sortable: true },
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
      ]
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
