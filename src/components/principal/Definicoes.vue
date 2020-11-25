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
      class="d-flex justify-center pt-4 mt-12">
      <v-toolbar-title class="font-weight-medium" id="drawer-title"> Definições </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item @click="$router.push('/users/pedidos')">
            <v-list-item-content>
              {{ this.$store.state.name }}
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>account_circle</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="$router.push('/users/alteracaoPassword')">
            <v-list-item-content>
              Alterar Password
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>compare_arrows</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="logoutUtilizador">
            <v-list-item-content>
              Terminar sessão
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>arrow_back</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["level", "drawer"],

  data() {
    return {
      panelHeaderColor: "indigo darken-4",
    };
  },
  methods: {
    logoutUtilizador() {
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