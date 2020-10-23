<template>
  <div>
    <div v-if="newSerie.tipo != 'Subsérie'">
      <EntidadesProdutoras :newSerie="newSerie" :RE="RE" :editar="editar" />

      <Legislacao
        :newSerie="newSerie"
        :legislacao="legislacao"
        :classes="classes"
        :legislacaoProcessada="legislacaoProcessada"
        :tipos="tipos"
      />
    </div>
    <RelacoesEntidades :newSerie="newSerie" :classes="classes" :formaContagem="formaContagem" />
  </div>
</template>

<script>
import EntidadesProdutoras from "./EntidadesProdutoras";
import Legislacao from "./Legislacao";
import RelacoesEntidades from "./RelacoesClasse";

export default {
  props: [
    "newSerie",
    "classes",
    "legislacao",
    "RE",
    "legislacaoProcessada",
    "formaContagem",
    "editar",
    "tipos"
  ],
  components: {
    EntidadesProdutoras,
    Legislacao,
    RelacoesEntidades
  }
};
</script>
