<template>
  <v-row>
    <v-col cols="2">
      <v-subheader class="info-label">Regula os Processos de Negócio:</v-subheader>
    </v-col>
    <v-col v-if="processos.length > 0">
      <v-data-table :headers="headers" :items="processos" class="elevation-1" hide-default-footer>
        <!-- <template v-slot:headers="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: #1A237E;"
            >{{ h.text }}</th>
            <th style="color: #1A237E;">Remover</th>
          </tr>
        </template>-->

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>
              <v-btn small color="red darken-2" dark rounded @click="unselectProcesso(props.item)">
                <v-icon dark>remove_circle</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning">Não tem entidades selecionadas...</v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["processos"],

  data: function() {
    return {
      headers: [
        {
          text: "Código",
          align: "left",
          value: "codigo",
          class: ["body-2", "font-weight-bold"]
        },
        {
          text: "Designação",
          value: "titulo",
          class: ["body-2", "font-weight-bold"]
        },
        { text: "Remover", class: ["body-2", "font-weight-bold"] }
      ]
    };
  },

  methods: {
    unselectProcesso: function(processo) {
      this.$emit("unselectProcesso", processo);
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: auto;
  height: auto;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>