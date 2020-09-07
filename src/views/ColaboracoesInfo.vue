<template>
  <v-content class="px-12">
    <p class="content-title-1">Colaborações</p>
    <p class="content-text px-8 py-2">
      As colaborações são constituídas por um grupo de pessoas que participaram
      no desenvolvimento da plataforma.
    </p>
    <p class="content-title-2 px-8 py-10 pb-3">
      Para aceder ao catálogo das colaborações selecione a opção CONSULTAR.
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor uma nova colaboração</b> na plataforma selecione a opção
      <b>CRIAR</b>. Deve estar <b>registado na CLAV</b> para aceder a esta
      funcionalidade.
    </p>
    <v-container fluid style="text-align: center;">
      <v-row justify="center" align="center">
        <v-col
          cols="12"
          md="4"
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
              this.$store.state.token != '' &&
              this.$store.state.name != ''
          "
        >
          <v-btn
            @click="$router.push('/colaboracoes/criar')"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="criar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.721"
              fill="#ffffff"
            />
            <p class="ml-2">Criar</p>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            @click="$router.push('/colaboracoes')"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="consultar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.697"
              fill="#ffffff"
            />
            <p class="ml-2">Consultar</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "Colaboracoes",
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    }
  }
};
</script>
