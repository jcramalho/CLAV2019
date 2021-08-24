<template>
  <!-- BLOCO DESCRITIVO -->
  <PainelCLAV
    titulo="Descritivo da Classe"
    infoHeader="Descritivo da Classe"
    :infoBody="myhelp.Classe.BlocoDescritivo"
  >
    <template v-slot:icon>
      <unicon
        name="descricao-icon"
        width="20"
        height="20"
        viewBox="0 0 20.71 23.668"
        fill="#ffffff"
      />
    </template>
    <template v-slot:conteudo>
      <v-expansion-panel-content>
        <!-- DESCRIÇÂO -->
        <Campo
          nome="Descrição"
          infoHeader="Descrição"
          :infoBody="myhelp.Classe.Campos.Descricao"
          color="neutralpurple"
        >
          <template v-slot:conteudo>
            <v-textarea
              v-model="c.descricao"
              label="Descrição"
              auto-grow
              dense
              rows="1"
              hide-details
              clearable
            ></v-textarea>
          </template>
        </Campo>

        <ListaDeNotasCLAV
          nome="Notas de Aplicação"
          infoHeader="Notas de Aplicação"
          :infoBody="myhelp.Classe.Campos.NotasAp"
          :objeto="c"
          tipo="na"
        ></ListaDeNotasCLAV>

        <ListaDeNotasCLAV
          v-if="c.nivel > 2"
          nome="Exemplo(s) de Nota(s) de Aplicação"
          infoHeader="Exemplo(s) de Nota(s) de Aplicação"
          :infoBody="myhelp.Classe.Campos.ExemplosNotasAp"
          :objeto="c"
          tipo="exna"
        ></ListaDeNotasCLAV>

        <ListaDeNotasCLAV
          nome="Notas de Exclusão"
          infoHeader="Notas de Exclusão"
          :infoBody="myhelp.Classe.Campos.NotasEx"
          :objeto="c"
          tipo="ne"
        ></ListaDeNotasCLAV>

        <ListaDeNotasCLAV
          v-if="c.nivel == 3 && !c.temSubclasses4Nivel"
          nome="Termos de Índice"
          infoHeader="Termos de Índice"
          :infoBody="myhelp.Classe.Campos.TermosIndice"
          :objeto="c"
          tipo="ti"
        ></ListaDeNotasCLAV>
      </v-expansion-panel-content>
    </template>
  </PainelCLAV>
</template>

<script>
const help = require("@/config/help").help;

import Campo from "@/components/generic/Campo.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";
import ListaDeNotasCLAV from "@/components/generic/ListaDeNotasCLAV.vue";

export default {
  props: ["c"],

  components: {
    Campo,
    PainelCLAV,
    ListaDeNotasCLAV,
  },

  data() {
    return {
      myhelp: help,
    };
  },
};
</script>

<style scoped></style>
