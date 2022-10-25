<template>
  <Campo
    nome="Donos do processo"
    infoHeader="Donos do processo"
    :infoBody="myhelp.Classe.Campos.Donos"
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
            <th v-for="h in props.headers" :key="h.text" class="subtitle-2">
              {{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>{{ props.item.tipo }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                rounded
                @click="unselectEntidade(props.item)"
              >
                <v-icon dark>remove_circle</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-alert v-else :value="true" type="warning" border="left">
        Não tem donos selecionados...
      </v-alert>
    </template>
  </Campo>
</template>

<script>
const labels = require("@/config/labels").classeCriacaoDonosOps;
const help = require("@/config/help").help;

import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["entidades"],

  components: {
    Campo,
  },

  data: function () {
    return {
      mylabels: labels,
      myhelp: help,
      headers: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" },
        { text: "Remover" },
      ],
    };
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    unselectEntidade: function (entidade) {
      this.$emit("unselectEntidade", entidade);
    },
  },
};
</script>
<style></style>
