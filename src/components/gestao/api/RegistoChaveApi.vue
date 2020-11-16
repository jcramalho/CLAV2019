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
              Registo de Chave API
            </p>
            <v-card-text class="px-12">
              <v-form ref="form" lazy-validation>
                <v-row class="mb-4">
                  <v-col cols="1" class="pa-0 my-auto">
                    <unicon
                      name="perfil-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 23.677"
                      fill="#4da0d0"
                    />
                  </v-col>
                  <v-col cols="11" class="ma-0 pa-0">
                    <div
                      class="info-content py-2 px-3 pb-1"
                      style="min-height: 50px;"
                    >
                      <v-text-field
                        name="name"
                        v-model="form.name"
                        label="Nome"
                        type="text"
                        :rules="regraNome"
                        required
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
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
                    <div
                      class="info-content py-2 px-3 pb-1"
                      style="min-height: 50px;"
                    >
                      <v-text-field
                        name="email"
                        v-model="form.email"
                        label="Email"
                        type="email"
                        :rules="regraEmail"
                        required
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
                  <v-col cols="1" class="pa-0 my-auto">
                    <unicon
                      name="entidade-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 20.711 21.105"
                      fill="#4da0d0"
                    />
                  </v-col>
                  <v-col cols="11" class="ma-0 pa-0">
                    <div
                      class="info-content py-2 px-3 pb-1"
                      style="min-height: 50px;"
                    >
                      <v-autocomplete
                        item-text="label"
                        item-value="value"
                        :items="ent_list"
                        :rules="regraEntidade"
                        v-model="form.entidade"
                        label="Entidade"
                        required
                      >
                      </v-autocomplete>
                    </div>
                  </v-col>
                </v-row>
                <!-- <v-text-field
                id="password"
                prepend-icon="lock"
                name="password"
                v-model="form.password"
                label="Password"
                type="password"
                :rules="regraPassword"
                required
              /> -->
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-row class="align-center pa-3" style="text-align:center;">
                <v-col>
                  <v-btn
                    type="submit"
                    @click="registarChaveApi"
                    rounded
                    class="white--text"
                    :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown
                    }"
                    id="default-button"
                  >
                    <unicon
                      name="api-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 20.71"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Registar</p>
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
  async mounted() {
    await this.getEntidades();
  },
  data() {
    return {
      regraNome: [v => !!v || "Nome é obrigatório."],
      regraEmail: [
        v => !!v || "Email é obrigatório.",
        v => /.+@.+/.test(v) || "Email tem de ser válido."
      ],
      regraEntidade: [v => !!v || "Entidade é obrigatório."],
      regraPassword: [v => !!v || "Password é obrigatório."],
      form: {
        name: "",
        email: "",
        entidade: "",
        password: ""
      },
      ent_list: [],
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: ""
    };
  },
  methods: {
    async getEntidades() {
      await this.$request("get", "/entidades")
        .then(res => {
          this.ent_list = res.data.map(ent => {
            return {
              label: ent.sigla + " - " + ent.designacao,
              value: "ent_" + ent.sigla
            };
          });
        })
        .catch(error => alert(error));
    },
    registarChaveApi() {
      if (this.$refs.form.validate()) {
        this.$request("post", "/chaves", {
          name: this.$data.form.name,
          email: this.$data.form.email,
          entidade: this.$data.form.entidade
          // password: this.$data.form.password
        })
          .then(res => {
            this.text =
              "Chave API registada com sucesso! A chave API foi enviada para o seu email.";
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
