<template>
  <ListaPedidos @pedidoSelected="consultaPedido($event)" />
</template>

<script>
import ListaPedidos from "@/components/pedidos/ListaPedidos.vue"; // @ is an alias to /src

export default {
  components: {
    ListaPedidos
  },
  methods: {
    consultaPedido: function(item) {
      switch(item.objeto.tipo){
        case 'Classe':  this.$router.push("/classes/showPedido/" + item.codigo);
                        break;
        default: this.$router.push("/pedidos/" + item.codigo);
      }
    }
  }
};
</script>
