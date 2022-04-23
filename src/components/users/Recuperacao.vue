<template>
  <v-card class="pa-3" flat>
    <v-card-title class="clav-content-title-1"> Recuperação </v-card-title>
    <v-card-text>
      De modo a recuperar acesso à sua conta, por favor insira o email com o qual se
      registou na plataforma CLAV. Um email será enviado com um endereço no qual pode
      inserir uma nova password para a sua conta.
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
      <v-btn rounded color="error" type="submit" @click="cancelar">Cancelar</v-btn>
      <v-spacer></v-spacer>
      <v-btn rounded color="primary" type="submit" @click="recuperarUtilizador">
        Recuperar
      </v-btn>
    </v-card-actions>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: "signup",
  data() {
    return {
      regraEmail: [
        (v) => !!v || "Email é obrigatório.",
        (v) => /.+@.+/.test(v) || "Email tem de ser válido.",
      ],
      form: {
        email: "",
      },
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: "",
    };
  },
  methods: {
    recuperarUtilizador() {
      if (this.$refs.form.validate()) {
        this.$request("post", "/users/recuperar", {
          email: this.$data.form.email,
          url: window.location.href,
        })
          .then((res) => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
          })
          .catch((err) => {
            this.text = err.response.data[0].msg || err.response.data;
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
    },
  },
};
</script>
