<template>
  <v-app v-if="authenticated">
    <MainPageHeader />

    <v-snackbar v-model="snackbar" :color="color" :top="true" :timeout="0">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <v-content>
      <router-view />
    </v-content>

    <PageFooter />
  </v-app>
</template>

<script>
import PageFooter from "@/components/PageFooter.vue"; // @ is an alias to /src
import MainPageHeader from "@/components/MainPageHeader.vue"; // @ is an alias to /src

const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  name: "App",
  components: {
    PageFooter,
    MainPageHeader
  },
  watch: {
    async $route(to, from) {
      this.authenticated = false;
      //verifica se o utilizador tem de estar autenticado para aceder à rota
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (this.$store.state.token != "") {
          try {
            var res = await axios.get(
              lhost + "/api/users/verificaToken?token=" + this.$store.state.token
            );
            this.authenticated = true;
          } catch (erro) {
            this.text = "A sua sessão expirou! Por favor faça login novamente.";
            this.color = "error";
            this.snackbar = true;
            this.$store.commit("guardaTokenUtilizador", "");
            this.$store.commit("guardaNomeUtilizador", "");
            this.$router.push("/users/autenticacao");
          }
        } else {
          this.text = "Não tem permissões para aceder a esta página! Por favor faça login.";
          this.color = "error";
          this.snackbar = true;
          this.$router.push("/users/autenticacao");
        }
      } else {
        this.authenticated = true;
      }
    }
  },
  methods: {
    fecharSnackbar() {
      this.snackbar = false;
    }
  },
  data: () => ({
    snackbar: false,
    authenticated: false,
    color: "",
    text: "",
    classeOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    entidadeOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    tipologiaOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    legislacaoOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"]
  })
};
</script>
