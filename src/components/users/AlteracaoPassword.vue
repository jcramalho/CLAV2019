<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" v-if="validJWT">
            <v-toolbar-title>Alteração de password</v-toolbar-title>
          </v-toolbar>
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
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions v-if="validJWT">
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="alterarPW"
              >Alterar password</v-btn
            >
          </v-card-actions>
          <v-snackbar
            v-model="snackbar"
            :color="color"
            :timeout="timeout"
            :top="true"
          >
            {{ text }}
            <v-btn flat @click="fecharSnackbar">Fechar</v-btn>
          </v-snackbar>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  name: "signup",
  async mounted() {
    var res = await axios.get(lhost + "/api/users/listarToken/" + this.$route.query.jwt);
    if (res.data.name == "TokenExpiredError") {
      this.text = "Este link de recuperação expirou!";
      this.color = "error";
      this.snackbar = true;
      this.done = true;
    }else{
      this.validJWT = true;
      this.form.id = res.data._id;
      this.form.name = res.data.name;
    }
  },
  data() {
    return {
      regraPassword: [v => !!v || "Password é obrigatório."],
      form: {
        name: "",
        password: ""
      },
      validJWT: false,
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: ""
    };
  },
  methods: {
    alterarPW(){
      if (this.$refs.form.validate()) {
        axios.put(lhost + "/api/users/alterarPassword", {
            id: this.$data.form.id,
            password: this.$data.form.password
          })
          .then(res => {
            if (res.data === "Password atualizada com sucesso!") {
              this.text = "Password atualizada com sucesso!";
              this.color = "success";
              this.snackbar = true;
              this.done = true;
            }else{
              this.text = "Ocorreu um erro ao atualizar a sua password.";
              this.color = "success";
              this.snackbar = true;
              this.done = false;
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
    }
  }
};
</script>
