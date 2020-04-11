<template>
  <v-container fluid fill-height>
    <v-row row wrap justify-center>
      <v-col cols="12">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>
              Renovação de Chave API
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="apikey == ''" class="headline">
            A sua chave API tem duração de 30 dias após a sua emissão. Caso
            esses 30 dias tenham passado, pode requisitar aqui uma nova chave
            API, que será associada ao seu email já existente.
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
          <v-card-text v-else class="headline">
            <p>
              A sua chave API foi renovada com sucesso!
            </p>
            <p>
              A valor da sua chave API agora é:
            </p>
            <span class="subtitle-2" style="color: green">
              <b>
                {{ apikey }}
              </b>
            </span>
            <p>
              A chave API tem a duração de
              <span style="color: red"><b>30 dias</b></span>
              após a sua emissão.
            </p>
          </v-card-text>
          <v-card-actions v-if="apikey == ''">
            <v-btn color="error" type="submit" @click="cancelar">
              Cancelar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="renovar">
              Renovar
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <v-spacer></v-spacer>
            <v-btn color="error" type="submit" @click="cancelar">
              Voltar
            </v-btn>
            <v-spacer></v-spacer>
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
      </v-col>
    </v-row>
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
