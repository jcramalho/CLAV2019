<template>
  <v-layout row wrap ma-2 justify-center>
    <v-flex xs9>
      <v-alert :value="erro != ''" type="error">
        {{ erro }}
      </v-alert>
      <v-alert :value="success != ''" type="success">
        {{ success }}
      </v-alert>
      <v-file-input
        v-model="file"
        label="Importar CSV/Excel"
        placeholder="Escolha o seu ficheiro"
        show-size
        accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple
      ></v-file-input>
      <div class="text-center">
        <v-btn
          class="white--text ma-2"
          color="indigo darken-4"
          @click="cancelar()"
          :disabled="loading"
        >
          Voltar
        </v-btn>
        <v-btn
          class="white--text ma-2"
          color="indigo darken-4"
          @click="enviarFicheiro()"
          :loading="loading"
          :disabled="file == null"
        >
          Enviar
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  data: () => ({
    file: null,
    erro: "",
    success: "",
    loading: false
  }),

  methods: {
    enviarFicheiro: async function() {
      try {
        this.erro = "";
        this.success = "";
        this.loading = true;
        var formData = new FormData();
        formData.append("file", this.file[0]);

        var userBD = await axios.get(
          lhost + "/api/users/listarToken/" + this.$store.state.token
        );

        formData.append("email", userBD.data.email);

        var response = await axios.post(
          lhost + "/api/tabelasSelecao/CSV",
          formData
        );
        this.loading = false;
        this.success = `Pedido de criação de tabela de seleção criado com sucesso a partir do ficheiro importado. Código do pedido: ${
          response.data
        }`;
      } catch (e) {
        this.loading = false;
        this.erro = "Não foi possível importar o CSV/Excel... Tente novamente.";
      }
    },
    cancelar: function() {
      this.$router.push("/");
    }
  }
};
</script>
