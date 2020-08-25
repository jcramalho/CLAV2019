<template>
  <v-content class="px-12">
    <p class="content-title-1">API de dados</p>
    <p class="content-text px-8 py-2">
      Acesso à página de documentação da API de dados onde poderá consultar toda
      a informação sobre a mesma e experimentar as várias operações
      <u>(página gerada a partir da especificação em Swagger).</u>
    </p>
    <v-container fluid style="text-align: center;">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-btn
            @click="go(url)"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="api-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.71"
              fill="#ffffff"
            />
            <p class="ml-2">Aceder</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
const lhost = require("@/config/global").host;
export default {
  name: "ApiDadosInfo",
  data() {
    return {
      url: lhost + "/docs"
    };
  },
  methods: {
    go: function(url) {
      console.log(url);
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
