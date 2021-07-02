<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Registo de chave API</p>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card flat>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                prepend-icon="person"
                name="name"
                v-model="form.name"
                label="Nome"
                type="text"
                :rules="regraNome"
                required
              />
              <v-text-field
                prepend-icon="email"
                name="email"
                v-model="form.email"
                label="Email"
                type="email"
                :rules="regraEmail"
                required
              />
              <v-autocomplete
                item-text="label"
                item-value="value"
                :items="ent_list"
                :rules="regraEntidade"
                prepend-icon="account_balance"
                v-model="form.entidade"
                label="Entidade"
                required
              >
              </v-autocomplete>
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
            <v-btn rounded color="error" type="submit" @click="cancelar">Cancelar</v-btn>
            <v-spacer></v-spacer>
            <v-btn rounded color="primary" type="submit" @click="registarChaveApi"
              >Registar</v-btn
            >
          </v-card-actions>
          <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :top="true">
            {{ text }}
            <v-btn text @click="fecharSnackbar">Fechar</v-btn>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "signup",
  async mounted() {
    await this.getEntidades();
  },
  data() {
    return {
      regraNome: [(v) => !!v || "Nome é obrigatório."],
      regraEmail: [
        (v) => !!v || "Email é obrigatório.",
        (v) => /.+@.+/.test(v) || "Email tem de ser válido.",
      ],
      regraEntidade: [(v) => !!v || "Entidade é obrigatório."],
      regraPassword: [(v) => !!v || "Password é obrigatório."],
      form: {
        name: "",
        email: "",
        entidade: "",
        password: "",
      },
      ent_list: [],
      snackbar: false,
      color: "",
      done: false,
      timeout: 4000,
      text: "",
    };
  },
  methods: {
    async getEntidades() {
      await this.$request("get", "/entidades")
        .then((res) => {
          this.ent_list = res.data.map((ent) => {
            return {
              label: ent.sigla + " - " + ent.designacao,
              value: "ent_" + ent.sigla,
            };
          });
        })
        .catch((error) => alert(error));
    },
    registarChaveApi() {
      if (this.$refs.form.validate()) {
        this.$request("post", "/chaves", {
          name: this.$data.form.name,
          email: this.$data.form.email,
          entidade: this.$data.form.entidade,
          // password: this.$data.form.password
        })
          .then((res) => {
            this.text =
              "Chave API registada com sucesso! A chave API foi enviada para o seu email.";
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
