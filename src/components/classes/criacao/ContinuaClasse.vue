<template>
  <div>
    <ContinuaClasse12 :obj="obj" v-if="obj.objeto.nivel < 3" />
    <ContinuaClasse34 :obj="obj" v-else />
  </div>
</template>

<script>
import ContinuaClasse12 from "@/components/classes/criacao/ContinuaClasse12.vue";
import ContinuaClasse34 from "@/components/classes/criacao/ContinuaClasse34.vue";

export default {
  props: ["obj"],

  components: {
    ContinuaClasse12,
    ContinuaClasse34
  }
};
</script>
