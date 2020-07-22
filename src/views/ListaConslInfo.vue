<template>
  <v-content class="px-12">
    <p class="content-title-1">Lista Consolidada</p>
    <p class="content-text px-8 py-2">
      A "Lista Consolidada para a classificação e avaliação da informação
      pública" é o referencial disponibilizado pela Direção-Geral do Livro, dos
      Arquivos e das Bibliotecas para servir de base à elaboração de
      instrumentos de gestão da informação, nomeadamente planos de classificação
      e tabelas de seleção. Este referencial apresenta uma estrutura hierárquica
      de classes que representam as funções e atividades executadas pela
      Administração Pública. Os processos de negócio são representados como
      classes de 3º nível, enquadrados em funções (classes de 1º nível) e
      subfunções (2º nível). As classes são constituídas por elementos
      informativos, agrupados por zonas, que as identificam e descrevem. Nas
      classes de 3º e 4º nível (subdivisão do processo de negócio para efeitos
      de avaliação), estes elementos destinam-se também a contextualizar e
      avaliar a informação.
    </p>
    <p class="content-title-2 px-8 py-10 pb-3">
      Para aceder ao catálogo dos processos de negócio selecione a opção
      CONSULTAR.
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor uma nova classe</b> para a Lista Consolidada selecione a
      opção <b>CRIAR</b>. Deve estar <b>registado na CLAV</b> para aceder a esta
      funcionalidade. Consulte as
      <u
        >"Instruções para criação assistida de classes na LC" em Formulários e
        instruções para a CLAV.</u
      >
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor uma alteração</b> a uma classe da Lista Consolidada
      selecione a opção <b>ALTERAR</b>. Deve estar <b>registado na CLAV</b> para
      aceder a esta funcionalidade.
    </p>
    <v-container fluid style="text-align: center;">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-btn
            v-if="
              this.$verifyTokenUser().level > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/classes/criar')"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
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
            @click="$router.push('/classes')"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
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
              this.$verifyTokenUser().level > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/classes/editar')"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="alterar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.727"
              fill="#ffffff"
            />
            <p class="ml-2">Alterar</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "ListaConsolidada",
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
