<template>
  <v-layout row wrap>
    <v-flex xs2>
      <v-subheader
        class="info-label"
        style="border-color: white; border-style:solid; color: #1A237E;"
        >Selecionar Entidades:</v-subheader
      >
    </v-flex>
    <v-flex xs9 v-if="entidadesReady">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="searchEntidades"
            append-icon="search"
            label="Filtrar entidades"
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
        { text: "Designação", value: "designacao" }
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
