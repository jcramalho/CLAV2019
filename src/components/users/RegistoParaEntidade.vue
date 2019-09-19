<template>
  <v-container fill-height>
    <v-row align-center justify-center>
      <v-col cols="12">
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>
              Registo de utilizadores para uma Entidade
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-select
              :items="entidades"
              label="Entidade"
              v-model="entidade"
              prepend-icon="account_balance"
            >
            </v-select>
            <v-card class="elevation-0">
              <v-card-title>
                <span class="mr-2">Utilizadores</span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on" @click="inserirUtilizador">
                      <v-icon large color="primary">person_add</v-icon>
                    </v-btn>
                  </template>
                  <span>Adicionar novo utilizador</span>
                </v-tooltip>
              </v-card-title>
              <v-card-text>
                <v-form
                  class="pa-4 ma-2 elevation-4"
                  v-for="(user, index) in users"
                  :key="index"
                  ref="forms"
                  lazy-validation
                >
                  <v-text-field
                    prepend-icon="person"
                    name="name"
                    v-model="user.name"
                    label="Nome"
                    type="text"
                    :rules="regraNome"
                    required
                  />
                  <v-text-field
                    prepend-icon="email"
                    name="email"
                    v-model="user.email"
                    label="Email"
                    type="email"
                    :rules="regraEmail"
                    required
                  />
                  <v-text-field
                    id="nic"
                    prepend-icon="credit_card"
                    name="nic"
                    v-model="user.nic"
                    label="Número do Cartão de Cidadão"
                    type="text"
                    :rules="regraNIC"
                    required
                  />
                  <v-select
                    :items="tipos"
                    :rules="regraTipo"
                    prepend-icon="assignment"
                    v-model="user.type"
                    label="Nível de utilizador"
                    required
                  >
                  </v-select>
                  <v-btn
                    class="ma-2"
                    color="error"
                    @click="removerUtilizador(index)"
                  >
                    Remover
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" type="submit" @click="cancelar">
              Cancelar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
              @click="registarUtilizadores"
              :disabled="users.length == 0 || entidade == ''"
            >
              Registar
            </v-btn>
          </v-card-actions>
          <v-snackbar :value="text != ''" :color="color" :top="true">
            {{ text }}
            <v-btn text @click="text = ''">Fechar</v-btn>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  data: () => ({
    tipos: [
      { text: "Administrador de Perfil Tecnológico", value: 7 },
      { text: "Administrador de Perfil Funcional", value: 6 },
      { text: "Utilizador Validador", value: 5 },
      { text: "Utilizador Avançado", value: 4 },
      { text: "Utilizador Decisor", value: 3 },
      { text: "Utilizador Simples", value: 2 },
      { text: "Representante Entidade", value: 1 }
    ],
    regraNome: [v => !!v || "Nome é obrigatório."],
    regraEmail: [
      v => !!v || "Email é obrigatório.",
      v => /^.+@.+\..+$/.test(v) || "Email tem de ser válido."
    ],
    regraNIC: [
      v => !!v || "Número de Cartão de Cidadão é obrigatório.",
      v =>
        /^[0-9]{8}$/.test(v) || "Número de Cartão de Cidadão tem de ser válido."
    ],
    regraTipo: [v => !!v || "Tipo de utilizador é obrigatório."],
    users: [],
    entidades: [],
    entidade: "",
    color: "",
    text: ""
  }),
  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/entidades");
      this.entidades = response.data.map(ent => {
        return {
          text: ent.sigla + " - " + ent.designacao,
          value: ent.sigla
        };
      });
    } catch (error) {
      this.color = "error";
      this.text =
        "Não foi possível obter as entidades... Realize reload da página.";
    }
  },
  methods: {
    inserirUtilizador() {
      var user = {
        name: "",
        email: "",
        nic: "",
        type: ""
      };
      this.users.push(user);
    },
    removerUtilizador(index) {
      this.users.splice(index, 1);
    },
    registarUtilizadores() {
      var valid = true;

      for (var i = 0; i < this.users.length; i++) {
        if (!this.$refs.forms[i].validate()) {
          valid = false;
          this.color = "error";
          this.text = "Por favor preencha todos os campos!";
        }
      }

      if (valid) {
        //TODO: Fazer pedido à API

        this.color = "success";
        this.text = "Utilizadores registados com sucesso!";
      }
    },
    cancelar() {
      this.$router.push("/");
    }
  }
};
</script>
