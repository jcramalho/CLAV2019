<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Utilizadores</p>
    <p class="content-text px-8 py-2">
      A partir desta página será possível gerir todos os utilizadores presentes na
      plataforma, sendo possível, dependendo do nível de acesso atribuído, consultar todos
      os utilizadores registados na plataforma e seus detalhes, registar utilizadores para
      uma dada entidade, analisar acessos à plataforma, etc.
    </p>
    <v-row justify="center" align="center">
      <v-col cols="12" md="4" justify="center" align="center">
        <v-btn
          v-if="
            this.$userLevel() > 0 &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/users/registoParaEntidade')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="users-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.451"
            fill="#ffffff"
          />
          <p class="ml-2">Registar Utilizadores</p>
        </v-btn>
      </v-col>
      <v-col cols="12" md="4" justify="center" align="center">
        <v-btn
          @click="$router.push('/users/listagem')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="consultar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
          <p class="ml-2">Consultar Utilizadores</p>
        </v-btn>
      </v-col>
      <v-col cols="12" md="4" justify="center" align="center">
        <v-btn
          v-if="
            this.$userLevel() > 0 &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/users/registoAcesso')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="analise-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 15.575"
            fill="#ffffff"
          />
          <p class="ml-2">Registo de Acessos</p>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "UsersInfo",
  mounted() {
    window.scrollTo(0, 0);
  },
};
</script>
