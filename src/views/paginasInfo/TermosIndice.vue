<template>
<v-main class="px-12">
    <p class="content-title-1">
        Termos de Índice
    </p>
    <p class="content-text px-8 py-2">
        Lista de termos de índice, aplicados às classes de 3º ou 4º nível.
        Os termos de índice detalham o âmbito de aplicação dos processos de
        negócio e apoiam a recuperação da informação. A criação ou alteração
        de termos de índice é efetuada no âmbito da criação ou alteração das
        classes de 3º nível da Lista Consolidada.
    </p>
    <p class="content-text px-8 py-2">
        Para aceder aos Termos de índice, selecione a opção <b>CONSULTAR</b>.
    </p>
    <!--
    <p class="content-text px-8 py-2">
      Para <b>propor um novo termo</b> selecione a opção <b>CRIAR</b>. Deve
      estar <b>registado na CLAV</b> para aceder a esta funcionalidade.
    </p> -->
    <v-container fluid style="text-align: center;">
        <v-row justify="center" align="center">
            <!--
        <v-col cols="12" md="4">
          <v-btn
            v-if="
              this.$userLevel() > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/termosIndice/criar')"
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
        </v-col>-->
            <v-col cols="12" md="4">
                <v-btn @click="$router.push('/termosIndice')" rounded class="white--text" :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }" id="default-button">
                    <unicon name="consultar-icon" width="20" height="20" viewBox="0 0 20.71 20.697" fill="#ffffff" />
                    <p class="ml-2">Consultar</p>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</v-main>
</template>

<script>
export default {
    name: "RadaInfo",

    mounted: async function () {
        window.scrollTo(0, 0);
    }
};
</script>
