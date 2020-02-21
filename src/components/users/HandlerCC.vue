<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-col v-if="!isMounted" style="text-align:center">
          <v-progress-circular
            indeterminate
            size="100"
            width="10"
            color="indigo accent-4"
          />
        </v-col>
        <v-card
          class="elevation-12"
          v-if="isMounted && successfullAuthentication"
        >
          <v-toolbar dark color="primary">
            <v-toolbar-title>
              Autenticação de utilizador via Cartão de Cidadão
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Desculpe mas <b>não se encontra registado</b> na plataforma CLAV.
            <br />
            Se já foi registado pela DGLAB e apareceu-lhe esta mensagem
            comunique com a DGLAB por forma a perceber o que correu de errado no
            registo da sua conta.
            <br />
            Caso ainda não se encontre registado, consulte
            <a href="/">Home > Registo na CLAV > Como registar-se na CLAV</a>
            onde é explicado como se pode registar.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="cancelar()">
              Voltar
            </v-btn>
          </v-card-actions>
          <!-- <v-toolbar dark color="primary">
            <v-toolbar-title>
              Registo de utilizador via Cartão de Cidadão
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                prepend-icon="person"
                name="name"
                :value="this.nomeCompleto"
                disabled
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
                    'Utilizador Validador (AD)',
                    'Utilizador Avançado',
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
          </v-snackbar>-->
        </v-card>
        <v-card
          class="elevation-12"
          v-if="isMounted && !successfullAuthentication"
        >
          <v-toolbar dark color="primary">
            <v-toolbar-title>
              <!--Registo de utilizador via Cartão de Cidadão-->
              Autenticação de utilizador via Cartão de Cidadão
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Ocorreu um erro durante a autenticação com o Cartão de Cidadão! Por
            favor verifique se introduziu o PIN de autenticação corretamente.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="cancelar()">
              Voltar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "signup",
  data: () => ({
    successfullAuthentication: false,
    alreadyRegistered: false,
    nic: undefined,
    nomeCompleto: undefined,
    token: undefined,
    entidade: undefined,
    /*regraEmail: [
      v => !!v || "Email é obrigatório.",
      v => /.+@.+/.test(v) || "Email tem de ser válido."
    ],
    regraEntidade: [v => !!v || "Entidade é obrigatório."],
    regraTipo: [v => !!v || "Tipo de utilizador é obrigatório."],
    form: {
      email: "",
      entidade: "",
      type: ""
    },
    ent_list: [],
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",*/
    isMounted: false
  }),
  async mounted() {
    if (this.$route.query.NIC != undefined)
      this.nic = Buffer.from(this.$route.query.NIC, "base64").toString();
    if (this.$route.query.Nome != undefined)
      this.nomeCompleto = Buffer.from(
        this.$route.query.Nome,
        "base64"
      ).toString();
    if (this.$route.query.Token != undefined)
      this.token = this.$route.query.Token;
    if (this.$route.query.Entidade != undefined)
      this.entidade = Buffer.from(
        this.$route.query.Entidade,
        "base64"
      ).toString();

    this.alreadyRegistered =
      this.token != undefined &&
      this.nomeCompleto != undefined &&
      this.entidade != undefined;

    if (this.alreadyRegistered) {
      this.$store.commit("guardaTokenUtilizador", this.token);
      this.$store.commit("guardaNomeUtilizador", this.nomeCompleto);
      this.$router.push("/");
    }

    this.successfullAuthentication =
      this.nic != undefined && this.nomeCompleto != undefined;
    // await this.getEntidades();
    this.isMounted = true;
  },
  methods: {
    /*async getEntidades() {
      await this.$request("get", "/api/entidades")
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
    registarUtilizador() {
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
          case "Utilizador Validador (AD)":
            parsedType = 3.5;
            break;
          case "Utilizador Avançado":
            parsedType = 3;
            break;
          case "Utilizador Simples":
            parsedType = 2;
            break;
          case "Representante Entidade":
            parsedType = 1;
            break;
        }
        this.$request("post", "/api/users/registarCC", {
          nic: this.nic,
          name: this.nomeCompleto,
          email: this.$data.form.email,
          entidade: this.$data.form.entidade,
          type: parsedType
        })
          .then(res => {
            this.text =
              "Utilizador registado com sucesso!\n Pode agora utilizar o login via cartão de cidadão para usufruir da plataforma CLAV!";
            this.color = "success";
            this.snackbar = true;
            this.done = true;
          })
          .catch(err => {
            this.text =
              "Ocorreu um erro ao registar o utilizador: " + err.response.data;
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
    },*/
    cancelar() {
      this.$router.push("/users/autenticacao");
    }
  }
};
</script>
