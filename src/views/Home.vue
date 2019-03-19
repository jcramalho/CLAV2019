<template>
  <ListaPedidos @pedidoSelected="consultaPedido($event)"/>
</template>

<script>
import ListaPedidos from "@/components/ListaPedidos.vue"; // @ is an alias to /src

export default {
  components: {
        ListaPedidos
    },
  methods: {
    consultaPedido: function(item){
      this.$router.push('/consulta/' + item.codigo);
    }
  }
}
</script>
