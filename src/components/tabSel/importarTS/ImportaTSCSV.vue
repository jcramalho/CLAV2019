<template>
  <v-layout row wrap ma-2 justify-center>
    <v-flex xs9>
      <v-alert :value="erro != ''" type="error">
        {{ erro }}
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
        >
          Cancelar
        </v-btn>
        <v-btn
          class="white--text ma-2"
          color="indigo darken-4"
          @click="enviarFicheiro()"
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
    erro: ""
  }),

  methods: {
    enviarFicheiro: async function() {
      try {
        var formData = new FormData();
        formData.append("file", this.file[0]);
        var response = await axios.post(
          lhost + "/api/tabelasSelecao/CSV",
          formData
        );
        this.$router.push("/");
      } catch (e) {
        this.erro = "Não foi possível importar o CSV... Tente novamente.";
      }
    },
    cancelar: function() {
      this.$router.push("/");
    }
  }
};
</script>
