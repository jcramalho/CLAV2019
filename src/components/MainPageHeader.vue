<template>
  <v-toolbar app color="indigo darken-4" dark>
    <v-btn to="/" icon>
      <v-icon large>home</v-icon>
    </v-btn>
    <v-toolbar-title class="headline" @click="goHome">
      <span class="text-uppercase">CLAV</span>
      <span class="font-weight-light">
        - Classificação e Avaliação da Informação Pública</span
      >
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
      :top="true"
    >
      {{ text }}
      <v-btn flat @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <v-toolbar-title class="subheading">
      <v-btn
        color="indigo accent-4"
        to="/autenticacao"
        v-if="this.$store.state.user.name === ''"
      >
        Autenticação
      </v-btn>
      <!-- <v-btn
        color="indigo accent-4"
        to="/login"
        v-if="this.$store.state.user.name === ''"
      >
        Login
      </v-btn> -->
      <span
        class="font-weight-light"
        v-if="this.$store.state.user.name != ''"
        >{{ this.$store.state.user.name }}</span
      >
      <v-btn
        color="indigo accent-4"
        v-if="this.$store.state.user.name != ''"
        @click="logoutUtilizador"
      >
        Logout
      </v-btn>
      <v-btn
        color="red"
        v-if="this.$store.state.user.name != ''"
        @click="testJWT"
      >
        JWT
      </v-btn>
    </v-toolbar-title>
  </v-toolbar>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  data() {
    return {
      snackbar: false,
      color: "",
      timeout: 4000,
      text: ""
    };
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    logoutUtilizador() {
      this.text = "Logout efetuado com sucesso!";
      this.color = "success";
      this.snackbar = true;
      // this.$store.state.user.name = '';
      // this.$store.state.user.token = '';
      this.$store.commit("guardaTokenUtilizador", "");
      this.$store.commit("guardaNomeUtilizador", "");
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    async testJWT() {
      var res = await axios.get(
        lhost + "/api/users/listarToken/" + this.$store.state.user.token
      );
      alert(JSON.stringify(res.data));
    }
  }
};
</script>
