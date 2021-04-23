<template>
  <CriaClasse @limpar="destroy = true" />
</template>

<script>
import CriaClasse from "@/components/classes/criacao/CriaClasse.vue"; // @ is an alias to /src

export default {
  name: "criaClasse",
  components: {
    CriaClasse,
  },
  data() {
    return {
      destroy: false,
    };
  },
  beforeDestroy() {
    console.log("Main Vue destroyed");
  },
  deactivated() {
    if (this.destroy) {
      console.log("deactivated");
      this.$destroy();
    }
  },
};
</script>
