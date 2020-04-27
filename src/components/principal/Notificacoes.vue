<template>
    <v-navigation-drawer
      :value="drawer"
      width="320px"
      right
      absolute
    >
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title> Notificações </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
          <v-expansion-panels v-if="notificacoes">
            <v-expansion-panel  v-for="(item, i) in notificacoes" :key="i">
              <v-expansion-panel-header>
                <span> Pedido: {{ item.pedido }} </span>
                <v-icon @click="removerNotificacao(item._id)">clear</v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content color="blue lighten-5">
                <span> Messagem: {{ item.acao }} de {{ item.tipo }} movido para {{ item.novoEstado }} por {{ item.responsavel }}. </span>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
      </v-card-text>
    </v-navigation-drawer>
</template>

<script>
/* eslint-disable */ 
export default {
  props: ["level","drawer","notificacoes"],

  data() {
    return {
      panelHeaderColor: "indigo darken-4",
    };
  },
  methods: {
    removerNotificacao(id) {
      this.$emit('removerNotificacao', id)
    }
  }
};
</script>