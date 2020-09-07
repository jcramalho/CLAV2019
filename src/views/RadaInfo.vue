<template>
  <v-content class="px-12">
    <p class="content-title-1">
      Relatórios de Avaliação de Documentação Acumulada
    </p>
    <p class="content-text px-8 py-2">
      TEXTO PARA OS RADA
    </p>
    <p class="content-title-2 px-8 py-10 pb-3">
      Para aceder ao catálogo dos Relatórios de Avaliação de Documentação
      Acumulada selecione a opção CONSULTAR.
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor um novo relatório</b> selecione a opção <b>CRIAR</b>. Deve
      estar <b>registado na CLAV</b> para aceder a esta funcionalidade.
    </p>
    <v-container fluid style="text-align: center;">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-btn
            v-if="
              [4, 5, 6, 7].includes(this.$userLevel()) &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/rada/criar')"
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
            v-if="
              [4, 5, 6, 7].includes(this.$userLevel()) &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/rada')"
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
  name: "RadaInfo",

  mounted: async function() {
    window.scrollTo(0, 0);
  }
};
</script>
