<template>
  <v-navigation-drawer
    :value="drawer"
    width="320px"
    right
    absolute
    style="position:fixed; top:38px;"
  >
    <v-toolbar
      :color="panelHeaderColor"
      dark
      class="d-flex justify-center pt-4 mt-12"
    >
      <v-toolbar-title class="font-weight-medium" id="drawer-title">
        Notificações
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels v-if="notificacoes" id="painel-notificacoes">
        <v-expansion-panel v-for="(item, i) in notificacoes" :key="i">
          <v-expansion-panel-header>
            <div>
              <p class="font-weight-medium mr-2">
                {{ item.acao }} de {{ item.tipo }} {{ item.objeto }}
              </p>
            </div>
            <template v-slot:actions>
              <v-tooltip v-if="item.pedido" bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    @click="$router.push(`/pedidos/${item.pedido}`)"
                    color="indigo darken-2"
                    v-on="on"
                  >
                    visibility
                  </v-icon>
                </template>
                <span>Ver pedido...</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    color="red"
                    @click.stop="removerNotificacao(item)"
                    v-on="on"
                  >
                    clear
                  </v-icon>
                </template>
                <span>Remover notificação</span>
              </v-tooltip>
              <v-icon color="#67cc72">$expand</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p class="pt-3">- Movido para {{ item.novoEstado }}.</p>
            <p class="pt-3">- Realizado por: {{ item.realizadoPor }}</p>
            <p v-if="item.responsavel" class="pt-3">
              - Responsável: {{ item.responsavel }}.
            </p>
            <p class="pt-3">
              - Entidade responsavel: {{ item.entidade.split("_")[1] }}
            </p>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-navigation-drawer>
</template>

<script>
/* eslint-disable */

export default {
  props: ["level", "drawer", "notificacoes"],

  data() {
    return {
      panelHeaderColor: "indigo darken-4",
    };
  },
  methods: {
    removerNotificacao(id) {
      this.$emit("removerNotificacao", id);
    },
  },
};
</script>
<style scoped>
#drawer-title {
  font-size: 1.07rem !important;
}
.theme--light.v-navigation-drawer {
  background: linear-gradient(to bottom, #19237e 0%, #0056b6 100%);
  border-radius: 0 0 0 20px;
}
theme--dark.v-footer,
.theme--dark.v-sheet,
.theme--dark.v-card {
  background-color: transparent !important;
}
.v-toolbar {
  box-shadow: none !important;
}
.v-expansion-panel-header:hover {
  background-color: rgba(20, 78, 149, 0.15) !important;
}
.theme--light.v-expansion-panels .v-expansion-panel {
  margin-top: 5px;
  border-radius: 10px;
}
.v-expansion-panel-content {
   border-radius: 0 0 10px 10px;
}

.eye {
  color:indigo
}

</style>
