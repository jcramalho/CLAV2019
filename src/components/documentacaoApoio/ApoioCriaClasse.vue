<template>
  <v-card class="pa-3" flat>
    <!-- Header -->
    <v-card-title class="clav-content-title-1">
      Nova Secção de Documentação de Apoio
    </v-card-title>

    <!-- Content -->
    <v-card-text>
      <Campo nome="Designação" color="neutralpurple">
        <template v-slot:conteudo>
          <v-text-field
            clearable
            color="indigo"
            counter="150"
            single-line
            v-model="t.classe"
            maxlength="150"
            dense
          ></v-text-field>
        </template>
      </Campo>
    </v-card-text>
    <PainelOperacoesClasseDocumentacaoApoio :t="t" :acao="'Criação'" />
  </v-card>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";
import PainelOperacoesClasseDocumentacaoApoio from "@/components/documentacaoApoio/PainelOperacoesClasseDocumentacaoApoio";

export default {
  components: {
    PainelOperacoesClasseDocumentacaoApoio,
    Campo,
  },
  data: (nt) => ({
    t: {
      classe: "",
    },
  }),
};
</script>
<style scoped></style>
