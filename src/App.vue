<template>
  <v-app v-if="authenticated">
    <MainPageHeader 
      :n="notificacoes ? notificacoes.length : '0'"
      @drawerNotificacoes="drawerNotificacoes()" 
      @drawerDefinicoes="drawerDefinicoes()"/>

    <v-snackbar 
      v-model="snackbar" 
      :color="color" 
      :top="true" 
      :timeout="0">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <v-content>
      <router-view @userNotificacoes="userNotificacoes($event)"/>
      
      <Notificacoes 
        v-if="this.$store.state.name != ''"
        :drawer="drawN" 
        :notificacoes="notificacoes"
        @removerNotificacao="removerNotificacao($event)"/> 
      <Definicoes 
        v-if="this.$store.state.name != ''"
        :drawer="drawD"/> 
    </v-content>

    <PageFooter />
  </v-app>
</template>

<script>
/* eslint-disable */
import PageFooter from "@/components/PageFooter.vue"; // @ is an alias to /src
import MainPageHeader from "@/components/MainPageHeader.vue"; // @ is an alias to /src
import Definicoes from "@/components/principal/Definicoes.vue";
import Notificacoes from "@/components/principal/Notificacoes.vue";

export default {
  name: "App",
  components: {
    PageFooter,
    MainPageHeader,
    Definicoes,
    Notificacoes
  },
  watch: {
    async $route(to, from) {
      this.authenticated = false;
      //verifica se o utilizador tem de estar autenticado para aceder à rota
      if (to.matched.some(record => !record.meta.levels.includes(0))) {
        if (this.$store.state.token != "") {
          //verifica se o utilizador está autenticado
          try {
            var res = await this.$request("get", "/users/token");
            //se está autenticado, verifica se tem permissões suficientes para a ceder a página
            if (
              to.matched.some(record =>
                record.meta.levels.includes(res.data.level)
              )
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
        this.authenticated = true;
      }

      if (this.$route.query.erro) {
        //msg de erro
        this.text = this.$route.query.erro;
        this.color = "error";
        this.snackbar = true;
        this.$router.push(this.$route.path);
      } else if (this.$route.query.sucesso) {
        //msg de sucesso
        this.text = this.$route.query.sucesso;
        this.color = "success";
        this.snackbar = true;
        this.$router.push(this.$route.path);
      }
    }
  },

  methods: {
    fecharSnackbar() {
      this.snackbar = false;
    },
    sizeUpdate(size) {
      this.size = size;
    },
    drawerNotificacoes() {
      this.drawD = false;
      this.drawN = !this.drawN;
    },
    drawerDefinicoes() {
      this.drawN = false;
      this.drawD = !this.drawD;
    },
    userNotificacoes(notificacoes) {
      this.notificacoes = notificacoes
    },
    removerNotificacao(id) {
      try {
        this.$request("delete", "/notificacoes/" + id);
        this.notificacoes = this.notificacoes.filter(notificacao => {
          return notificacao._id !== id;
        });
      } catch (error) {
        return error;
      }
    }
  },
  data: () => ({
    notificacoes: null,
    drawN: false,
    drawD: false,
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
