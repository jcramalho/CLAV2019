<template>
  <div>
    <RessubmissaoClasse12 :obj="c" v-if="c.objeto.dados.nivel < 3" />
    <RessubmissaoClasse34 :obj="c" v-else />
  </div>
</template>

<script>
import RessubmissaoClasse12 from "@/components/classes/ressubmissao/RessubmissaoClasse12.vue";
import RessubmissaoClasse34 from "@/components/classes/ressubmissao/RessubmissaoClasse34.vue";

export default {
  props: ["ts"],

  components: {
    RessubmissaoClasse12,
    RessubmissaoClasse34,
  },
};
</script>
