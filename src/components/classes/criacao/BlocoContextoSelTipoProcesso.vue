<template>
  <Campo
    nome="Tipo de Processo"
    infoHeader="Tipo de Processo"
    :infoBody="myhelp.Classe.Campos.TipoProcesso"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <v-radio-group v-model="c.tipoProc" row dense hide-details>
        <v-radio
          v-for="(p, i) in processoTipos"
          :key="i"
          :label="p.label"
          :value="p.value"
          color="indigo darken-3"
        ></v-radio>
      </v-radio-group>
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";
const help = require("@/config/help").help;

export default {
  props: ["c"],

  components: {
    Campo,
  },

  data: () => {
    return {
      myhelp: help,
      processoTipos: [
        { label: "Processo Comum", value: "PC" },
        { label: "Processo Específico", value: "PE" },
      ],
    };
  },
};
</script>
<style></style>
