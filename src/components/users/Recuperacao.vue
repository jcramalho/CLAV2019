<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-container
      fluid
      class="pa-0 ma-auto"
      :class="{
        'px-0': $vuetify.breakpoint.mdAndDown,
        'px-12': $vuetify.breakpoint.lgAndUp
      }"
    >
      <v-row>
        <v-col class="pt-0">
          <v-card flat style="border-radius: 10px !important;">
            <p
              class="content-title-1 py-5"
              style="color: #4da0d0 !important;  text-align:center;"
            >
              Recuperação
            </p>
            <v-card-text class="px-12 content-text">
              De modo a recuperar acesso à sua conta, por favor insira o email
              com o qual se registou na plataforma CLAV. Um email será enviado
              com um endereço no qual pode inserir uma nova password para a sua
              conta.
              <v-form ref="form" lazy-validation>
                <div
                  class="info-content px-3 pb-1 my-4"
                  style="min-height: 50px;"
                >
                  <v-row>
                    <v-col cols="1" class="my-auto">
                      <unicon
                        name="email-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 20.005"
                        fill="#4da0d0"
                      />
                    </v-col>
                    <v-col cols="10" class="ma-0 pa-0">
                      <v-text-field
                        name="email"
                        v-model="form.email"
                        label="Email"
                        type="email"
                        :rules="regraEmail"
                        required
                        color="blue darken-3"
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-row class="align-center pa-3 mt-n3" style="text-align:center;">
                <v-col>
                  <v-btn
                    type="submit"
                    @click="recuperarUtilizador"
                    rounded
                    class="white--text"
                    :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown
                    }"
                    id="default-button"
                  >
                    <unicon
                      name="recuperar-password-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 17.8"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Recuperar</p>
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
                      'px-2': $vuetify.breakpoint.mdAndDown
                    }"
                    style="box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.36) !important;
outline: none !important;"
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
            <v-snackbar
              v-model="snackbar"
              :color="color"
              :timeout="timeout"
              :top="true"
            >
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
  </v-content>
</template>

<script>
export default {
  name: "signup",
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
    recuperarUtilizador() {
      if (this.$refs.form.validate()) {
        this.$request("post", "/users/recuperar", {
          email: this.$data.form.email,
          url: window.location.href
        })
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
          })
          .catch(err => {
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
    }
  }
};
</script>
<style scoped>
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
