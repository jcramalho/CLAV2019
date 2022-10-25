<template>
  <v-card class="pa-3" flat>
    <v-card-title class="clav-content-title-1" v-if="validJWT"
      >Alteração de password</v-card-title
    >
    <v-card-text v-if="validJWT">
      <v-form ref="form" lazy-validation>
        <v-text-field
          prepend-icon="person"
          label="Nome"
          type="text"
          v-model="form.name"
          disabled
        />
        <v-text-field
          id="password"
          prepend-icon="lock"
          name="password"
          v-model="form.password"
          label="Nova Password"
          type="password"
          :rules="regraPassword"
          @input="verificaPassword()"
          required
        />
        <v-text-field
          id="rep_password"
          prepend-icon="lock"
          name="rep_password"
          v-model="form.rep_password"
          label="Repita a Password"
          type="password"
          :rules="regraPassword"
          @input="verificaPassword()"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions v-if="validJWT">
      <v-spacer></v-spacer>
      <v-btn color="primary" type="submit" rounded @click="alterarPW"
        >Alterar password</v-btn
      >
    </v-card-actions>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :top="true">
      {{ text }}
      <v-btn text rounded @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: "signup",
  mounted: async function () {
    var jwt = this.$verifyTokenUser(this.$route.query.jwt);
    this.validJWT = true;
    this.form.id = jwt.id;
    this.form.name = jwt.name;
  },
  data() {
    return {
      regraPassword: [(v) => !!v || "Password é obrigatório."],
      form: {
        name: "",
        password: "",
        rep_password: "",
      },
      validJWT: false,
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: "",
    };
  },
  methods: {
    verificaPassword() {
      if (this.form.password != this.form.rep_password) {
        if (this.regraPassword.length == 1) {
          this.regraPassword = this.regraPassword.concat(["A password deve ser igual!"]);
        }
      } else {
        if (this.regraPassword.length == 2) {
          this.regraPassword = this.regraPassword.slice(0, 1);
        }
      }
    },
    alterarPW() {
      if (this.$refs.form.validate()) {
        this.$request(
          "put",
          "/users/" + this.$data.form.id + "/password?token=" + this.$route.query.jwt,
          {
            novaPassword: this.$data.form.password,
          }
        )
          .then((res) => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
          })
          .catch((err) => {
            this.text = "Ocorreu um erro ao atualizar a sua password.";
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
  },
};
</script>
