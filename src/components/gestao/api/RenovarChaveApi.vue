<template>
  <v-main
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-container fluid class="pa-0 ma-auto">
      <v-row>
        <v-col class="pt-0">
          <v-card flat style="border-radius: 10px !important;">
            <p
              class="content-title-1 py-5"
              style="color: #4da0d0 !important;  text-align:center;"
            >
              Renovação de Chave API
            </p>
            <v-card-text v-if="apikey == ''" class="px-12 content-text">
              A sua chave API tem duração de 30 dias após a sua emissão. Caso
              esses 30 dias tenham passado, pode requisitar aqui uma nova chave
              API, que será associada ao seu email já existente.
              <v-form ref="form" lazy-validation>
                <div
                  class="info-content px-3 pb-1 mt-8 mb-4"
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
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-form>
            </v-card-text>
            <v-card-text
              v-else
              class="mt-n8 px-12 content-text"
              style=" text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22);"
            >
              <p>
                A sua chave API foi renovada com sucesso!
              </p>
              <p>
                A valor da sua chave API agora é:
                <span style="color: green">
                  <b>
                    {{ apikey }}
                  </b>
                </span>
              </p>
              <p>
                A chave API tem a duração de
                <span style="color: red"><b>30 dias</b></span>
                após a sua emissão.
              </p>
            </v-card-text>
            <v-card-actions v-if="apikey == ''">
              <v-row class="align-center pa-3 mt-n3" style="text-align:center;">
                <v-col>
                  <v-btn
                    type="submit"
                    @click="renovar"
                    rounded
                    class="white--text"
                    :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown
                    }"
                    id="default-button"
                  >
                    <unicon
                      name="renovar-api-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 20.404"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Renovar</p>
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
            <v-card-actions v-else>
              <v-row class="align-center pa-3 mt-n3" style="text-align:center;">
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
                      name="arrow-back-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 37.261"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Voltar</p>
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
  </v-main>
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
      text: "",
      apikey: ""
    };
  },
  methods: {
    renovar() {
      if (this.$refs.form.validate()) {
        this.$request("put", "/chaves/renovar?email=" + this.$data.form.email, {
          headers: {
            "Content-length": 0
          }
        })
          .then(res => {
            this.text = "Chave API renovada com sucesso!";
            this.apikey = res.data.apikey;
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
