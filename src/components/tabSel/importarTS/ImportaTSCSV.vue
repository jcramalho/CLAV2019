<template>
  <v-layout row wrap ma-2 justify-center>
    <v-flex xs9 class="display-1">
      <v-file-input
        v-model="file"
        label="Importar CSV"
        placeholder="Escolha o seu ficheiro"
        :show-size="1000"
        accept="text/csv"
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
          :disabled="file.length == 0"
        >
          Enviar
        </v-btn>
      </div>
      <v-snackbar
        v-model="sended"
        :timeout="4000"
        color="success"
        :top="true"
      >
        {{ text }}
        <v-btn flat @click="fecharSnackbar">Fechar</v-btn>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    file: [],
    sended: true
  }),

  methods: {
    enviarFicheiro: function() {

    },
    cancelar: function() {
      this.$router.push("/");
    }
  }
};
</script>
