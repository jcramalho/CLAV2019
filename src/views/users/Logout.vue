<template>
  <v-col style="text-align:center;">
    <v-progress-circular
      indeterminate
      size="100"
      width="10"
      color="indigo accent-4"
    />
  </v-col>
</template>

<script>
export default {
  created() {
    // this.$store.state.name = '';
    // this.$store.state.token = '';
    this.$store.commit("guardaTokenUtilizador", "");
    this.$store.commit("guardaNomeUtilizador", "");
    this.$store.commit("guardaEntidade", "");

    //se já está na página inicial (home)
    if (this.$route.path == "/") {
      //faz reload da página para atualizar os componentes que dependem do nível do utilizador
      this.$router.go();
    } else {
      this.$router.push(
        "/?sucesso=" + encodeURIComponent("Logout efetuado com sucesso!")
      );
    }
  }
};
</script>
