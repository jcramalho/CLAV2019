<template>
  <v-layout row wrap color="teal lighten-5">
    <v-flex xs2>
      <v-subheader
        class="info-label"
        style="border-color: white; border-style:solid; color: #1A237E;"
        >Regula os Processos de Negócio:
      </v-subheader>
    </v-flex>
    <v-flex xs9 v-if="processos.length > 0">
      <v-data-table
        :headers="headers"
        :items="processos"
        class="elevation-1"
        hide-actions
      >
        <template v-slot:headers="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: #1A237E;"
            >
              {{ h.text }}
            </th>
            <th style="color: #1A237E;">Remover</th>
          </tr>
        </template>

        <template v-slot:items="props">
          <tr>
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                round
                @click="unselectProcesso(props.item)"
              >
                <v-icon dark>remove_circle</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex xs9 v-else>
      <v-alert :value="true" type="warning">
        Não tem entidades selecionadas...
      </v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["processos"],

  data: function() {
    return {
      headers: [
        { text: "Código", align: "left", value: "codigo" },
        { text: "Designação", value: "titulo" }
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
