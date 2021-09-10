<template>
  <Campo
    nome="Processo Transversal"
    infoHeader="Processo Transversal"
    :infoBody="myhelp.Classe.Campos.ProcessoTransversal"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <v-radio-group v-model="c.procTrans" row dense hide-details>
        <v-radio
          v-for="(o, i) in simNao"
          :key="i"
          :label="o.label"
          :value="o.value"
          color="indigo darken-3"
        ></v-radio>
      </v-radio-group>
    </template>
  </Campo>
</template>

<script>
const help = require("@/config/help").help;
import Campo from "@/components/generic/Campo";

export default {
  props: ["c"],

  components: {
    Campo,
  },

  data: () => {
    return {
      myhelp: help,
      simNao: [
        { label: "Não", value: "N" },
        { label: "Sim", value: "S" },
      ],
    };
  },
};
</script>
<style></style>
