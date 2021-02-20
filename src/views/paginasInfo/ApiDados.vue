<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">API de dados</p>
    <p class="content-text px-8 py-2">
      Página gerada a partir da especificação em Swagger, que permite às entidades
      otimizar as funcionalidades disponíveis na plataforma CLAV, nomeadamente através da
      criação de automatismos.
    </p>
    <p class="content-text px-8 py-2">
      Para aceder à página API de dados, selecione a opção <b>CONSULTAR</b>.
    </p>
    <v-row justify="center" align="center">
      <v-col cols="12" md="4" justify="center" align="center">
        <v-btn
          @click="go(url)"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="api-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.71"
            fill="#ffffff"
          />
          <p class="ml-2">Consultar</p>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
const lhost = require("@/config/global").host;
export default {
  name: "ApiDadosInfo",
  data() {
    return {
      url: lhost + "/docs",
    };
  },
  methods: {
    go: function (url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
  },
  mounted() {
    window.scrollTo(0, 0);
  },
};
</script>
