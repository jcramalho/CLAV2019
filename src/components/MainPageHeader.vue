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
        <v-btn to="/registo" v-if="this.$store.state.user.name===''">
          Registo
        </v-btn>
        <v-btn to="/login" v-if="this.$store.state.user.name===''">
          Login
        </v-btn>
        <span class="font-weight-light" v-if="this.$store.state.user.name!=''">{{ this.$store.state.user.name }}</span>
        <v-btn v-if="this.$store.state.user.name!=''" @click="logoutUtilizador">
          Logout
        </v-btn>
      </v-toolbar-title>
    </v-toolbar>
</template>

<script>
export default {
    methods: {
        goHome: function(){
            this.$router.push('/');
        },
        logoutUtilizador: function(){
            this.$store.state.user.id = '';
					  this.$store.state.user.name = '';
        }
    }
}
</script>

