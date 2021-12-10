<template>
  <Campo
    nome="Participantes no processo e respetivas intervençõeso"
    infoHeader="Participantes no processo e respetivas intervenções"
    :infoBody="myhelp.Classe.Campos.Participantes"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <v-data-table
        v-if="entidades.length > 0"
        :headers="headers"
        :items="entidades"
        hide-default-footer
      >
        <template v-slot:header="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="green darken-2 subtitle-2"
            >
              {{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.intervencao }}</td>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>{{ props.item.tipo }}</td>
            <td>
              <v-btn
                small
                class="red darken-2"
                dark
                rounded
                @click="unselectParticipante(props.item)"
              >
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-alert v-else :value="true" type="warning" border="left">
        Não tem participantes selecionados...
      </v-alert>
    </template>
  </Campo>
</template>

<script>
const help = require("@/config/help").help;

import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["entidades"],

  components: {
    Campo,
  },

  data: function () {
    return {
      myhelp: help,
      headers: [
        {
          text: "Tipo de Intervenção",
          align: "left",
          sortable: false,
          value: "intervencao",
        },
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" },
        { text: "Remover", value: "" },
      ],
    };
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    unselectParticipante: function (entidade) {
      this.$emit("unselectParticipante", entidade);
    },
  },
};
</script>
<style>
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
