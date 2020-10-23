<template>
  <v-navigation-drawer :value="drawer" right absolute>
    <v-toolbar :color="panelHeaderColor" dark>
      <v-toolbar-title> Definições </v-toolbar-title>
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
