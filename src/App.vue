<template>
  <v-app v-if="authenticated">
    <MainPageHeader 
      @drawerDefinicoes="drawerDefinicoes()"
      @drawerEstatisticas="drawerEstatisticas()"/>

    <v-snackbar 
      v-model="snackbar" 
      :color="color" 
      :top="true" 
      :timeout="0">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <v-content>
      <router-view/>

      <Definicoes 
        v-if="this.$store.state.name != ''"
        :drawer="drawD"/> 
      <Estatisticas 
        v-if="this.$store.state.name != '' && level >= 3.5"
        :drawer="drawE"/> 
    </v-content>

    <PageFooter />
  </v-app>
</template>

<script>
/* eslint-disable */
import PageFooter from "@/components/PageFooter.vue"; // @ is an alias to /src
import MainPageHeader from "@/components/MainPageHeader.vue"; // @ is an alias to /src
import Definicoes from "@/components/principal/Definicoes.vue";
import Estatisticas from "@/components/principal/Estatisticas.vue";

export default {
  name: "App",
  components: {
    PageFooter,
    MainPageHeader,
    Definicoes,
    Estatisticas
  },
  watch: {
    async $route(to, from) {
      //verifica se o utilizador está autenticado
      if (this.$store.state.token != "") {
        try{
          var res = await this.$request("get", "/users/token");
          this.level = res.data.level;
        } catch (erro) {
          this.text = "A sua sessão expirou! Por favor faça login novamente.";
          this.color = "error";
          this.snackbar = true;
          this.$store.commit("guardaTokenUtilizador", "");
          this.$store.commit("guardaNomeUtilizador", "");
          this.$router.push("/users/autenticacao");
        }
      }

      this.authenticated = false;
      //verifica se o utilizador tem de estar autenticado para aceder à rota
      if (to.matched.some(record => !record.meta.levels.includes(0))) {
        if (this.$store.state.token != "" && this.level > 0) {
            //se está autenticado, verifica se tem permissões suficientes para a ceder a página
            if (to.matched.some(record => record.meta.levels.includes(this.level))){
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
    drawerDefinicoes() {
      this.drawE = false;
      this.drawD = !this.drawD;
    },
    drawerEstatisticas() {
      this.drawD = false;
      this.drawE = !this.drawE;
    }
  },
  data: () => ({
    drawD: false,
    drawE: false,
    snackbar: false,
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
