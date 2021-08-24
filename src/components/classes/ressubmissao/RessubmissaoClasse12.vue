<template>
  <!-- HEADER -->
  <v-card class="ma-2" flat>
    <!-- Header -->
    <v-row align="center" justify="center">
      <v-col cols="12" sm="3" align="center" justify="center">
        <Voltar />
      </v-col>
      <v-col cols="12" sm="9" align="center" justify="center">
        <p class="clav-content-title-1">Ressubmeter Classe</p>
        <p class="clav-content-title-2">Nível: {{ classe.nivel }}</p>
      </v-col>
    </v-row>

    <v-card-text>
      <!-- CÓDIGO DA NOVA CLASSE -->
      <Campo
        nome="Código"
        color="neutralpurple"
        infoHeader="Código da Classe"
        :infoBody="myhelp.Classe.Campos.Codigo"
      >
        <template v-slot:conteudo>
          <v-text-field
            class="mt-n4 px-3"
            v-model="classe.codigo"
            label="Código"
            text
            hide-details
            single-line
            clearable
          ></v-text-field>
        </template>
      </Campo>

      <!-- TÍTULO -->
      <Campo
        nome="Título"
        color="neutralpurple"
        infoHeader="Título da Classe"
        :infoBody="myhelp.Classe.Campos.Titulo"
        class="mb-2"
      >
        <template v-slot:conteudo>
          <v-text-field
            class="mt-n4 px-3"
            v-model="classe.titulo"
            label="Título"
            text
            hide-details
            single-line
            clearable
          ></v-text-field>
        </template>
      </Campo>

      <v-expansion-panels>
        <!-- DESCRITIVO DA CLASSE -->
        <BlocoDescritivo :c="classe" />
      </v-expansion-panels>
    </v-card-text>

    <!-- TODO: Corrigir este componente -->
    <PainelOperacoesCont :o="auxobj" :pedido="obj" />
  </v-card>
</template>

<script>
const help = require("@/config/help").help;

import Voltar from "@/components/generic/Voltar.vue";
import Campo from "@/components/generic/Campo.vue";
import BlocoDescritivo from "@/components/classes/criacao/BlocoDescritivo.vue";
import PainelOperacoesCont from "@/components/classes/criacao/PainelOperacoesCont.vue";

export default {
  props: ["obj"],

  components: {
    BlocoDescritivo,
    PainelOperacoesCont,
    Voltar,
    Campo,
  },

  data: () => ({
    // Objeto que guarda uma classe
    classe: {},
    auxobj: {},

    // Estruturas auxiliares

    myhelp: help,
  }),

  created: async function () {
    this.classe = this.obj.objeto.dados;
    this.auxobj.objeto = this.obj.objeto.dados;
  },
};
</script>

<style scoped></style>
