<template>
  <v-app v-if="authenticated">
    <!-- Header -->
    <MainPageHeader
      :n="notificacoes ? notificacoes.length : 0"
      @drawerDefinicoes="drawerDefinicoes()"
    />

    <!-- Drawers -->
    <Definicoes v-if="this.$store.state.token" :drawer="drawD" />
    <!-- <Notificacoes
      v-if="this.$store.state.token != ''"
      :drawer="drawN"
      :notificacoes="notificacoes"
      @removerNotificacao="removerNotificacao($event)"
    /> -->

    <!-- Main content -->
    <v-main>
      <v-row justify="center" class="my-5">
        <v-col cols="12" sm="12" md="11">
          <keep-alive :include="['pedidos', 'criaClasse']">
            <router-view />
          </keep-alive>
        </v-col>
      </v-row>
    </v-main>

    <!-- Footer -->
    <!-- <PageFooter /> -->

    <!-- Utils -->
    <v-snackbar v-model="snackbar" :color="color" :top="true" :timeout="4000">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
/* eslint-disable */
import PageFooter from "@/components/PageFooter.vue"; // @ is an alias to /src
import MainPageHeader from "@/components/MainPageHeader.vue"; // @ is an alias to /src
import Definicoes from "@/components/principal/Definicoes.vue";
import Notificacoes from "@/components/principal/Notificacoes.vue";
// import io from "socket.io-client";
import { bus } from "./main";
const lhost = require("@/config/global").host;

export default {
  name: "App",
  components: {
    PageFooter,
    MainPageHeader,
    Definicoes,
    Notificacoes,
  },
  watch: {
    async $route(to, from) {
      //verifica se o utilizador está autenticado
      if (this.$store.state.token != "") {
        var user = this.$verifyTokenUser();
        this.level = user.level;
      }

      this.authenticated = false;
      //verifica se o utilizador tem de estar autenticado para aceder à rota
      if (to.matched.some((record) => !record.meta.levels.includes(0))) {
        if (this.$store.state.token != "" && this.level > 0) {
          //se está autenticado, verifica se tem permissões suficientes para a ceder a página
          if (to.matched.some((record) => record.meta.levels.includes(this.level))) {
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
    },
  },

  methods: {
    fecharSnackbar() {
      this.snackbar = false;
    },
    sizeUpdate(size) {
      this.size = size;
    },
    drawerDefinicoes() {
      //this.drawN = false;
      this.drawD = !this.drawD;
    },
    // drawerNotificacoes() {
    //   this.drawD = false;
    //   this.drawN = !this.drawN;
    // },
    // removerNotificacao(msg) {
    //   const index = this.notificacoes.indexOf(msg);
    //   if (index > -1) {
    //     this.notificacoes.splice(index, 1);
    //   }
    //   this.socket.emit("remove", msg);
    // },
    // consume() {
    //   this.notificacoes = [];
    //   var email = this.$verifyTokenUser().email;
    //   if (email) {
    //     this.socket = io.connect("http://localhost:7779", {
    //       reconnectionAttempts: 1,
    //     }); //lhost.replace('/v2', '')
    //     this.socket.emit("email", {
    //       email: email,
    //     });
    //     this.socket.on(this.$verifyTokenUser().email, (data) => {
    //       this.notificacoes.push(JSON.parse(data));
    //     });
    //   }
    // },
  },
  data: () => ({
    drawD: false,
    //drawN: false,
    snackbar: false,
    authenticated: false,
    notificacoes: [],
    color: "",
    text: "",
    classeOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    entidadeOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    tipologiaOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    legislacaoOps: ["Listar", "Consultar", "Inserir", "Alterar", "Desativar"],
    level: 0,
  }),
  // created() {
  //   if (this.$store.state.token != "") this.consume();
  //   bus.$on("notificacoes", (d) => {
  //     this.consume();
  //   });
  // },
};
</script>

<style>
/* TODO /* TODO /* TODO /* TODO
/* TODO Para remover depois de remover todas as utilizações */

.v-text-field--filled > .v-input__control > .v-input__slot {
  background: none !important;
}
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
.v-input--switch--inset .v-input--switch__track,
.v-input--switch--inset .v-input--selection-controls__input {
  margin: auto !important;
}
.v-input input,
.v-input textarea,
.v-select .v-select__selection--comma {
  color: #000000 !important;
  font-weight: bold !important;
  text-shadow: 0px 1px 2px var(--v-textshadow-base) !important;
}
.v-input--is-disabled input,
.v-input--is-disabled textarea {
  color: var(--v-textshadow-base) !important;
}
</style>
