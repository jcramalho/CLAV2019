<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">Selecione o(s) participante(s) no processo:</div>
    </v-col>
    <v-col v-if="entidadesReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchEntidades"
            append-icon="search"
            label="Procura filtra entidades"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="participantesHeaders"
          :items="entidades"
          :search="searchEntidades"
          item-key="id"
          class="elevation-1"
          :footer-props="participantesFooterProps"
          :sort-by="['sigla']"
        >
          <template v-slot:item="props">
            <tr>
              <td>
                <v-select
                  :key="props.item.id"
                  item-text="label"
                  item-value="value"
                  v-model="props.item.intervencao"
                  :items="tiposIntervencao"
                  solo
                  dense
                  @change="selectParticipante(props.item.id, $event)"
                />
              </td>
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.tipo }}</td>
            </tr>
          </template>

          <template v-slot:footer.page-text="props"
            >{{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}</template
          >

          <v-alert v-slot:no-results :value="true" color="error" icon="warning"
            >A procura por "{{ search }}" não deu resultados.</v-alert
          >
        </v-data-table>
      </v-card>
    </v-col>
    <v-col v-else>
      <v-subheader>{{ mylabels.participantes }}</v-subheader>
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

      participantesHeaders: [
        { text: "Intervenção", align: "left", value: "intervencao" },
        { text: "Sigla", align: "left", value: "sigla", sortable: true },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" }
      ],

      tiposIntervencao: [
        { label: "Por selecionar", value: "Indefinido" },
        { label: "Apreciar", value: "Apreciar" },
        { label: "Assessorar", value: "Assessorar" },
        { label: "Comunicar", value: "Comunicar" },
        { label: "Decidir", value: "Decidir" },
        { label: "Executar", value: "Executar" },
        { label: "Iniciar", value: "Iniciar" }
      ],

      participantesFooterProps: {
        "items-per-page-text": "Pedidos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    selectParticipante: function(id, intervencao) {
      var index = this.entidades.findIndex(e => e.id === id);
      this.entidades[index].intervencao = intervencao;
      var selectedEntidade = JSON.parse(JSON.stringify(this.entidades[index]));
      this.entidades.splice(index, 1);
      this.$emit("selectParticipante", selectedEntidade);
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
