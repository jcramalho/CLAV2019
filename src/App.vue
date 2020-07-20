<template>
  <v-app v-if="authenticated">
    <MainPageHeader
      :n="notificacoes ? notificacoes.length : '0'"
      @drawerNotificacoes="drawerNotificacoes()"
      @drawerDefinicoes="drawerDefinicoes()"
    />
    <v-snackbar v-model="snackbar" :color="color" :top="true" :timeout="0">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <v-content :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">
      <router-view />
      <Notificacoes
        v-if="this.$store.state.name != ''"
        :drawer="drawN"
        :notificacoes="notificacoes"
        @removerNotificacao="removerNotificacao($event)"
      />
      <Definicoes v-if="this.$store.state.name != ''" :drawer="drawD" />
      <!--
      <Estatisticas
        v-if="this.$store.state.name != '' && level >= 3.5"
        :drawer="drawE"
      />-->
    </v-content>

    <PageFooter />
  </v-app>
</template>

<script>
import PageFooter from "@/components/PageFooter.vue"; // @ is an alias to /src
import MainPageHeader from "@/components/MainPageHeader.vue"; // @ is an alias to /src
import Definicoes from "@/components/principal/Definicoes.vue";
// import Estatisticas from "@/components/principal/Estatisticas.vue";
import Notificacoes from "@/components/principal/Notificacoes.vue";
import io from "socket.io-client"
const lhost = require("@/config/global").host;

export default {
  name: "App",
  components: {
    PageFooter,
    MainPageHeader,
    Definicoes,
    // Estatisticas,
    Notificacoes
  },
  watch: {
    authenticated(val){
      if(this.$store.state.token) {
        var socket = io.connect('lhost');
        socket.emit('email', {
          email: this.$verifyTokenUser().email
        });
        socket.on(this.$verifyTokenUser().email, (data) => {
          console.log(data)
          this.notificacoes.push(JSON.parse(data))
        })
      } 
    },
    async $route(to, from) {
      //verifica se o utilizador está autenticado
      if (this.$store.state.token != "") {
        var user = this.$verifyTokenUser();
        this.level = user.level;
      }

      this.authenticated = false;
      //verifica se o utilizador tem de estar autenticado para aceder à rota
      if (to.matched.some(record => !record.meta.levels.includes(0))) {
        if (this.$store.state.token != "" && this.level > 0) {
          //se está autenticado, verifica se tem permissões suficientes para a ceder a página
          if (
            to.matched.some(record => record.meta.levels.includes(this.level))
          ) {
            this.authenticated = true;
          } else {
            this.text = "Não tem permissões para aceder a esta página!";
            this.color = "error";
            this.snackbar = true;
            this.$router.push("/");
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
      // this.drawE = false;
      this.drawN = !this.drawN;
    },
    drawerDefinicoes() {
      // this.drawE = false;
      this.drawN = false;
      this.drawD = !this.drawD;
    },
    drawerEstatisticas() {
      this.drawD = false;
      this.drawN = false;
      // this.drawE = !this.drawE;
    },
    async removerNotificacao(id) {
      try {
        await this.$request("delete", "/notificacoes/" + id);
        this.notificacoes = this.notificacoes.filter(notificacao => {
          return notificacao._id !== id;
        });
      } catch (error) {
        return error;
      }
    }
  },
  data: () => ({
    drawD: false,
    // drawE: false,
    drawN: false,
    snackbar: false,
    notificacoes: [],
    authenticated: false,
    color: "",
    text: "",
    classeOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    entidadeOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    tipologiaOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    legislacaoOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    level: 0
  })
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap");
#app {
  font-family: "Montserrat", sans-serif;
}
.v-application--wrap {
  background-color: #f3f7fc;
}
.v-application p {
  margin-bottom: 0 !important;
}
.v-btn {
  text-transform: none !important;
  font-weight: 600 !important;
}
.v-text-field .v-label {
  left: 0 !important;
  right: 0 !important;
  margin: auto !important;
}
.v-form .v-label {
  margin: 0 !important;
}
.v-input__slot::before {
  border-color: #4da0d0 !important;
}
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
.v-text-field > .v-input__control > .v-input__slot::after {
  border-width: 2px !important;
}
b {
  font-weight: 500 !important;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}
.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  fill: #ffffff !important;
}
</style>
