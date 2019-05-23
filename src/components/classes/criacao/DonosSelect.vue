<template>
  <v-layout row wrap ma-2>
    <v-flex xs2>
      <div class="info-label">Selecione o(s) dono(s) do processo</div>
    </v-flex>
    <v-flex xs9 v-if="entidadesReady">
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
          :search="searchEntidades"
          item-key="id"
          class="elevation-1"
          rows-per-page-text="Linhas por página"
        >
          <template v-slot:items="props">
            <tr @click="selectEntidade(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.tipo }}</td>
            </tr>
          </template>

          <template v-slot:pageText="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <v-alert v-slot:no-results :value="true" color="error" icon="warning">
            A procura por "{{ search }}" não deu resultados.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-flex>
    <v-flex xs9 v-else>
      <v-subheader>A carregar entidades...</v-subheader>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["entidades", "entidadesReady"],

  data: function() {
    return {
      searchEntidades: "",

      entidadesHeaders: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" }
      ]
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
