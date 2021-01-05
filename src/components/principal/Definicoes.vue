<template>
  <v-navigation-drawer
    :value="drawer"
    width="320px"
    right
    absolute
    style="position: fixed; top: 38px"
  >
    <v-toolbar dark class="d-flex justify-center pt-4 mt-12">
      <v-toolbar-title class="font-weight-medium" id="drawer-title">
        Definições
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-list dense rounded dark>
        <v-list-item-group color="primary">
          <v-list-item @click="$router.push('/users/pedidos')">
            <v-list-item-content class="font-weight-medium">
              {{ this.$store.state.name }}</v-list-item-content
            >
            <v-list-item-icon>
              <v-icon>account_circle</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="$router.push('/users/alteracaoPassword')">
            <v-list-item-content>
              <p class="font-weight-medium" id="alterarPasswordText">Alterar Password</p>
            </v-list-item-content>
            <unicon
              name="alterar-password-icon"
              width="22"
              height="22"
              viewBox="0 0 20.71 20.404"
              fill="#ffd54f"
            />
          </v-list-item>
          <v-list-item @click="logoutUtilizador">
            <v-list-item-content>
              <p class="font-weight-medium" id="terminarSessaoText">Terminar sessão</p>
            </v-list-item-content>
            <unicon
              name="terminar-sessao-icon"
              width="22"
              height="22"
              viewBox="0 0 20.71 23.481"
              fill="#ef5350"
            />
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["level", "drawer"],
  methods: {
    logoutUtilizador() {
      //this.socket.disconnect();
      this.$router.push("/users/logout");
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
#alterarPasswordText {
  color: #ffd54f !important;
}
#terminarSessaoText {
  color: #ef5350 !important;
}
</style>
