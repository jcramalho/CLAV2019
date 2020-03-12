<template>
  <v-app-bar app color="indigo darken-4" dark height="64px">
    <v-btn to="/" icon>
      <v-icon large>home</v-icon>
    </v-btn>
    <v-toolbar-title class="headline" @click="goHome">
      
      <span 
        class="text-uppercase" 
        v-if="this.$store.state.name != ''"
      >
        CLAV | {{ this.$store.state.entidade.split('_')[1] }} 
      </span>

      <span 
        class="text-uppercase"
        v-if="this.$store.state.name == ''"
      >
        CLAV
      </span>
      <span 
        class="font-weight-light"
        v-if="this.$store.state.name == ''"
      >
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
        Iniciar Sessão
      </v-btn>

      <v-btn
        v-if="this.$store.state.name != ''"
        @click="drawerNotificacoes"
        icon
      >
        <v-badge
          color="blue"
          :content="n"
          overlap
        >
          <v-icon large>notification_important</v-icon>
        </v-badge>
      </v-btn>
      <v-btn
        v-if="this.$store.state.name != ''"
        @click="drawerDefinicoes"
        icon
      >
        <v-icon large>settings</v-icon>
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

export default {
  props: ["n"],
  data() {
    return {
      snackbar: false,
      color: "",
      timeout: 4000,
      text: "",
      counter: 10
    };
  },
  methods: {
    goHome() {
      this.$router.push("/entidade");
    },
    drawerNotificacoes() {
      this.$emit('drawerNotificacoes');
    },
    drawerDefinicoes() {
      this.$emit('drawerDefinicoes');
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    async testJWT() {
      var res = await this.$request(
        "get",
        "/users/" + this.$store.state.token + "/token"
      );
      alert(JSON.stringify(res.data));
    }
  }
};
</script>
