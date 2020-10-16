<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">Selecione o sistema</div>
    </v-col>
    <v-col v-if="sistemaReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchSistemas"
            append-icon="search"
            label="Procurar os sistemas"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="sistema"
          :items-per-page="5"
          :search="searchSistemas"
          item-key="id"
          class="elevation-1"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectSistema(props.item)">
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.nome }}</td>
            </tr>
          </template>

          <template
            v-slot:footer.page-text="props"
          >Sistemas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>

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
      <v-subheader>{{ mylabels.legislacao }}</v-subheader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["sistema", "sistemaReady"],

  data: function() {
    return {
      searchSistemas: "",
      mylabels: require("@/config/labels").mensagensEspera,

      headers: [
        { text: "Número", value: "numero", sortable: false },
        { text: "Nome", align: "left", value: "nome", sortable: false },
      ],

      footer_props: {
        "items-per-page-text": "Sistemas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  methods: {
    selectSistema: function(sistema) {
      this.$emit("selectSistema", sistema);
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
