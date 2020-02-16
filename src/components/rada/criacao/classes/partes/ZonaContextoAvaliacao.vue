<template>
  <div>
    <div v-if="newSerie.tipo != 'Subsérie'">
      <EntidadesProdutoras :newSerie="newSerie" :entidades="entidades" />
      <hr style="border: 3px solid indigo; border-radius: 2px;" />
      <Legislacao :newSerie="newSerie" />
      <hr style="border: 3px solid indigo; border-radius: 2px;" />
    </div>
    <RelacoesEntidades :newSerie="newSerie" :classes="classes" />
  </div>
</template>

<script>
import EntidadesProdutoras from "./EntidadesProdutoras";
import Legislacao from "./Legislacao";
import RelacoesEntidades from "./RelacoesClasse";

export default {
  props: ["newSerie", "entidades", "classes"],
  components: {
    EntidadesProdutoras,
    Legislacao,
    RelacoesEntidades
  }
};
</script>
