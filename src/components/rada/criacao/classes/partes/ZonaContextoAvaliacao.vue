<template>
  <div>
    <div v-if="newSerie.tipo != 'Subsérie'">
      <EntidadesProdutoras :newSerie="newSerie" :RE="RE" />
      <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
      <Legislacao
        :newSerie="newSerie"
        :legislacao="legislacao"
        :classes="classes"
        :legislacaoProcessada="legislacaoProcessada"
      />
      <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
    </div>
    <RelacoesEntidades :newSerie="newSerie" :classes="classes" />
  </div>
</template>

<script>
import EntidadesProdutoras from "./EntidadesProdutoras";
import Legislacao from "./Legislacao";
import RelacoesEntidades from "./RelacoesClasse";

export default {
  props: ["newSerie", "classes", "legislacao", "RE", "legislacaoProcessada"],
  components: {
    EntidadesProdutoras,
    Legislacao,
    RelacoesEntidades
  }
};
</script>
