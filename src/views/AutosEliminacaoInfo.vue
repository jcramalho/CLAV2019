<template>
  <v-content class="px-12">
    <p class="content-title-1">Autos de Eliminação</p>
    <p class="content-text px-8 py-2">
      Autos de eliminação produzidos ao abrigo de tabela de seleção inserida em
      Portaria de gestão de documentos ou Relatório de avaliação de documentação
      acumulada e submetida à <b>DGLAB</b> para verificação de conformidade.
    </p>
    <p class="content-title-2 px-8 pt-8">
      Para aceder ao catálogo de autos de eliminação selecione a opção
      CONSULTAR.
    </p>
    <p class="content-title-2 px-8 pt-10">
      Existem também as opções:
    </p>
    <v-container fluid class="ma-0 px-12">
      <ul class="px-9 pt-3">
        <li><b>CRIAR</b>, para a criação assistida de autos de eliminação;</li>
        <li><b>IMPORTAR </b>, para submeter autos de eliminação.</li>
      </ul>
    </v-container>
    <p class="content-text px-8 pb-4">
      <u
        >Deve estar registado na CLAV para aceder a estas duas últimas
        funcionalidades.</u
      >
    </p>
    <v-container fluid style="text-align: center;">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-btn
            v-if="
              this.$userLevel() > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/autosEliminacao/criar')"
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
            @click="$router.push('/autosEliminacao')"
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
        <v-col cols="12" md="4">
          <v-btn
            v-if="
              this.$userLevel() > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/autosEliminacao/importar')"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="importar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 18.121"
              fill="#ffffff"
            />
            <p class="ml-2">Importar</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "AutosEliminacaoInfo",

  mounted: async function() {
    window.scrollTo(0, 0);
  }
};
</script>
<style scoped>
ul li {
  list-style: none;
  color: #606060;
  font-size: 0.9em;
  margin-bottom: 1rem;
  position: relative;
}
ul li::before {
  content: "\2022";
  position: absolute;
  left: -2rem;
  top: -2.35rem;
  font-size: 4em;
  color: #4da0d0;
}
</style>
