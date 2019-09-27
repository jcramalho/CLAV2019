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
      if (to.matched.some(record => record.meta.level > 0)) {
        if (this.$store.state.token != "") {
          //verifica se o utilizador está autenticado
          try {
            var res = await this.$request("get", "/api/users/verificaToken");
            //se está autenticado, verifica se tem permissões suficientes para a ceder a página
            if (
              to.matched.some(record => res.data.level >= record.meta.level)
            ) {
              this.authenticated = true;
            } else {
              this.text = "Não tem permissões para aceder a esta página!";
              this.color = "error";
              this.snackbar = true;
              this.$router.push("/");
            }
          } catch (erro) {
            this.text = "A sua sessão expirou! Por favor faça login novamente.";
            this.color = "error";
            this.snackbar = true;
            this.$store.commit("guardaTokenUtilizador", "");
            this.$store.commit("guardaNomeUtilizador", "");
            this.$router.push("/users/autenticacao");
          }
        } else {
          this.text =
            "Não tem permissões para aceder a esta página! Por favor faça login.";
          this.color = "error";
          this.snackbar = true;
          this.$router.push("/users/autenticacao");
        }
      } else {
        //verifica se há algum erro ao tentar realizar um pedido à API, em caso afirmativo amostra o erro
        if (this.$route.query.erro) {
          this.text = this.$route.query.erro;
          this.color = "error";
          this.snackbar = true;
        }
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
