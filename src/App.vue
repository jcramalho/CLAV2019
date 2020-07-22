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
    </v-content>

    <PageFooter />
  </v-app>
</template>

<script>
import PageFooter from "@/components/PageFooter.vue"; // @ is an alias to /src
import MainPageHeader from "@/components/MainPageHeader.vue"; // @ is an alias to /src
import Definicoes from "@/components/principal/Definicoes.vue";
import Notificacoes from "@/components/principal/Notificacoes.vue";
import io from "socket.io-client"
const lhost = require("@/config/global").host;

export default {
  name: "App",
  components: {
    PageFooter,
    MainPageHeader,
    Definicoes,
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
.v-alert {
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
.v-application .body-2 {
  font-family: "Montserrat", sans-serif !important;
}
.v-application .caption {
  font-family: "Montserrat", sans-serif !important;
}
.v-application--wrap {
  background-color: #f3f7fc;
}
.v-application p {
  margin-bottom: 0 !important;
}
.v-application a {
  color: #1976d2 !important;
}
.v-application a:hover {
  color: #1a237e;
  background-color: transparent;
}
.v-application--is-ltr .v-text-field__prefix {
  padding-right: 12px !important;
}
.v-application--is-ltr .v-treeview-node__toggle--open {
  color: #46c354 !important;
}
.v-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  outline: none !important;
}
.v-btn__content {
  width: 100%;
  white-space: normal;
}
.v-card__subtitle,
.v-card__text {
  line-height: 1.8rem !important;
}
.v-content {
  padding: 5.125rem 0 1.75rem !important;
  color: #606060 !important;
}
.v-expansion-panel-header__icon {
  margin-left: -29px !important;
}
.theme--light.v-expansion-panels
  .v-expansion-panel-header
  .v-expansion-panel-header__icon
  .v-icon {
  color: white !important;
}
.theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
  border-image: repeating-linear-gradient(
      to right,
      rgba(1, 85, 181, 0.38) 0px,
      rgba(1, 85, 181, 0.38) 2px,
      transparent 2px,
      transparent 4px
    )
    1 repeat !important;
}
.v-form .v-label {
  margin: 0 !important;
}
.v-input__slot {
  margin-bottom: 0 !important;
}
.v-input__slot::before {
  border-color: #4da0d0 !important;
}
.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
.v-input--switch--inset .v-input--switch__track,
.v-input--switch--inset .v-input--selection-controls__input {
  margin: auto !important;
}
.theme--light.v-input input,
.theme--light.v-input textarea,
.theme--light.v-select .v-select__selection--comma {
  color: #000000 !important;
  font-weight: bold !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}
.theme--light.v-input--is-disabled input,
.theme--light.v-input--is-disabled textarea {
  color: rgba(0, 0, 0, 0.38) !important;
}
.v-icon.v-icon.v-icon--link {
  color: #0155b5;
}
.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  fill: #ffffff !important;
}
.v-menu__content {
  border-radius: 0px 0px 10px 10px !important;
}
.v-snack__wrapper {
  border-radius: 40px !important;
}
.v-text-field .v-label {
  left: 0 !important;
  right: 0 !important;
  margin: auto !important;
}
.v-text-field .v-label {
  max-width: 100% !important;
}
.v-text-field > .v-input__control > .v-input__slot::after {
  border-width: 2px !important;
}
.v-text-field input {
  letter-spacing: 3px;
}
b {
  font-weight: 500 !important;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}
.content-title-1 {
  font-size: 2rem;
  font-weight: 600;
  color: #4da0d0;
  text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.32);
  padding-bottom: 2rem;
}
.content-title-2 {
  font-size: 1.2rem;
  font-weight: 500;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22);
}
.content-text {
  color: #666666 !important;
  font-size: 1rem;
  word-spacing: 2px;
  line-height: 1.8;
}
#default-button {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
    0 2px 4px -1px rgba(0, 0, 0, 0.36) !important;
  outline: none !important;
}
#default-button:hover {
  background: linear-gradient(to right, #353d83 0%, #216fc7 100%);
}
label {
  margin-bottom: 0 !important;
}
</style>
