<template>
  <ListaPendentes @pendenteSelected="consultaPendente($event)" />
</template>

<script>
import ListaPendentes from "@/components/pendentes/ListaPendentes.vue"; // @ is an alias to /src

export default {
  components: {
    ListaPendentes
  },
  methods: {
    consultaPendente: function(item) {
      this.$router.push("/pendentes/" + item.codigo);
    }
  }
};
</script>
