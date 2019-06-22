<template>
  <v-container grid-list-md bg fill-height>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md5>
        <v-card>
          <v-toolbar color="indigo accent-4" dark>
            <v-toolbar-title>Como proceder à autenticação?</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Na plataforma CLAV é possível proceder à autenticação através das
            seguintes formas:
            <ul>
              <li>
                Cartão de Cidadão.
              </li>
              <li>
                Chave Móvel Digital.
              </li>
              <li>
                Email pessoal institucional e respetiva senha de acesso.
              </li>
            </ul>
            Para tal, basta escolher o método de autenticação pretendido,
            através do botão de login correspondente.
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm6 md7>
        <v-card>
          <v-toolbar color="indigo accent-4" dark>
            <v-toolbar-title>Autenticação</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            De modo a aceder à plataforma CLAV, por favor escolha um dos
            seguintes métodos de autenticação.
          </v-card-text>
          <v-card-actions>
            <v-flex>
              Cartão de Cidadão
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" disabled type="submit"
                >Login</v-btn
              >
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-flex>
              Chave Móvel Digital
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" disabled type="submit"
                >Login</v-btn
              >
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-flex>
              Email pessoal institucional
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="loginEmail"
                >Login</v-btn
              >
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md12>
        <v-card>
          <v-card-actions>
            <v-flex>
              É a primeira vez que utiliza estes serviços?
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="registarUtilizador">Registar</v-btn>
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-flex>
              Esqueceu a sua password?
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="recuperarPw">Recuperar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md12>
        <v-card>
          <v-card-actions>
            <v-flex>
              É um fornecedor de serviços? Registe aqui a sua chave API
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="registarApi">Registar</v-btn>
            </v-flex>
            <v-flex>
              A sua chave API expirou? Peça aqui a renovação da sua chave API
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="renovarApi">Renovar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "autenticacao",
  methods: {
    registarUtilizador() {
      this.$router.push("/users/registo");
    },
    recuperarPw() {
      this.$router.push("/users/recuperacao");
    },
    loginEmail() {
      this.$router.push("/users/login");
    },
    //API
    registarApi() {
      this.$router.push("/gestao/api/registo");
    },
    renovarApi(){
      this.$router.push("/gestao/api/renovar");
    }
  }
};
</script>
