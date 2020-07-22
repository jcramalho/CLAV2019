<template>
  <v-content class="px-12">
    <p class="content-title-1">Administração</p>
    <p class="content-text px-8 py-2">
      Área reservada à administração e gestão, sendo possível fazer operações na
      própria plataforma ou também exportar diversas coleções.
    </p>
    <v-container fluid style="text-align: center;">
      <v-row justify="center" align="center">
        <v-col cols="12" md="6">
          <v-btn
            v-if="
              this.$verifyTokenUser().level > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/gestao/administracao')"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="admin-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.717"
              fill="#ffffff"
            />
            <p class="ml-2">Área Administrativa</p>
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            v-if="
              this.$verifyTokenUser().level > 0 &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/gestao/exportarColecoes')"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="exportar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 18.001"
              fill="#ffffff"
            />
            <p class="ml-2">Exportar Coleções</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "AdministracaoInfo",
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
