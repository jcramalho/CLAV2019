<template>
    <v-navigation-drawer
      :value="drawer"
      right
      absolute
    >
      <v-toolbar :color="panelHeaderColor" dark>
        <v-toolbar-title> Indicadores </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-list dense>
          <v-list-item-group 
            color="primary"
          >
            <v-list-item @click="$router.push('/gestao/gerais')">
              <v-list-item-content>
                Métricas Gerais
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>donut_small</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item @click="$router.push('/gestao/metrica')">
              <v-list-item-content>
                Métricas de API
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>donut_small</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item @click="$router.push('/gestao/classes')">
              <v-list-item-content>
                Métricas de Classes
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>donut_small</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item @click="$router.push('/gestao/tabela')">
              <v-list-item-content>
                Tabela de Indicadores
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>table_chart</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-navigation-drawer>
</template>

<script>
export default {
  props: ["level","drawer"],

  data() {
    return {
      panelHeaderColor: "indigo darken-4",
    };
  },
  methods: {
    logoutUtilizador() {
      this.text = "Logout efetuado com sucesso!";
      this.color = "success";
      this.snackbar = true;
      // this.$store.state.name = '';
      // this.$store.state.token = '';
      this.$store.commit("guardaTokenUtilizador", "");
      this.$store.commit("guardaNomeUtilizador", "");
      this.$store.commit("guardaEntidade", "");

      //se já está na página inicial (home)
      if (this.$route.path == "/") {
        //faz reload da página para atualizar os componentes que dependem do nível do utilizador
        this.$router.go();
      } else {
        this.$router.push("/");
      }
    }
  }
};
</script>
