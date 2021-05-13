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
  deactivated() {
    if (this.destroy) {
      this.$destroy();
    }
  },
};
</script>
