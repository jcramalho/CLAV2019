<template>
    <v-toolbar app color="indigo darken-4" dark>
      <v-btn to="/" icon>
        <v-icon large>home</v-icon>
      </v-btn>
      <v-toolbar-title class="headline" @click="goHome">
            <span class="text-uppercase">CLAV</span>
            <span class="font-weight-light"> - Classificação e Avaliação da Informação Pública</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-title class="subheading">
        <v-btn to="/registo">
          Registo
        </v-btn>
        <v-btn to="/login">
          Login
        </v-btn>
      </v-toolbar-title>

    </v-toolbar>
</template>

<script>
export default {
    methods: {
        goHome: function(){
            this.$router.push('/');
        }
    }
}
</script>

