<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Renovação de Chave API</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            A sua chave API tem duração de 30 dias após a sua emissão. Caso
            esses 30 dias tenham passado, pode requisitar aqui uma nova chave
            API, que será associada ao seu email já existente. Receberá no seu
            email um link para realizar a renovação da mesma.
            <v-form ref="form" lazy-validation>
              <v-text-field
                prepend-icon="email"
                name="email"
                v-model="form.email"
                label="Email"
                type="email"
                :rules="regraEmail"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" type="submit" @click="cancelar"
              >Cancelar</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="renovar">
              Renovar
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
  name: "renovar",
  data() {
    return {
      regraEmail: [
        v => !!v || "Email é obrigatório.",
        v => /.+@.+/.test(v) || "Email tem de ser válido."
      ],
      form: {
        email: ""
      },
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: ""
    };
  },
  methods: {
    renovar() {
      if (this.$refs.form.validate()) {
        this.$request("put", "/api/chaves/renovar", {
          email: this.$data.form.email,
          url: window.location.href
        })
          .then(res => {
            if (
              res.data === "Não existe nenhuma chave API associada neste email!"
            ) {
              this.text = "Não existe nenhuma chave API associada neste email!";
              this.color = "error";
              this.snackbar = true;
              this.done = false;
            } else {
              this.text = "Email enviado com sucesso!";
              this.color = "success";
              this.snackbar = true;
              this.done = true;
            }
          })
          .catch(function(err) {
            this.text = err;
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Por favor preencha todos os campos!";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.$router.push("/");
    },
    cancelar() {
      this.$router.push("/users/autenticacao");
    }
  }
};
</script>
