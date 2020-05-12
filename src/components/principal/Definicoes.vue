<template>
  <v-navigation-drawer
    :value="drawer"
    width="320px"
    right
    absolute
    height="50%"
  >
    <v-toolbar dark class="d-flex justify-center pt-1">
      <v-toolbar-title class="font-weight-medium" id="drawer-title">
        Definições de Utilizador
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-list dense rounded dark>
        <v-list-item-group color="primary">
          <v-list-item @click="$router.push('/users/alteracaoPassword')">
            <v-list-item-content>
              <p class="font-weight-medium">Alterar Password</p>
            </v-list-item-content>
            <svg width="20.71" height="20.404" viewBox="0 0 20.71 20.404">
              <path
                id="refresh_1"
                d="M339.3,714.329a1.276,1.276,0,0,0-1.267,1.094,7.766,7.766,0,0,1-9.351,6.367,7.637,7.637,0,0,1-4.116-2.369h1.905a1.274,1.274,0,1,0,0-2.546h-5.177A1.282,1.282,0,0,0,320,718.147v5.1a1.294,1.294,0,1,0,2.589,0v-2.2a10.39,10.39,0,0,0,18-5.267,1.285,1.285,0,0,0-1.292-1.45Zm.1-10.185a1.287,1.287,0,0,0-1.294,1.272v2.19a10.431,10.431,0,0,0-9.182-3.373,10.323,10.323,0,0,0-8.821,8.659,1.294,1.294,0,0,0,2.563.352,7.788,7.788,0,0,1,13.45-4.013h-1.881a1.274,1.274,0,1,0,0,2.546h5.177a1.308,1.308,0,0,0,.867-.33,1.271,1.271,0,0,0,.427-.942v-5.093a1.287,1.287,0,0,0-1.306-1.268Z"
                transform="translate(-320 -704.136)"
                fill="#FFD54F"
                fill-rule="evenodd"
              />
            </svg>
          </v-list-item>
          <v-list-item @click="logoutUtilizador">
            <v-list-item-content>
              <p class="font-weight-medium">Terminar sessão</p>
            </v-list-item-content>
            <svg width="20.71" height="12.943" viewBox="0 0 20.71 12.943">
              <path
                id="arrow_back_1"
                d="M244.709,711.53a4.53,4.53,0,0,1-4.53,4.53H228.4l1.683,1.67a1.3,1.3,0,0,1-1.839,1.838l-3.883-3.883c-.012-.013-.012-.026-.025-.039a1.088,1.088,0,0,1-.247-.388.048.048,0,0,1-.013-.039,1.1,1.1,0,0,1-.078-.4v-.13a1.3,1.3,0,0,1,.065-.324.387.387,0,0,1,.052-.129,1.232,1.232,0,0,1,.246-.388l3.883-3.883a1.3,1.3,0,1,1,1.839,1.838l-1.683,1.67h11.778a1.941,1.941,0,1,0,0-3.883h-5.824a1.294,1.294,0,0,1-1.294-1.294h0A1.294,1.294,0,0,1,234.355,707h5.824a4.53,4.53,0,0,1,4.53,4.53Z"
                transform="translate(-223.999 -707)"
                fill="#EF5350"
                fill-rule="evenodd"
              />
            </svg>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["level", "drawer"],
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
<style scoped>
#drawer-title {
  font-size: 1.07rem !important;
}
.theme--light.v-navigation-drawer {
  background: linear-gradient(to bottom, #19237e 0%, #0056b6 100%);
  border-radius: 0 0 0 20px;
}
theme--dark.v-footer,
.theme--dark.v-sheet,
.theme--dark.v-card {
  background-color: transparent !important;
}
.v-toolbar {
  box-shadow: none !important;
}
</style>
