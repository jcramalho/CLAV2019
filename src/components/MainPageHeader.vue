<template>
  <v-app-bar app color="indigo darken-4" dark height="64px">
    <v-btn to="/" icon>
      <v-icon large>home</v-icon>
    </v-btn>
    <v-img :src="require('./../assets/DGLAB_logo.jpg')" max-width="200" />
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
        v-if="$store.state.token != '' && level >= 3"
        @click="drawerEstatisticas"
        icon
      >
        <v-icon large>assessment</v-icon>
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      snackbar: false,
      color: "",
      timeout: 4000,
      text: "",
      counter: 10,
      level: 0
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  watch: {
    //apenas atualiza o nível quando o valor do token muda
    async token(oldToken, newToken) {
      this.level = this.$userLevel();
    }
  },
  created: async function() {
    this.level = this.$userLevel();
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    drawerDefinicoes() {
      this.$emit('drawerDefinicoes');
    },
    drawerEstatisticas() {
      this.$emit('drawerEstatisticas');
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    async testJWT() {
      var res = this.$verifyTokenUser();
      alert(JSON.stringify(res));
    }
  }
};
</script>
