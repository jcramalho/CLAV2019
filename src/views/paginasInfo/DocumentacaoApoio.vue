<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Adicionar Documentação Técnica de Apoio</p>
    <p class="clav-content-text px-8 py-2">
      Área reservada à adição de documentação técnica de Apoio para a plataforma.
    </p>

    <v-row justify="center" align="center">
      <v-col cols="12" md="5" justify="center" align="center">
        <v-btn
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/documentacaoApoio/criar/classe')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="criar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.721"
            fill="#ffffff"
          />
          <p class="ml-2">Adicionar Secção</p>
        </v-btn>
      </v-col>
      <v-col cols="12" md="7" justify="center" align="center">
        <v-btn
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/documentacaoApoio/criar/tecnico_cientifico')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="criar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.721"
            fill="#ffffff"
          />
          <p class="ml-2">Adicionar Documento Técnico/Científico</p>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "DocumentacaoApoioInfo",
  mounted() {
    window.scrollTo(0, 0);
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
};
</script>
