<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registo de utilizador</v-toolbar-title>
          </v-toolbar>
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
              <v-flex>
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
              </v-flex>
              <v-flex>
                <v-select
                  :items="[
                    'Administrador de Perfil Tecnológico',
                    'Administrador de Perfil Funcional',
                    'Utilizador Decisor',
                    'Utilizador Validador',
                    'Utilizador Avançado',
                    'Utilizador Arquivo Distrital',
                    'Utilizador Simples',
                    'Representante Entidade'
                  ]"
                  :rules="regraTipo"
                  prepend-icon="assignment"
                  v-model="form.type"
                  label="Nível de utilizador"
                  required
                >
                </v-select>
              </v-flex>
              <v-text-field
                id="password"
                prepend-icon="lock"
                name="password"
                v-model="form.password"
                label="Password"
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
          <v-card-actions>
            <v-btn color="error" type="submit" @click="cancelar"
              >Cancelar</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="registarUtilizador"
              >Registar</v-btn
            >
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
  name: "signup",
  async mounted() {
    await this.getEntidades();
  },
  data() {
    return {
      regraNome: [v => !!v || "Nome é obrigatório."],
      regraEmail: [
        v => !!v || "Email é obrigatório.",
        v => /^.+@.+\..+$/.test(v) || "Email tem de ser válido."
      ],
      regraEntidade: [v => !!v || "Entidade é obrigatório."],
      regraPassword: [v => !!v || "Password é obrigatório."],
      regraTipo: [v => !!v || "Tipo de utilizador é obrigatório."],
      form: {
        name: "",
        email: "",
        entidade: "",
        type: "",
        password: "",
        rep_password: ""
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
    verificaPassword() {
      if (this.form.password != this.form.rep_password) {
        if (this.regraPassword.length == 1) {
          this.regraPassword = this.regraPassword.concat([
            "A password deve ser igual!"
          ]);
        }
      } else {
        if (this.regraPassword.length == 2) {
          this.regraPassword = this.regraPassword.slice(0, 1);
        }
      }
    },
    async getEntidades() {
      await this.$request("get", "/entidades")
        .then(res => {
          this.ent_list = res.data.map(ent => {
            return {
              label: ent.sigla + " - " + ent.designacao,
              value: ent.sigla
            };
          });
        })
        .catch(error => alert(error));
    },
    async registarUtilizador() {
      if (this.$refs.form.validate()) {
        var parsedType;
        switch (this.$data.form.type) {
          case "Administrador de Perfil Tecnológico":
            parsedType = 7;
            break;
          case "Administrador de Perfil Funcional":
            parsedType = 6;
            break;
          case "Utilizador Decisor":
            parsedType = 5;
            break;
          case "Utilizador Validador":
            parsedType = 4;
            break;
          case "Utilizador Avançado":
            parsedType = 3.5;
            break;
          case "Utilizador Arquivo Distrital":
            parsedType = 3;
            break;
          case "Utilizador Simples":
            parsedType = 2;
            break;
          case "Representante Entidade":
            parsedType = 1;
            break;
        }

        try {
          var response = await this.$request("post", "/users/registar", {
            name: this.$data.form.name,
            email: this.$data.form.email,
            entidade: "ent_" + this.$data.form.entidade,
            type: parsedType,
            password: this.$data.form.password
          });

          this.$router.push(
            "/users/listagem?sucesso=" + encodeURIComponent(response.data)
          );
        } catch (err) {
          this.text =
            "Ocorreu um erro ao realizar o registo: " +
            (err.response.data[0].msg || err.response.data);
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        }
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
