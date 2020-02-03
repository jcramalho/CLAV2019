<template>
  <tr>
    <td class="subheading">{{ item.termo }}</td>
    <td class="subheading">{{ item.idClasse }}</td>
    <td class="subheading">{{ item.tituloClasse }}</td>
    <!-- <td>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            @click="showPedido(props.item)"
            color="indigo darken-2"
            v-on="on"
            >visibility</v-icon
          >
        </template>
        <span>Ver pedido...</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            @click="distribuiPedido(props.item)"
            color="indigo darken-2"
            v-on="on"
            >person</v-icon
          >
        </template>
        <span>Distribuir pedido...</span>
      </v-tooltip>
      <v-tooltip bottom v-if="false">
        <template v-slot:activator="{ on }">
          <v-icon color="red darken-2" v-on="on">delete</v-icon>
        </template>
        <span>Apagar pedido</span>
      </v-tooltip>
    </td> -->
  </tr>
</template>

<script>
export default {
  props: ["item"]
};
</script>
