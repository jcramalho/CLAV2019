<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col cols="3">
        <v-btn
          rounded
          class="green darken-3 white--text"
          :disabled="!e.sigla"
          @click="guardarTrabalho"
        >Guardar Trabalho</v-btn>
      </v-col>

      <ValidarEntidadeInfoBox :e="e" />

      <v-col>
        <!-- <v-btn dark rounded class="green darken-4" @click="criarEntidade">Criar Entidade</v-btn> -->
        <v-btn dark rounded class="green darken-4">Criar Entidade</v-btn>
      </v-col>

      <v-col>
        <!-- <v-btn dark rounded class="red darken-4" @click="eliminarEntidade">Cancelar Criação</v-btn> -->
        <v-btn dark rounded class="red darken-4">Cancelar Criação</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const lhost = require("@/config/global").host;
const axios = require("axios");

import ValidarEntidadeInfoBox from "@/components/entidades/ValidarEntidadeInfoBox";

export default {
  props: ["e"],
  components: {
    ValidarEntidadeInfoBox
  },
  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Entidade!",
      dialogEntidadeCriada: false,
      numeroErros: 0,
      errosValidacao: false
    };
  },

  methods: {
    guardarTrabalho: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var userBD = await axios.get(
            lhost + "/api/users/listarToken/" + this.$store.state.token
          );
          var pendenteParams = {
            numInterv: 1,
            acao: "Criação",
            tipo: "Entidade",
            objeto: this.e,
            criadoPor: userBD.data.email,
            user: { email: userBD.data.email },
            token: this.$store.state.token
          };
          var response = await axios.post(
            lhost + "/api/pendentes",
            pendenteParams
          );
          this.pendenteGuardado = true;
          this.pendenteGuardadoInfo = JSON.stringify(response.data);
        }
      } catch (error) {
        return error;
      }
    }
  }
};
</script>

<style scoped>
</style>