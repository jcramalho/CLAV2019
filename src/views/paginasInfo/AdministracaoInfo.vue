<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Administração</p>
    <p class="content-text px-8 py-2">
      Área reservada à administração e gestão, sendo possível fazer operações na própria
      plataforma e API de dados, ou também exportar/eliminar diversas coleções.
    </p>
    <v-row justify="center" align="center">
      <v-col cols="12" md="6" justify="center" align="center">
        <v-btn
          v-if="
            this.$userLevel() === 7 &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/gestao/administracao')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
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
      <v-col cols="12" md="6" justify="center" align="center">
        <v-btn
          v-if="
            this.$userLevel() === 7 &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/gestao/alterarParametros')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="api-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.71"
            fill="#ffffff"
          />
          <p class="ml-2">Alterar Parâmetros API Dados</p>
        </v-btn>
      </v-col>
      <v-col cols="12" md="6" justify="center" align="center">
        <v-btn
          v-if="
            this.$userLevel() === 7 &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/gestao/exportarColecoes')"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
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
      <v-col cols="12" md="6" justify="center" align="center">
        <v-btn
          v-if="
            this.$userLevel() === 7 &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="$router.push('/gestao/apagarColecoes')"
          color="red darken-4"
          rounded
          class="white--text"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
          style="
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
              0 2px 4px -1px rgba(0, 0, 0, 0.36) !important;
            outline: none !important;
          "
        >
          <unicon
            name="eliminar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.71"
            fill="#ffffff"
          />
          <p class="ml-2">Apagar Coleções</p>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "AdministracaoInfo",
  mounted() {
    window.scrollTo(0, 0);
  },
};
</script>
