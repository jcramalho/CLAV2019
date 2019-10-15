<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" v-if="validJWT">
            <v-toolbar-title>Renovação de chave API</v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="validJWT">
            A sua chave API foi renovada. Ser-lhe-á enviado um novo email com a
            nova chave API!
          </v-card-text>
          <v-card-actions v-if="validJWT">
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="back">
              Voltar
            </v-btn>
          </v-card-actions>
          <v-snackbar
            v-model="snackbar"
            :color="color"
            :timeout="timeout"
            :top="true"
          >
            {{ text }}
            <v-btn text @click="fecharSnackbar">Fechar</v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "renovarApi",
  async mounted() {
    try {
      var res = await this.$request(
        "get",
        "/api/chaves/verificaTokenRenovar/" + this.$route.query.jwt
      );

      await this.$request("put", "/api/chaves/atualizarChave/" + res.data.id)
        .then(res => {
          this.text = "Email enviado com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.validJWT = true;
        })
        .catch(err => {
          this.text = err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    } catch (err) {
      this.$router.push("/users/autenticacao?erro=" + err.response.data);
    }
  },
  data() {
    return {
      validJWT: false,
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: ""
    };
  },
  methods: {
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.$router.push("/");
    },
    back() {
      this.$router.push("/");
    }
  }
};
</script>
