<template>
  <v-card class="mt-4">
    <v-card-title class="indigo darken-4 white--text title"
      >Pedidos Dependentes
      <v-spacer />

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            v-if="verPedidos == false"
            @click="verPedidos = !verPedidos"
            color="white"
            v-on="on"
          >
            arrow_downward
          </v-icon>
          <v-icon
            v-else
            @click="verPedidos = !verPedidos"
            color="white"
            v-on="on"
          >
            arrow_upward
          </v-icon>
        </template>
        <span>Ver pedidos dependentes...</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text v-if="verPedidos">
      <v-expansion-panels>
        <v-expansion-panel class="ma-1" v-for="(pedido, i) in pedidos" :key="i">
          <v-expansion-panel-header
            class="pa-2 indigo darken-1 title white--text"
            >{{
              !!pedido.sigla
                ? "Entidade: " + pedido.sigla + " - " + pedido.designacao
                : "Legislação: " + pedido.tipo + " - " + pedido.numero
            }}</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <showPedidoDependente :pedido_informacao="pedido" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import showPedidoDependente from "@/components/pedidos/consulta/showPedidoDependente";

export default {
  props: ["pedidos"],
  data() {
    return {
      verPedidos: false,
    };
  },
  components: {
    showPedidoDependente,
  },
};
</script>