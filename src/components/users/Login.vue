<template>
  <v-card flat class="ma-3">
    <v-container fluid class="pa-0 ma-auto">
      <v-row>
        <v-col class="pt-0">
          <v-card flat style="border-radius: 10px !important">
            <p
              class="clav-content-title-1"
              style="color: #4da0d0 !important; text-align: center"
            >
              Login
            </p>
            <v-card-text class="px-12">
              <v-form ref="form" lazy-validation>
                <v-row class="mb-4">
                  <v-col cols="1" class="pa-0 my-auto">
                    <unicon
                      name="email-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 20.005"
                      fill="#4da0d0"
                    />
                  </v-col>
                  <v-col cols="11" class="ma-0 pa-0">
                    <div class="info-content py-2 px-3 pb-1" style="min-height: 50px">
                      <v-text-field
                        class="mt-0 px-3"
                        name="email"
                        v-model="form.email"
                        label="Email"
                        type="email"
                        :rules="regraEmail"
                        required
                        color="blue darken-3"
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
                  <v-col cols="1" class="pa-0 my-auto">
                    <unicon
                      name="password-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.7 23.657"
                      fill="#4da0d0"
                    />
                  </v-col>
                  <v-col cols="11" class="ma-0 pa-0">
                    <div class="info-content py-2 px-3 pb-1" style="min-height: 50px">
                      <v-text-field
                        class="mt-0 px-3"
                        name="password"
                        v-model="form.password"
                        label="Password"
                        type="password"
                        :rules="regraPassword"
                        required
                        color="blue darken-3"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-row class="align-center pa-3" style="text-align: center">
                <v-col>
                  <v-btn
                    type="submit"
                    @click="loginUtilizador"
                    rounded
                    class="white--text clav-linear-background"
                    :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown,
                    }"
                  >
                    <unicon
                      name="login-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.711 20.862"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Login</p>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    type="submit"
                    @click="cancelar"
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
                      name="remove-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 20.697"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Cancelar</p>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-snackbar v-model="snackbar" :timeout="timeout" :color="color" :top="true">
              {{ text }}
              <v-btn icon color="white" @click="fecharSnackbar">
                <unicon
                  name="remove-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 20.71 20.697"
                  fill="#ffffff"
                />
              </v-btn>
            </v-snackbar>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { bus } from "../../main";

export default {
  name: "login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      regraEmail: [
        (v) => !!v || "Email é obrigatório.",
        (v) => /.+@.+/.test(v) || "Email tem de ser válido.",
      ],
      regraPassword: [(v) => !!v || "Password é obrigatório."],
      snackbar: false,
      color: "",
      timeout: 4000,
      text: "",
      done: false,
    };
  },
  methods: {
    loginUtilizador() {
      if (this.$refs.form.validate()) {
        this.$request("post", "/users/login", {
          username: this.$data.form.email,
          password: this.$data.form.password,
        })
          .then((res) => {
            if (res.data.token != undefined && res.data.name != undefined) {
              // this.text = "Login efetuado com sucesso!";
              // this.color = "success";
              // this.snackbar = true;
              // this.done = true;
              this.$store.commit("guardaTokenUtilizador", res.data.token);
              this.$store.commit("guardaNomeUtilizador", res.data.name);
              this.$store.commit("guardaEntidade", res.data.entidade);
              this.$router.push("/");
              this.notificacoes();
              // this.$store.state.name = res.data.name;
              // this.$store.state.token = res.data.token;
            } else {
              this.text =
                "Ocorreu um erro ao realizar o login: Por favor verifique as suas credenciais!";
              this.color = "error";
              this.snackbar = true;
              this.done = false;
            }
          })
          .catch((err) => {
            this.text =
              "Ocorreu um erro ao realizar o login: Por favor verifique as suas credenciais!";
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
    notificacoes() {
      bus.$emit("notificacoes", "logged");
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
<style scoped>
.info-content {
  padding: 5px;
  width: 100%;
  background-color: var(--v-secondary-base) !important;
  text-shadow: 0px 1px 2px var(--v-textshadow-base) !important;
  border-radius: 10px;
}
</style>
