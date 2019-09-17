<template>
  <v-row>
    <v-col cols="2" v-if="tipo === 'legislacao' && entidades.length === 0">
      <v-subheader class="info-label">Entidade responsável pela publicação:</v-subheader>
    </v-col>
    <v-col cols="2" v-else>
      <v-subheader class="info-label">Entidades selecionadas:</v-subheader>
    </v-col>
    <v-col v-if="entidades.length > 0">
      <v-data-table :headers="headers" :items="entidades" class="elevation-1" hide-default-footer>
        <template v-slot:headers="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: #1A237E;"
            >{{ h.text }}</th>
            <th style="color: #1A237E;">Remover</th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>
              <v-btn small color="red darken-2" dark rounded @click="unselectEntidade(props.item)">
                <v-icon dark>remove_circle</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
    <v-col xs="9" md="9" v-else>
      <v-alert :value="true" type="warning">Não tem entidades selecionadas...</v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["entidades", "tipo"],

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
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    unselectEntidade: function(entidade) {
      this.$emit("unselectEntidade", entidade);
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #0d47a1;
  padding: 6px;
  font-weight: 400;
  width: auto;
  height: auto;
  background-color: #b3e5fc;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
