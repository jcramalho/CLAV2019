<template>
  <v-app-bar app color="indigo darken-4" dark height="64px">
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
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <v-toolbar-title class="subheading">
      <v-btn
        color="indigo accent-4"
        to="/users/autenticacao"
        v-if="this.$store.state.name === ''"
      >
        Autenticação
      </v-btn>
      <!-- <v-btn
        color="indigo accent-4"
        to="/users/login"
        v-if="this.$store.state.name === ''"
      >
        Login
      </v-btn> -->
      <!-- <span v-if="this.$store.state.name != ''">
        <notification-bell
          :size="10"
          :count="2"
          counterLocation="upperRight"
          counterStyle="roundRectangle"
          counterBackgroundColor="#FF0000"
          counterTextColor="#FFFFFF"
          iconColor="primary"
        />
      </span> -->
      <span class="font-weight-light ma-2" v-if="this.$store.state.name != ''">
        <!--v-btn icon>
          <notification-bell
          :size="25"
          :count="this.counter"
          counterLocation="upperRight"
          counterStyle="roundRectangle"
          counterBackgroundColor="#FF0000"
          counterTextColor="#FFFFFF"
          iconColor="#3a88fe"
        />
        </v-btn-->
        {{ this.$store.state.name }}</span
      >
      <v-btn
        class="mr-2"
        color="indigo accent-4"
        v-if="this.$store.state.name != ''"
        @click="$router.push('/users/alteracaoPassword')"
      >
        Alterar Password
      </v-btn>
      <v-btn
        color="indigo accent-4"
        v-if="this.$store.state.name != ''"
        @click="logoutUtilizador"
      >
        Logout
      </v-btn>
      <!--v-btn
        color="red"
        v-if="this.$store.state.name != ''"
        @click="testJWT"
      >
        JWT
      </v-btn-->
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
import NotificationBell from "vue-notification-bell";

export default {
  data() {
    return {
      snackbar: false,
      color: "",
      timeout: 4000,
      text: "",
      counter: 10
    };
  },
  components: {
    NotificationBell
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    logoutUtilizador() {
      this.text = "Logout efetuado com sucesso!";
      this.color = "success";
      this.snackbar = true;
      // this.$store.state.name = '';
      // this.$store.state.token = '';
      this.$store.commit("guardaTokenUtilizador", "");
      this.$store.commit("guardaNomeUtilizador", "");

      //se já está na página inicial (home)
      if (this.$route.path == "/") {
        //faz reload da página para atualizar os componentes que dependem do nível do utilizador
        this.$router.go();
      } else {
        this.$router.push("/");
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    async testJWT() {
      var res = await this.$request(
        "get",
        "/api/users/listarToken/" + this.$store.state.token
      );
      alert(JSON.stringify(res.data));
    }
  }
};
</script>
